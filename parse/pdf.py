import PyPDF2 as pdf
import io


def pdf_to_string(pdf_file) -> list[str]:
    pdf_reader = pdf.PdfReader(io.BytesIO(pdf_file))
    text = []
    for page in pdf_reader.pages:
        text.append(page.extract_text())
    text = "".join(text)
    split_text = []
    for i in range(0, len(text), 1000):
        split_text.append(text[i : i + 1000])
    return split_text
