from pymilvus import MilvusClient, model
from typing import Optional

embedding_function = model.DefaultEmbeddingFunction()


def basic_query(
    client: MilvusClient,
    collection_name: str,
    query: str,
    *,
    db_id: Optional[int] = None,
    limit: int = 2,
):
    if not client.has_collection(collection_name):
        raise ValueError(f"Collection {collection_name} does not exist")
    query_vector = embedding_function.encode_queries([query])
    if db_id is not None:
        filter = f"database_id == {db_id} or database_id == -1"
    else:
        filter = "database_id == -1"
    response = client.search(
        collection_name=collection_name,
        data=query_vector,
        filter=filter,
        limit=limit,
        output_fields=["text", "file_name"],
    )
    return response
