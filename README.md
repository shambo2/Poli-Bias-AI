# Poli-Bias AI

HackHive2025 Project – News bias detection platform using zero-shot NLP.
Group 29 - ERROR404

## Team Members

- **Ebrahim Shaikh** (Lead Developer)
- **Ali Shamsi** (Data Scientist)
- **Garrett Hannah** (Journalist / Moderator)
- **Ubong Offiong** (Research Analyst)

## Table of Contents

- [Overview](#overview)
- [Core Features](#core-features)
- [Architecture](#architecture)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
- [Demo](#demo)
- [Future Plans](#future-plans)
- [License](#license)

## Overview

We created Poli-Bias AI as part of our hackathon project to help news readers spot potential political bias in real-time articles. By pulling headlines from a news API and running them through a zero-shot classification model, our platform provides quick insight into whether a given article appears to lean Left, Center, or Right.

### Why This Matters

- Biased or partisan coverage can distort public understanding.
- Readers often lack tools to evaluate whether the language or framing of a headline/article leans one way or another.
- Our goal is to highlight this bias so readers can engage more critically with the news.

## Core Features

### Real-Time Headline Fetching

- Integrates with NewsAPI.org (or similar) to get the latest stories.

### Zero-Shot Classification

- Utilizes a Hugging Face pipeline with facebook/bart-large-mnli to classify each article as Left, Center, or Right.
- No extra fine-tuning required, though we can refine it later if we gather labeled data.

### Simple, Intuitive UI

- Displays articles in a card format, each with a dynamic horizontal bar showing the percentage distribution of bias.

### Expandable Architecture

- Modular front end (HTML/CSS/JS).
- Flask-based backend for model inference, easily deployable on various cloud services.

## Architecture

```
┌────────────────────┐    ┌────────────────────────────┐
│   Front End (JS)   │    │    Flask Backend (Python)  │
│  - HTML, CSS, JS   │ <─────> │  - Hugging Face Transformers │
│ - Renders articles │    │    - BART MNLI model       │
└────────────────────┘    └────────────────────────────┘
         ^                            ^
         │                            │
         v                            │
┌────────────────────┐               │
│     News API       │ <─────────────┘
│ (external service) │
└────────────────────┘
```

### Front End

- Displays a "Fetch News" button, retrieves articles from News API, and sends each article's text to the backend.

### Flask Backend

- Hosts the facebook/bart-large-mnli zero-shot classifier.
- Receives text, returns bias distribution (Left/Center/Right).

### News API

- Provides fresh headlines from a variety of sources.

## Setup & Installation

### Clone this Repo

```bash
git clone https://github.com/shambo2/Poli-Bias-AI.git
cd poli-bias-ai
```

### Install Python Dependencies

We recommend a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # Mac/Linux
# .\venv\Scripts\activate  # Windows

pip install -r requirements.txt
```

Make sure requirements.txt includes:

```
flask
flask-cors
transformers
torch
```

### Set Up News API Key

1. Go to NewsAPI.org and get a free API key.
2. In script.js, replace YOUR_NEWS_API_KEY with your key.

## Usage

### Run the Flask Server

```bash
python app.py
```

The server will typically run on http://127.0.0.1:5000.

### Open index.html in a Browser

- Double-click index.html or serve it locally (e.g., `npx serve .` or `python -m http.server`).
- Click "Fetch Latest News" to load and analyze articles.

### View Results

- For each article, see a Left, Center, Right breakdown with dynamic bars.

## Demo

If you want a quick peek, we've included some screenshots in the demo/ folder:

- Screenshot 1: Home page with "Fetch News" button.
- Screenshot 2: Sample article card showing bias percentages.

## Future Plans

- **Fine-Tuning:** Train on a labeled political bias dataset for more accuracy.
- **Advanced Visualization:** Possibly use D3.js or Chart.js for a more interactive chart experience.
- **Source-Level Metadata:** Combine text analysis with known leanings of certain outlets.
- **User Feedback:** Let users flag misclassifications for continuous improvement.

## License

This project was developed for our HackHive2025 participation. Feel free to fork or adapt under the MIT License (or whichever license you prefer). If you have questions or want to collaborate, open an issue or contact us!

## Thank You!

We hope Poli-Bias AI sparks thoughtful engagement with news sources. We appreciate feedback and suggestions—please leave a star on GitHub if you find this project helpful!
