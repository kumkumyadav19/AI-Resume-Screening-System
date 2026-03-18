import pickle

model = pickle.load(open("models/classifier.pkl", "rb"))
vectorizer = pickle.load(open("models/vectorizer.pkl", "rb"))

def predict_role(text):
    X = vectorizer.transform([text])
    return model.predict(X)[0]