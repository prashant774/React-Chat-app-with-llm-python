import logging
import sys
from pdf_text_extraction import extract_text_from_pdf
from nlp_ner import extract_entities
from bert_integration import get_relevant_sentences
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import warnings

logging.getLogger("transformers.modeling_utils").setLevel(logging.ERROR)
warnings.filterwarnings("ignore")

def process_pdf_and_generate_response(pdf_path, prompt):
    text = extract_text_from_pdf(pdf_path)
    entities = extract_entities(text)

    chunk_size = 1024  # Increase chunk size for faster processing
    text_chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]

    all_responses = []
    all_probabilities = []

    for chunk in text_chunks:
        response, probability = get_relevant_sentences(prompt, chunk)
        all_responses.append((response, probability))

    best_response, best_probability = max(all_responses, key=lambda x: x[1])

    analyzer = SentimentIntensityAnalyzer()
    sentiment_score = analyzer.polarity_scores(best_response)["compound"]

    if sentiment_score >= 0.05:
        sentiment = "It seems you have a positive outlook!"
    elif sentiment_score <= -0.05:
        sentiment = "It seems you have a negative outlook."
    else:
        sentiment = "Your sentiment seems neutral."

    if best_probability < 50:
        disagreements = sorted(all_responses, key=lambda x: x[1], reverse=True)[:3]
        disagreement_text = "Possible answers: " + "; ".join([resp for resp, prob in disagreements])
        return disagreement_text, best_probability, sentiment

    return best_response, best_probability, sentiment

if __name__ == "__main__":
    pdf_path = sys.argv[1]
    prompt = sys.argv[2]
    response, probability, sentiment = process_pdf_and_generate_response(pdf_path, prompt)
    print(f"Answer:\n {response}")
    print(f"Sentiment Analysis: {sentiment}")
    print(f"Probability of correctness: {probability:.2f}%\n")

    if probability < 50:
        print(f"Disagreement Handling: The model has low confidence. {response}")
