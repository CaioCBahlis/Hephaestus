import os
import google.generativeai as genai
from pathlib import Path
from dotenv import load_dotenv

from . import prompts

GEMINI_MODEL: str = "gemini-2.5-flash"
MODEL_TEMPERATURE: float = 0.1
MODEL_CONFIG: genai.GenerationConfig = genai.GenerationConfig(
    temperature=MODEL_TEMPERATURE
)

BASE_DIR = Path(__file__).resolve().parent.parent.parent # Goes up 3 directories, but looks shit, will fix
env_path = BASE_DIR / '.env'
load_dotenv(dotenv_path=env_path)

GEMINI_KEY_NAME: str = "GEMINI_API_KEY"
GEMINI_API_SECRET: str = os.getenv(GEMINI_KEY_NAME)

system_prompt: str = prompts.generate_system_prompt()

genai.configure(api_key=GEMINI_API_SECRET)

chatbot_model: genai.GenerativeModel = genai.GenerativeModel(
    model_name=GEMINI_MODEL,
    generation_config=MODEL_CONFIG,
    system_instruction=system_prompt
)