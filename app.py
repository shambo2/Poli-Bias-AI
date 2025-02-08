# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)

# Enable CORS so your front-end (on a different port) can call this API
CORS(app)

# 1) Load the zero-shot classifier once at startup.
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

@app.route("/")
def home():
    return "Poli-bias AI backend is up!"

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    if not data or "text" not in data:
        return jsonify({"error": "No text provided"}), 400

    article_text = data["text"]
    candidate_labels = ["Left", "Center", "Right", "Uncertain"]

    # 2) Run zero-shot classification
    result = classifier(article_text, candidate_labels)

    # result looks like:
    # {
    #   'sequence': "...",
    #   'labels': ['Left', 'Right', 'Center', 'Uncertain'],
    #   'scores': [0.45, 0.25, 0.20, 0.10]
    # }
    labels = result["labels"]     # e.g. ["Left", "Right", "Center", "Uncertain"]
    scores = result["scores"]     # e.g. [0.45, 0.25, 0.20, 0.10]

    # 3) Convert to a friendlier format (percentages).
    #    We'll store them as { "Left": 45, "Right": 25, ... } for the front-end.
    bias_scores = {}
    for label, score in zip(labels, scores):
        bias_scores[label] = round(score * 100, 2)

    return jsonify({
        "text": article_text,
        "bias_scores": bias_scores
    }), 200


if __name__ == "__main__":
    # 4) Run Flask (development server)
    app.run(debug=True, port=5000)
