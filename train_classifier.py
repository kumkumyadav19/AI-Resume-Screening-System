from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import pickle

# sample dataset (you can expand later)
data = [
    ("python machine learning pandas numpy", "Data Scientist"),
    ("react javascript html css", "Frontend Developer"),
    ("nodejs api backend database", "Backend Developer"),
    ("tensorflow pytorch ml deployment", "ML Engineer"),
]

texts = [d[0] for d in data]
labels = [d[1] for d in data]

vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(texts)

model = LogisticRegression()
model.fit(X, labels)

# save model
pickle.dump(model, open("models/classifier.pkl", "wb"))
pickle.dump(vectorizer, open("models/vectorizer.pkl", "wb"))

print("Model trained and saved")