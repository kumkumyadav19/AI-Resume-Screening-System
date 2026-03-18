from flask import Flask, jsonify
from flask_cors import CORS
from core.pipeline import run_pipeline

app = Flask(__name__,static_folder="build", static_url_path="")
CORS(app)

@app.route("/api/results")
def results():
    data = run_pipeline()
    return jsonify(data)

if __name__ == "__main__":
    app.run(port=5000)