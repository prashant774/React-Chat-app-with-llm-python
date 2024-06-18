#bert_integration.py
from transformers import BertTokenizer, BertForQuestionAnswering
import torch
import warnings

warnings.filterwarnings("ignore")

tokenizer = BertTokenizer.from_pretrained('bert-large-uncased-whole-word-masking-finetuned-squad')
model = BertForQuestionAnswering.from_pretrained('bert-large-uncased-whole-word-masking-finetuned-squad')

def get_relevant_sentences(prompt, text, max_length=512, stride=256):
    inputs = tokenizer.encode_plus(prompt, text, add_special_tokens=True, max_length=max_length, stride=stride, truncation="only_second", return_overflowing_tokens=True, return_tensors='pt')
    input_ids = inputs['input_ids']
    attention_mask = inputs['attention_mask']

    all_answers = []
    all_probs = []

    for i in range(len(input_ids)):
        outputs = model(input_ids=input_ids[i].unsqueeze(0), attention_mask=attention_mask[i].unsqueeze(0))
        answer_start_scores = outputs.start_logits
        answer_end_scores = outputs.end_logits

        answer_start = torch.argmax(answer_start_scores)
        answer_end = torch.argmax(answer_end_scores) + 1

        answer = tokenizer.convert_tokens_to_string(tokenizer.convert_ids_to_tokens(input_ids[i][answer_start:answer_end]))

        # Calculate probabilities
        start_prob = torch.softmax(answer_start_scores, dim=1)[0, answer_start].item()
        end_prob = torch.softmax(answer_end_scores, dim=1)[0, answer_end - 1].item()
        probability = (start_prob + end_prob) / 2 * 100  # Convert to percentage

        all_answers.append(answer)
        all_probs.append(probability)

    # Return the answer with the highest probability
    best_idx = all_probs.index(max(all_probs))
    return all_answers[best_idx], all_probs[best_idx]

if __name__ == "__main__":
    from pdf_text_extraction import extract_text_from_pdf
    
    pdf_path = "sample2.pdf"
    text = extract_text_from_pdf(pdf_path)
    prompt = "Who is Ajay's parent?"
    response, probability = get_relevant_sentences(prompt, text)
    print("Relevant Sentences:\n", response)
    print("Probability:\n", probability)