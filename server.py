from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import json
import random
import nltk

from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

nltk.download("punkt")
nltk.download("stopwords")
nltk.download("wordnet")

with open("intents.json", "r") as file:
    intents = json.load(file)

lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words("english"))

def preprocess_text(text):
    """Tokenize, remove stopwords, and lemmatize text."""
    tokens = word_tokenize(text.lower())
    filtered_tokens = [lemmatizer.lemmatize(token) for token in tokens if token.isalnum() and token not in stop_words]
    return " ".join(filtered_tokens)

patterns = []
tags = []
responses = {}

for intent in intents["intents"]:
    for pattern in intent["patterns"]:
        patterns.append(preprocess_text(pattern))
        tags.append(intent["tag"])
    responses[intent["tag"]] = intent["responses"]

vectorizer = CountVectorizer().fit(patterns)
pattern_vectors = vectorizer.transform(patterns)

def get_response(user_input):
    """Match user input to intents using cosine similarity and return a response."""
    preprocessed_input = preprocess_text(user_input)
    user_vector = vectorizer.transform([preprocessed_input])
    
    similarity = cosine_similarity(user_vector, pattern_vectors)
    max_similarity_idx = similarity.argmax()
    max_similarity_score = similarity[0, max_similarity_idx]
    
    if max_similarity_score > 0.3:
        tag = tags[max_similarity_idx]
        return random.choice(responses[tag])
    else:
        return "I'm sorry, I don't understand. Can you rephrase?"

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, support_credentials=True)

@app.route('/chat', methods=['POST'])
@cross_origin(origins="*",supports_credentials=True)
def chat():
    data = request.get_json()
    user_message = data.get("message", "")
    bot_response = get_response(user_message)
    
    return jsonify({"id": "2", "response": bot_response})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
