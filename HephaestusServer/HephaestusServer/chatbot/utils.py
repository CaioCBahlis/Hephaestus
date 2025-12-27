from . import gemini_config


# TODO: add data model for conversation history for automatic type checking
def get_chatbot_response(conversation_history: list[dict[str, any]]) -> str:
    model = gemini_config.chatbot_model