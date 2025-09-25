from pydantic import BaseModel
from typing import List, Optional

class Statistics(BaseModel):
    originalLength: int
    summaryLength: int
    compressionRatio: float

class SummaryResponse(BaseModel):
    keyPoints: List[str]
    summary: str
    statistics: Optional[Statistics] = None

class HealthResponse(BaseModel):
    status: str