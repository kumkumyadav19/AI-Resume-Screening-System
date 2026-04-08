import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import pickle

# load dataset
df = pd.read_csv("data/resume_dataset.csv")
df = df.sample(frac=1, random_state=42).reset_index(drop=True)

X = df["text"]
y = df["label"]

# split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42, stratify=y
)

# vectorize
vectorizer = TfidfVectorizer(stop_words='english',ngram_range=(1,2))
X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)

# train model
model = LogisticRegression(max_iter=1000)
model.fit(X_train_vec, y_train)

# evaluate
y_pred = model.predict(X_test_vec)
accuracy = accuracy_score(y_test, y_pred)
classification_rep = classification_report(y_test, y_pred)

print("Accuracy:", accuracy)
print("Classification Report:", classification_rep)

# save model
pickle.dump(model, open("models/classifier.pkl", "wb"))
pickle.dump(vectorizer, open("models/vectorizer.pkl", "wb"))