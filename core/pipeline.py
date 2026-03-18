from services.google_sheets import get_dataframe
from services.google_drive import download_file
from services.pdf_parser import extract_text
from core.preprocessing import preprocess
from core.scoring import score_resume
from core.classifier import predict_role
import re

def extract_file_id(link):
    match = re.search(r'id=([a-zA-Z0-9_-]+)', link)
    return match.group(1) if match else None


def run_pipeline():
    df = get_dataframe()

    results = []

    for _, row in df.iterrows():
        file_id = extract_file_id(row["Resume"])
        if not file_id:
            continue

        file_path = download_file(file_id)
        raw_text = extract_text(file_path)

        features = preprocess(raw_text)
        match = score_resume(
            features["clean_text"],
            features["skills"],
            features["years"]
        )
        role = predict_role(features["clean_text"])

        results.append({
            "Name": row["Full Name"],
            "Best Job Match": match["job_title"],
            "Score": match["score"],
            "skills": features["skills"],
            "years": features["years"],
            "Predicted Role": role
        })

    return sorted(results, key=lambda x: x["Score"], reverse=True)