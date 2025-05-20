from pydantic import BaseModel
from typing import Optional
from .model import BaseSchema


class InformationSchema(BaseModel):
    prompt: str
    collection_name: str
    db_id: Optional[int]
    response_schema: BaseSchema
