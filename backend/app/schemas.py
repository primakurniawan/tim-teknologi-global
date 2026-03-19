from pydantic import BaseModel
from typing import List
from datetime import datetime


class ImportRowError(BaseModel):
    row_number: int
    message: str


class ImportSummary(BaseModel):
    total_rows: int
    accepted_rows: int
    rejected_rows: int
    validation_errors: List[ImportRowError]


class ChartData(BaseModel):
    label: str
    value: int