from fastapi import FastAPI as init, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from functions import add, query
import PyPDF2 as pdf, io

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
async def post(id: int, name: str, file: UploadFile = File(...)):
    if not file or not file.filename:
        raise HTTPException(
            status_code=400, detail="No file provided or invalid filename"
        )

    try:
        if file.filename.endswith(".pdf"):
            print("type is pdf")
            pdf_reader = pdf.PdfReader(io.BytesIO(file.file.read()))
            data = "\n\n".join(page.extract_text() for page in pdf_reader.pages)
        else:
            print("type is not pdf")
            content = await file.read()
            data = content.decode("utf-8")
        add(id, name, data)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing file: {str(e)}")
