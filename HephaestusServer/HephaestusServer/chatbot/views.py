from django.http import JsonResponse
from django.shortcuts import render
from django.conf import settings
from pathlib import Path
import uuid
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
import json

from . import gemini_config

# Create your views here.

@csrf_exempt #TODO: remove when deploying, or some other thing like conditionaal decorator
@require_POST
def post_user_query(request) -> JsonResponse:
    data = json.loads(request.body.decode("utf-8"))
    user_message = data.get("message")
    # TODO: properly build convo history (either send all through request or fetch from DB)
    conversation_history = {"role": "user", "parts": [user_message]}
    bot_response = gemini_config.chatbot_model.generate_content(conversation_history)
    bot_message = bot_response.candidates[0].content.parts[0].text
    return JsonResponse({"Reply": bot_message}, status=200) 