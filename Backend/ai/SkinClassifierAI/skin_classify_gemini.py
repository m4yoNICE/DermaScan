import os
import google.generativeai as genai
from PIL import Image

# --- Configure API key ---
genai.configure(api_key="AIzaSyCm6zU5e4mY-SOF61C75zU8Zno1uQTh9Ns")



# --- Choose the Gemini model ---
model = genai.GenerativeModel("models/gemini-2.5-pro")

img_path = "../../skinUploads"

latest_file = max(
    [os.path.join(img_path, f) for f in os.listdir(img_path)],
    key=os.path.getmtime
)

img = Image.open(img_path)

prompt = """
You are a dermatology assistant.
Classify this skin image based {latest_file} into eczema, acne, psoriasis, or normal.
Estimate your subjective confidence (1–10) and explain briefly.
Return your answer in JSON:
{
  "condition": "<label>",
  "confidence": "<1–10>",
  "explanation": "<one sentence>"
}
"""

response = model.generate_content([prompt, img])
print(response.text)