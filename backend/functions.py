from constants import databases


def add(id: int, name: str, data: str):
    collection = databases[id - 1]
    collection.add(
        documents=data,
        ids=name,
    )


def query(id: int, query: str, n: int = 1):
    collection = databases[id - 1]
    results = collection.query(query_texts=query, n_results=n)
    return results["ids"]
