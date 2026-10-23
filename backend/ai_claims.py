
import re
from functools import lru_cache

from transformers import pipeline

MODEL_NAME = "typeform/distilbert-base-uncased-mnli"

CANDIDATE_LABELS = [
    "verifiable factual statement",
    "subjective opinion",
]


@lru_cache(maxsize=1)
def get_classifier():
    print("Loading NewsAI NLP model...")
    return pipeline(
        "zero-shot-classification",
        model=MODEL_NAME,
        device=-1,
    )


def classify_candidate_claims(text: str, threshold: float = 0.45):
    """Identify potential factual claims, not whether they are true."""

    sentences = [
        sentence.strip()
        for sentence in re.split(r"(?<=[.!?])\s+", text.replace("\n", " "))
        if len(sentence.strip()) >= 20
    ]

    if not sentences:
        return []

    classifier = get_classifier()

    results = classifier(
        sentences,
        candidate_labels=CANDIDATE_LABELS,
        hypothesis_template="The type of this text is {}.",
    )

    claims = []

    for sentence, result in zip(sentences, results):
        scores = dict(zip(result["labels"], result["scores"]))
        factual_score = float(
            scores.get("verifiable factual statement", 0.0)
        )

        if (
            result["labels"][0] == "verifiable factual statement"
            and factual_score >= threshold
        ):
            claims.append({
                "text": sentence,
                "status": "Needs verification",
                "classification_score": round(factual_score, 3),
                "method": "pretrained_nli_classifier",
            })

    return claims[:5]
