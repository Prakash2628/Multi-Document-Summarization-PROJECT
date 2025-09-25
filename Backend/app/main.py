import os
import asyncio
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Union
import uvicorn
from pathlib import Path
import tempfile
import logging
from fastapi.responses import JSONResponse


from app.file_processor import FileProcessor
from app.summarizer import SummarizerService
from model.response_models import SummaryResponse, HealthResponse

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
file_processor = FileProcessor()
summarizer = SummarizerService()


@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(status="healthy")


@app.post("/summarize", response_model=SummaryResponse)
async def summarize_content(
    files: Optional[Union[UploadFile, List[UploadFile]]] = File(None),
    text: Optional[str] = Form(None),
):
    """
    Summarize uploaded files (supports multiple) or provided text
    """
    try:
        content = ""

        # Process uploaded files
        file_list = []
        if files:
            if isinstance(files, list):
                file_list = files
            else:
                file_list = [files]
            for file in file_list:
                if not file.filename:
                    continue

                # Save file temporarily
                with tempfile.NamedTemporaryFile(
                    delete=False, suffix=Path(file.filename).suffix
                ) as tmp_file:
                    content_bytes = await file.read()
                    tmp_file.write(content_bytes)
                    tmp_file_path = tmp_file.name

                try:
                    # Extract text from file
                    file_content = await file_processor.extract_text(
                        tmp_file_path, file.content_type
                    )
                    if file_content:
                        content += f"\n\n{file_content}"
                finally:
                    # Always clean up temp file
                    os.unlink(tmp_file_path)

        # If no files, fallback to text
        elif text:
            content = text

        # If nothing provided
        if not content.strip():
            raise HTTPException(
                status_code=400, detail="Upload correct file or provide text to summarize 🤔"
            )

        # Generate summary
        result = await summarizer.summarize(content.strip())
        return result

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during summarization: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

'''@app.options("/summarize")
async def options_handler():
    return JSONResponse(
        content={"message": "CORS preflight ok"},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        },
    )'''

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )