from core.pipeline import run_candidate_pipeline
from core.pipeline import run_hr_pipeline
from tkinter import Tk
from tkinter.filedialog import askopenfilename

mode = input("Enter mode (candidate/hr): ").strip().lower()

if mode == "candidate":
    
    # hide main window
    Tk().withdraw()

    # open file picker
    path = askopenfilename(
        title="Select Resume",
        filetypes=[("PDF files", "*.pdf")]
    )
    result = run_candidate_pipeline(path)

    print("\n=== Candidate Result ===")
    for k, v in result.items():
        print(f"{k}: {v}")

elif mode == "hr":
    role = input("Enter role: ")
    results = run_hr_pipeline(role)

    print("\n=== Ranked Candidates ===")
    for i, r in enumerate(results, 1):
        print(f"\nRank {i}: {r['Name']}")
        print(f"ATS Score: {r['ATS Score']}%")
        print(f"Matched Skills: {', '.join(r['Matched Skills'])}")
        print("-"*40)