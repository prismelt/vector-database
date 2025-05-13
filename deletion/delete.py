from pymilvus import MilvusClient


def drop(client: MilvusClient, collection_name: str, *, hard: bool = False):
    if client.has_collection(collection_name):
        client.drop_collection(collection_name)
        return
    if hard:
        raise ValueError(f"Collection {collection_name} does not exist")


def remove(client: MilvusClient, collection_name: str, ids: list[int]):
    if not client.has_collection(collection_name):
        raise ValueError(f"Collection {collection_name} does not exist")
    client.delete(collection_name, ids)
