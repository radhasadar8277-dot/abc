import google.generativeai as genai

# 🔑 Configure Gemini API key
genai.configure(api_key="AIzaSyAxGd5rySUkFM6i3qYknmmaxpcsAX0jtW8")

# 🔍 Choose the multimodal model (handles both image + text)
model = genai.GenerativeModel("gemini-2.5-pro")

# 🌱 Function to process image + text input , main program
def get_gemini_response(user_text, image_file=None):
    inputs = []

    # System style instruction for concise answers
    inputs.append(
        "You are a gardening expert. Reply in short, clear, and accurate answers (1-3 lines)."
    ) #Tells model to behave like a plant expert:

    if image_file:
        with open(image_file, "rb") as img:
            image_data = img.read() #the image is read as bytes:
            inputs.append(
                #Then wrapped into Gemini format:
                {
                    "mime_type": "image/jpeg",
                    "data": image_data,
                } #If image exists → attach to model
            )

    if user_text:
        inputs.append(user_text) #Append user’s text question

    try:
        response = model.generate_content(inputs) #Send to Gemini & return AI message
        return response.text.strip() if response and response.text else "No reply received."
    except Exception as e:
        return f"Error: {e}"
