from pydantic import BaseModel
from typing import Optional
from .model import BaseSchema


class PostJsonSchema(BaseModel):
    collection_name: str
    document: str
    file_name: Optional[str]
    db_id: Optional[int]


class InformationSchema(BaseModel):
    prompt: str
    collection_name: str
    db_id: Optional[int]
    response_schema: BaseSchema
