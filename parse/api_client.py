import os
import dotenv
from google import genai as gemini

dotenv.load_dotenv()
gemini_api_key = os.environ["GEMINI_API_KEY"]

if not gemini_api_key:
    raise ValueError("GEMINI_API_KEY is not set")

client = gemini.Client(api_key=gemini_api_key)


def get_ai_client():
    return client
