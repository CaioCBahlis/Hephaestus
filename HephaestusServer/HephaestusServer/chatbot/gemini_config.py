import os
from google import genai
from accounts import models
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

def generate_chatbot_model(user_data: dict[str, Any], tool_map: dict[str, Any] = {}):
    chatbot_tools = list(tool_map.values())
    system_prompt = prompts.generate_system_prompt(user_data, chatbot_tools)
    tool_funcs = [t.get_tool_func() for t in chatbot_tools if callable(t.get_tool_func())]

    function_declarations = [
        types.FunctionDeclaration.from_callable(client=client, callable=fn)
        for fn in tool_funcs
    ]

    config = types.GenerateContentConfig(
        temperature=MODEL_TEMPERATURE,
        system_instruction=system_prompt,
        tools=[types.Tool(function_declarations=function_declarations)] if function_declarations else None,
    )
    return client, config
