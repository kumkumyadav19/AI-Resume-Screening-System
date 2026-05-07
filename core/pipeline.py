from services.google_sheets import get_dataframe
from services.google_drive import download_file
from services.pdf_parser import extract_text
from core.preprocessing import preprocess
from core.scoring import score_resume
from core.scoring import score_resume_for_role
from core.classifier import predict_role
import re

def extract_file_id(link):
    match = re.search(r'id=([a-zA-Z0-9_-]+)', link)
    return match.group(1) if match else None
    
def run_candidate_pipeline(file_path):
    from core.preprocessing import preprocess
    from core.scoring import score_resume
    from core.classifier import predict_role
    from services.pdf_parser import extract_text

    raw_text = extract_text(file_path)
    features = preprocess(raw_text)

    match = score_resume(
        features["clean_text"],
        features["skills"],
        features["years"]
    )

    role = predict_role(features["clean_text"])

    return {
        "Best Job Match": match["job_title"],
        "ATS Score": match["score"],
        "Matched Skills": match["matched_skills"],
        "Missing Skills": match["missing_skills"],
        "Predicted Role (ML)": role
    }

def run_hr_pipeline(role_name):
    df = get_dataframe()
    results = []

    for _, row in df.iterrows():
        file_id = extract_file_id(row["Resume"])
        if not file_id:
            continue

        file_path = download_file(file_id)

        try:
            raw_text = extract_text(file_path)
        except:
            continue

        features = preprocess(raw_text)

        match = score_resume_for_role(
            features["clean_text"],
            features["skills"],
            features["years"],
            role_name
        )

        results.append({
            "Name": row["Full Name"],
            "ATS Score": match["score"],
            "Matched Skills": match["matched_skills"],
            "Missing Skills": match["missing_skills"]
        })

    return sorted(results, key=lambda x: x["ATS Score"], reverse=True)