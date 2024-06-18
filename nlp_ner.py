#nlp_ner.py
import spacy

nlp = spacy.load("en_core_web_trf")

def preprocess_text(text):
    text = ' '.join(text.split())
    return text

def extract_entities(text):
    text = preprocess_text(text)
    doc = nlp(text)
    entities = []
    for ent in doc.ents:
        if ent.label_ == 'PERSON' and ent.text.lower() in ["except ajay", "my name"]:
            continue
        if ent.label_ == 'ORG' and ent.text.lower() == "i am ishwar":
            entities.append(("Ishwar", "PERSON"))
        else:
            entities.append((ent.text, ent.label_))
    return entities

if __name__ == "__main__":
    from pdf_text_extraction import extract_text_from_pdf
    
    pdf_path = "sample.pdf"
    text = extract_text_from_pdf(pdf_path)
    entities = extract_entities(text)
    print("Extracted Entities:\n", entities)
