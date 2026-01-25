import os
from google import genai
from google.genai import types
from pathlib import Path
from dotenv import load_dotenv
from typing import Any

from chatbot import prompts, tools

GEMINI_MODEL = "gemini-2.5-flash"
MODEL_TEMPERATURE = 0.1

BASE_DIR = Path(__file__).resolve().parent.parent.parent
env_path = BASE_DIR / '.env'
load_dotenv(dotenv_path=env_path)

GEMINI_KEY_NAME = "GEMINI_API_KEY"
GEMINI_API_SECRET = os.getenv(GEMINI_KEY_NAME)

client = genai.Client(api_key=GEMINI_API_SECRET)

def generate_chatbot_model(user_data: dict[str, Any]) -> tuple[genai.Client, types.GenerateContentConfig]:
    chatbot_tools = list(tools.CHATBOT_TOOLS.values())
    system_prompt = prompts.generate_system_prompt(user_data, chatbot_tools)
    tool_funcs = [tool.get_tool_func() for tool in chatbot_tools]
    
    config = types.GenerateContentConfig(
        temperature=MODEL_TEMPERATURE,
        system_instruction=system_prompt,
        tools=tool_funcs
    )
    
    return client, config
