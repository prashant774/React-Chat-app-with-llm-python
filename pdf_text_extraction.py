# pdf_text_extraction.py
from pdfminer.high_level import extract_text

def extract_text_from_pdf(pdf_path):
    text = extract_text(pdf_path)
    text = ' '.join(text.split())
    return text

if __name__ == "__main__":
    pdf_path = "sample.pdf"
    text = extract_text_from_pdf(pdf_path)
    print("Extracted Text:\n", text)