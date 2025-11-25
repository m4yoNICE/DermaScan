import os
import google.generativeai as genai
from PIL import Image

# --- Configure API key ---
genai.configure(api_key="AIzaSyCmf92r8REjzhMvT6_m_EaXNVBr6EKZvfE")



# --- Choose the Gemini model ---
model = genai.GenerativeModel("models/gemini-2.5-pro")

# --- Load your test image ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
image_path = os.path.join(BASE_DIR, "../../skinUploads")
image_path = os.path.abspath(image_path) 

# Check if the directory exists
if not os.path.exists(image_path):
    print("Folder not found:", image_path)
    exit()

latest_file = max(
    [os.path.join(image_path, f) for f in os.listdir(image_path)],
    key=os.path.getmtime
)

img = Image.open(latest_file)

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