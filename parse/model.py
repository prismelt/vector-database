from pydantic import BaseModel, create_model, field_validator
from typing import Literal, Dict, Type


type_mapping = {"number": float, "text": str, "boolean": bool}


class BaseSchema(BaseModel):
    data: Dict[str, Literal["number", "text", "boolean"]]

    @field_validator("data")
    def validate_data_key(cls, value: dict[str, Literal["number", "text", "boolean"]]):
        if any(not key.strip() for key in value.keys()):
            raise ValueError("Data keys cannot be empty")
        return value


def generate_model(base_schema: BaseSchema) -> Type[BaseModel]:
    fields = {key: type_mapping[value] for key, value in base_schema.data.items()}
    return create_model("GeneratedModel", **fields)  # type: ignore
