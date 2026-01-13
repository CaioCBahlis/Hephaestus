from typing import Any
from . import gemini_config


# TODO: add data model for conversation history for automatic type checking
def get_chatbot_response(conversation_history: list[dict[str, any]]) -> str:
    model = gemini_config.chatbot_model


def ParseToGemini(RawMessages: list[dict[str, Any]]):


    ParsedMessages = []
    for Message in RawMessages:

        ParsedMessages.append(
            {"role": "model" if Message["UserMessage"] == False else "user",
            "parts": [Message["Text"]]
            }
        )
    


    return ParsedMessages


