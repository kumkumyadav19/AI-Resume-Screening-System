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

        job_text = " ".join(job["skills"])
        job_embedding = model.encode([job_text])[0]

        similarity = cosine_similarity(
            [resume_embedding],
            [job_embedding]
        )[0][0]
        similarity = (similarity + 1) / 2

        # define clean skill list (fixed phrases)
        job_skills = job["skills"]

        # match using full phrases (not split words)
        matched = [s for s in job_skills if s in clean_text]
        missing = [s for s in job_skills if s not in clean_text]

        skill_score = len(matched) / len(job_skills)
        exp_score = min(years / 10, 1)

        final = (
            0.8 * similarity +
            0.15 * skill_score +
            0.05 * exp_score
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

def score_resume_for_role(clean_text, skills, years, role_name):

    resume_embedding = model.encode([clean_text])[0]

    for job in JOBS:
        if job["title"].lower() == role_name.lower():

            job_text = " ".join(job["skills"])
            job_embedding = model.encode([job_text])[0]

            similarity = cosine_similarity(
                [resume_embedding],
                [job_embedding]
            )[0][0]
            similarity = (similarity + 1) / 2

            job_skills = job["skills"]

            matched = [s for s in job_skills if s in clean_text]
            missing = [s for s in job_skills if s not in clean_text]

            skill_score = len(matched) / len(job_skills)
            exp_score = min(years / 10, 1)

            final = (
                0.8 * similarity +
                0.15 * skill_score +
                0.05 * exp_score
            )

            return {
                "job_title": job["title"],
                "score": round(final * 100, 2),
                "matched_skills": matched,
                "missing_skills": missing
            }