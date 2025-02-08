# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline

app = Flask(__name__)
CORS(app)

# 1) Load the zero-shot classifier once at startup
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
    # Instead of ["Left", "Right", "Center", "Uncertain"], reword & remove "Uncertain":
    candidate_labels = [
        "left leaning coverage",
        "center or neutral coverage",
        "right leaning coverage"
    ]

    # 2) Run zero-shot classification with reworded labels
    result = classifier(article_text, candidate_labels)

    # result example:
    # {
    #   'sequence': "...",
    #   'labels': [
    #       'left leaning coverage',
    #       'right leaning coverage',
    #       'center or neutral coverage'
    #   ],
    #   'scores': [0.45, 0.30, 0.25]
    # }

    labels = result["labels"]
    scores = result["scores"]  # Probability distribution for each custom label

    # 3) Convert to a friendlier format in percentages
    #    We'll unify them under simpler keys: "Left", "Center", "Right"
    #    (or any naming convention you prefer)
    bias_map = {
        "left leaning coverage": "Left",
        "center or neutral coverage": "Center",
        "right leaning coverage": "Right"
    }

    bias_scores = {}
    for label, score in zip(labels, scores):
        friendly_label = bias_map[label]
        bias_scores[friendly_label] = round(score * 100, 2)

    # 4) If you removed "Uncertain," you can skip any "Uncertain" post-processing logic
    #    The model is forced to distribute 100% across the three new labels.

    return jsonify({
        "text": article_text,
        "bias_scores": bias_scores
    }), 200

if __name__ == "__main__":
    app.run(debug=True, port=5000)
