from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from typing import Optional
from query import basic_query
from insertion import add, new_database
from pymilvus import MilvusClient, __version__
from parse import (
    pdf_to_string,
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

print(__version__)


client = MilvusClient(host="localhost", port=19530)


@app.get("/query/basic")
async def query(
    prompt: str,
    collection_name: str,
    db_id: Optional[int] = None,
    limit: int = 2,
):
    response = basic_query(client, collection_name, prompt, db_id=db_id, limit=limit)
    return response


@app.post("/query/ai")
async def intelligent_query(request: InformationSchema):
    response_schema = request.response_schema
    model = generate_model(response_schema)
    prompt = request.prompt
    collection_name = request.collection_name
    db_id = request.db_id

    result = basic_query(client, collection_name, prompt, db_id=db_id, limit=1)
    print(result)

    ai_client = get_ai_client()
    response = api.post(
        ai_client,
        prompt + result,
        model,
    )
    return response


@app.post("/")
async def add_document(
    collection_name: str = Form(...),
    document: UploadFile = File(...),
    file_name: Optional[str] = Form(None),
    db_id: Optional[int] = Form(None),
):
    print("Upload started")
    if document.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type")
    if not client.has_collection(collection_name):
        new_database(client, collection_name)
    add(
        client,
        collection_name,
        pdf_to_string(await document.read()),
        file_name=file_name,
        db_id=db_id,
    )
    print("Upload successful")
    return {"status": "success"}


@app.delete("/")
async def delete_document(collection_name: str, ids: list[int]):
    remove(client, collection_name, ids)
    return {"status": "success"}


@app.delete("/{collection}")
async def delete_collection(collection: str):
    drop(client, collection)
    return {"status": "success"}
