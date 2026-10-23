
from ai_claims import classify_candidate_claims

test_sentences = [
    "India's population was estimated at more than 1.4 billion people in 2023.",
    "The government announced a new policy on Monday.",
    "Researchers published a study examining air pollution levels.",
    "I think this technology is amazing.",
    "The new policy reduced unemployment by 20 percent.",
]

print("Testing NewsAI claim classification...\n")

for sentence in test_sentences:
    print(f"\nInput: {sentence}")

    results = classify_candidate_claims(sentence)

    if results:
        for claim in results:
            print(
                f"Candidate: {claim['text']}\n"
                f"Score: {claim['classification_score']}\n"
                f"Status: {claim['status']}"
            )
    else:
        print("No candidate returned.")

print("\nTest completed.")
