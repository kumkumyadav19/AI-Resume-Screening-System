from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import json

model = SentenceTransformer("all-MiniLM-L6-v2")

# load job descriptions
with open("jobs.json") as f:
    JOBS = json.load(f)


def score_resume(clean_text, skills, years):

    resume_embedding = model.encode([clean_text])[0]

    results = []

    for job in JOBS:

        job_embedding = model.encode([job["description"]])[0]

        similarity = cosine_similarity(
            [resume_embedding],
            [job_embedding]
        )[0][0]
        similarity = (similarity + 1) / 2

        job_skills = job["description"].split()

        matched = list(set(skills).intersection(job_skills))
        missing = list(set(job_skills) - set(skills))

        skill_score = len(matched) / len(job_skills)
        exp_score = min(years / 10, 1)

        final = (
            0.7 * similarity +
            0.2 * skill_score +
            0.1 * exp_score
        )

        results.append({
            "job_title": job["title"],
            "score": round(final * 100, 2),
            "matched_skills": matched,
            "missing_skills": missing
        })

    # choose best job
    best_match = max(results, key=lambda x: x["score"])

    return best_match