
from ai_claims import classify_candidate_claims

print("Starting NewsAI claim extraction test...")

article = """
Scientists announced that a new study analyzed data from
thousands of participants. Researchers said the results need
further investigation. I think this technology is amazing.
"""

claims = classify_candidate_claims(article)

print("\nCandidate claims:")
for claim in claims:
    print(claim)

print("\nTest completed.")
