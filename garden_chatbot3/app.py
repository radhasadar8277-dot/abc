from flask import Flask, render_template, request, jsonify
import os
from gtts import gTTS
import uuid

# Gemini API
from utils.gemini_api import get_gemini_response

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = "static"

# Create voices folder if missing
if not os.path.exists("static/voices"):
    os.makedirs("static/voices")

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.form.get("message", "")
    image = request.files.get("image")

    image_path = None
    if image:
        image_path = os.path.join("static", image.filename)
        image.save(image_path)

    # 🌿 Gemini reply
    bot_reply = get_gemini_response(user_message, image_path)

    # 🎤 Convert reply to voice
    audio_filename = f"{uuid.uuid4()}.mp3"
    audio_path = os.path.join("static/voices", audio_filename)
    tts = gTTS(bot_reply)
    tts.save(audio_path)

    return jsonify({
        "reply": bot_reply,
        "audio": f"/static/voices/{audio_filename}"
    })

if __name__ == "__main__":
    app.run(debug=True)
