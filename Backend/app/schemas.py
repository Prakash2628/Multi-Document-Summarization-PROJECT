from pydantic import BaseModel
from typing import List, Optional

class SummarizeRequest(BaseModel):
    texts: Optional[List[str]] = None        # raw texts
    filenames: Optional[List[str]] = None    # optional doc names
    max_chunk_tokens: Optional[int] = 800    # chunk size (tokens, approx)
    max_summary_length: Optional[int] = 150 # tokens for final summary

class SummarizeResponse(BaseModel):
    title: Optional[str] = None
    key_points: List[str]
    summary: str
