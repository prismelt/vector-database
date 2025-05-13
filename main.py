from fastapi import FastAPI
from typing import Optional
from query import basic_query
from insertion import add, new_database
from pymilvus import MilvusClient
from parse import (
    PostJsonSchema,
    pdf_to_string,
    BaseSchema,
    generate_model,
    InformationSchema,
    get_ai_client,
    api,
)
from deletion import remove, drop

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


client = MilvusClient(url="http://localhost:19530")


@app.get("/query/basic")
async def query(
    prompt: str,
    collection_name: str,
    db_id: Optional[int] = None,
    limit: int = 2,
):
    response = basic_query(client, collection_name, prompt, db_id=db_id, limit=limit)
    print(response)
    return response


@app.post("/query/ai")
async def add_collection(request: InformationSchema):
    response_schema = request.response_schema
    model = generate_model(response_schema)
    prompt = request.prompt
    collection_name = request.collection_name
    db_id = request.db_id

    result = basic_query(client, collection_name, prompt, db_id=db_id, limit=1)

    print(result)

    return result

    # todo: implement this portion
    # ai_client = get_ai_client()
    # response = api.post(
    #     ai_client,
    #     prompt + result,
    #     model,
    # )
    # return response


@app.post("/")
async def add_document(request: PostJsonSchema):
    if not client.has_collection(request.collection_name):
        new_database(client, request.collection_name)
    add(
        client,
        request.collection_name,
        pdf_to_string(request.document),
        file_name=request.file_name,
    )
    return {"status": "success"}


@app.delete("/")
async def delete_document(collection_name: str, ids: list[int]):
    remove(client, collection_name, ids)
    return {"status": "success"}


@app.delete("/{collection}")
async def delete_collection(collection: str):
    drop(client, collection)
    return {"status": "success"}
