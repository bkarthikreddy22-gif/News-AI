
from functools import lru_cache
from transformers import pipeline

MODEL_NAME = "typeform/distilbert-base-uncased-mnli"

@lru_cache(maxsize=1)
def get_classifier():
    print("Loading NewsAI NLP model...")
    return pipeline(
        "zero-shot-classification",
        model=MODEL_NAME,
        device=-1,
    )

def classify_candidate_claims(text: str, threshold: float = 0.45):
    import re

    sentences = [
        s.strip()
        for s in re.split(r"(?<=[.!?])\s+", text.replace("\n", " "))
        if len(s.strip()) >= 20
    ]

    if not sentences:
        return []

    classifier = get_classifier()
    labels = ["verifiable factual statement", "subjective opinion"]

    results = classifier(
        sentences,
        candidate_labels=labels,
        hypothesis_template="The type of this text is {}.",
    )

    claims = []

    for sentence, result in zip(sentences, results):
        scores = dict(zip(result["labels"], result["scores"]))
        fact_score = float(scores.get("verifiable factual statement", 0.0))

        print(f"\nSentence: {sentence}")
        print(f"Factual score: {fact_score:.3f}")
        print(
            "Opinion score: "
            f"{float(scores.get('subjective opinion', 0.0)):.3f}"
        )

        if result["labels"][0] == "verifiable factual statement" and fact_score >= threshold:
            claims.append({
                "text": sentence,
                "status": "Needs verification",
                "classification_score": round(fact_score, 3),
                "method": "pretrained_nli_classifier",
            })

    return claims[:5]
