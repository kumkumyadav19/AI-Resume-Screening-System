import re

SKILLS = ["python", "react", "nodejs", "postgresql", "aws"]

def preprocess(text):
    text = re.sub(r'\s+', ' ', text).lower()

    skills = [s for s in SKILLS if s in text]

    years_match = re.findall(r'(\d+)\+?\s*(years|yrs)', text)
    years = max([int(y[0]) for y in years_match], default=0)

    return {
        "clean_text": text,
        "skills": skills,
        "years": years
    }

SECTION_PATTERNS = {
    "skills": r"skills",
    "experience": r"experience|work history",
    "education": r"education",
    "projects": r"projects"
}

def detect_sections(text):
    sections = {}
    for key, pattern in SECTION_PATTERNS.items():
        sections[key] = bool(re.search(pattern, text))
    return sections