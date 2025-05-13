from pymilvus import model, MilvusClient
from typing import Optional

embedding_function = model.DefaultEmbeddingFunction()


def new_database(client: MilvusClient, db_name: str):
    if client.has_collection(db_name):
        raise ValueError(f"Database {db_name} already exists")
    client.create_collection(
        collection_name=db_name,
        dimension=768,
    )


def add(
    client: MilvusClient,
    collection_name: str,
    doc: list[str],
    *,
    db_id: Optional[int] = None,
    file_name: Optional[str] = None,
):
    if not client.has_collection(collection_name):
        raise ValueError(f"Collection {collection_name} does not exist")
    vectors = embedding_function.encode_queries(doc)

    if db_id is None:
        db_id = -1

    if file_name is None:
        file_name = "unknown"

    data = [
        {
            "id": i,
            "database_id": str(db_id),
            "vector": vectors[i],
            "text": doc[i],
            "file_name": file_name,
        }
        for i in range(len(vectors))
    ]
    client.insert(collection_name, data)
