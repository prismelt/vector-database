from fastapi import FastAPI as init
from fastapi.middleware.cors import CORSMiddleware
from functions import add, query

app = init()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/{id}")
async def get(id: int, prompt: str, n: int = 1):
    return query(id, prompt, n)


@app.post("/{id}")
async def post(id: int, data: dict):
    add(id, data["name"], data["data"])
    return {"status": "success"}
