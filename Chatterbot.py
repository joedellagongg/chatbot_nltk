import json
import random
import nltk
    
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

nltk.download("punkt_tabHell")
nltk.download("stopwords")
nltk.download("wordnet")

with open("intents.json", "r") as file:
    intents = json.load(file)

lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words("english"))

def preprocess_text(text):
    """
    Tokenize, remove stopwords, and lemmatize text.
    """
    tokens = word_tokenize(text.lower())
    # print(tokens)
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
    """
    Match user input to intents using cosine similarity and return a response.
    """
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

print("Chatbot: Hi! Type 'exit' to end the chat.")
while True:
    user_input = input("You: ")
    if user_input.lower() in ["exit", "quit"]:
        print("Chatbot: Goodbye!")
        break
    response = get_response(user_input)
    print(f"Chatbot: {response}")



# {
#   "intents": [
#        {"tag": "greeting",
#          "patterns": ["Hi", "How are you", "Is anyone there?", "Hello", "Good day"],
#          "responses": ["Hello, thanks for visiting", "Good to see you again", "Hi there, how can I help?"],
#          "context_set": ""
#         },
#     {
#       "tag": "goodbye",
#       "patterns": ["Bye", "See you later", "Goodbye"],
#       "responses": [
#         "See you later, thanks for visiting",
#         "Have a nice day",
#         "Bye! Come back again soon."
#       ]
#     },
#     {
#       "tag": "thanks",
#       "patterns": ["Thanks", "Thank you", "That's helpful"],
#       "responses": ["Happy to help!", "Any time!", "My pleasure"]
#     },
#     {
#       "tag": "troubleshoot_slow_computer",
#       "patterns": [
#         "My computer is slow",
#         "Why is my computer running slow?",
#         "How can I speed up my computer?"
#       ],
#       "responses": [
#         "Try restarting your computer.",
#         "Check for any software updates.",
#         "Make sure you don't have too many programs running at once."
#       ]
#     },
#     {
#       "tag": "troubleshoot_no_internet",
#       "patterns": [
#         "I can't connect to the internet",
#         "Why is my internet not working?",
#         "How do I fix my internet connection?"
#       ],
#       "responses": [
#         "Check if your Wi-Fi is turned on.",
#         "Restart your router.",
#         "Check if other devices can connect to the internet."
#       ]
#     },
#     {
#       "tag": "troubleshoot_printer",
#       "patterns": [
#         "My printer is not working",
#         "Why won't my printer print?",
#         "How do I fix my printer?"
#       ],
#       "responses": [
#         "Make sure your printer is turned on.",
#         "Check if the printer is connected to your computer.",
#         "Try restarting your printer."
#       ]
#     }
#   ]
# }
