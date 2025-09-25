import os
import logging
from typing import Optional
from pathlib import Path
import aiofiles
import pandas as pd
from docx import Document
import PyPDF2
import io
import pytesseract
from pdf2image import convert_from_path
import pytesseract

# Tell pytesseract where the binary is
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


logger = logging.getLogger(__name__)

class FileProcessor:
    """Service for processing different file types and extracting text"""
    
    SUPPORTED_TYPES = {
        'application/pdf': 'pdf',
        'application/msword': 'doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
        'application/vnd.ms-excel': 'xls',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
        'text/plain': 'txt',
        'text/csv': 'csv'
    }
    
    async def extract_text(self, file_path: str, content_type: Optional[str] = None) -> str:
        """
        Extract text from various file formats
        """
        try:
            # Determine file type
            file_extension = Path(file_path).suffix.lower()
            
            if file_extension == '.pdf':
                file_type = 'pdf'
            elif file_extension in ['.doc']:
                file_type = 'doc'
            elif file_extension in ['.docx']:
                file_type = 'docx'
            elif file_extension in ['.xls']:
                file_type = 'xls'
            elif file_extension in ['.xlsx']:
                file_type = 'xlsx'
            elif file_extension in ['.txt']:
                file_type = 'txt'
            elif file_extension in ['.csv']:
                file_type = 'csv'
            elif content_type in self.SUPPORTED_TYPES:
                file_type = self.SUPPORTED_TYPES[content_type]
            else:
                raise ValueError(f"Unsupported file type: {file_extension}")
            
            # Extract text based on file type
            if file_type == 'pdf':
                return await self._extract_pdf_text(file_path)
            elif file_type == 'docx':
                return await self._extract_docx_text(file_path)
            elif file_type in ['xls', 'xlsx']:
                return await self._extract_excel_text(file_path)
            elif file_type == 'txt':
                return await self._extract_txt_text(file_path)
            elif file_type == 'csv':
                return await self._extract_csv_text(file_path)
            else:
                raise ValueError(f"Unsupported file type for extraction: {file_type}")
                
        except Exception as e:
            logger.error(f"Error extracting text from {file_path}: {str(e)}")
            raise
    
    async def _extract_pdf_text(self, file_path: str) -> str:
        """Extract text from PDF file (with OCR fallback for scanned PDFs)"""
        try:
            text = ""
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"

            # Fallback to OCR if PyPDF2 gave nothing
            if not text.strip():
                images = convert_from_path(file_path)
                for img in images:
                    text += pytesseract.image_to_string(img) + "\n"
            return text.strip()
        except Exception as e:
            logger.error(f"Error reading PDF {file_path}: {str(e)}")
            return ""
    
    async def _extract_docx_text(self, file_path: str) -> str:
        """Extract text from DOCX file"""
        try:
            doc = Document(file_path)
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text.strip()
        except Exception as e:
            logger.error(f"Error reading DOCX {file_path}: {str(e)}")
            return ""
    
    async def _extract_excel_text(self, file_path: str) -> str:
        """Extract text from Excel file"""
        try:
            # Read all sheets
            excel_file = pd.ExcelFile(file_path)
            text = ""
            
            for sheet_name in excel_file.sheet_names:
                df = pd.read_excel(file_path, sheet_name=sheet_name)
                text += f"Sheet: {sheet_name}\n"
                text += df.to_string(index=False) + "\n\n"
            
            return text.strip()
        except Exception as e:
            logger.error(f"Error reading Excel {file_path}: {str(e)}")
            return ""
    
    async def _extract_txt_text(self, file_path: str) -> str:
        """Extract text from TXT file"""
        try:
            async with aiofiles.open(file_path, 'r', encoding='utf-8') as file:
                return await file.read()
        except UnicodeDecodeError:
            # Try with different encoding
            try:
                async with aiofiles.open(file_path, 'r', encoding='latin-1') as file:
                    return await file.read()
            except Exception as e:
                logger.error(f"Error reading TXT {file_path}: {str(e)}")
                return ""
        except Exception as e:
            logger.error(f"Error reading TXT {file_path}: {str(e)}")
            return ""
    
    async def _extract_csv_text(self, file_path: str) -> str:
        """Extract text from CSV file"""
        try:
            df = pd.read_csv(file_path)
            return df.to_string(index=False)
        except Exception as e:
            logger.error(f"Error reading CSV {file_path}: {str(e)}")
            return ""