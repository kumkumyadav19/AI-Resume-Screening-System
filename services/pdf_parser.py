import pdfplumber
from docx import Document

def extract_text(path):

    if path.endswith(".pdf"):
        try:
            with pdfplumber.open(path) as pdf:
                return "\n".join(page.extract_text() or "" for page in pdf.pages)
        except Exception as e:
            print("PDF parsing failed:", e)
            return ""

    elif path.endswith(".docx"):
        doc = Document(path)
        return "\n".join(p.text for p in doc.paragraphs)

    else:
        print("Unsupported file type:", path)
        return ""