from django.http import JsonResponse
from django.conf import settings
from pathlib import Path
import uuid
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
import json
import random

from . import gemini_config

# Create your views here.

@csrf_exempt #TODO: remove when deploying, or some other thing like conditionaal decorator
@require_POST
def post_user_query(request) -> JsonResponse:
    try:
        data = json.loads(request.body.decode("utf-8"))
        conversation_history = data.get("conversation_history") # TODO: validate conversation history
        if not conversation_history:
            return JsonResponse({"error": "Conversation history missing"}, status=400)
        
        model = gemini_config.generate_chatbot_model() 
        bot_response = model.generate_content(conversation_history)
        bot_message = bot_response.candidates[0].content.parts[0].text
        if not bot_message:
            return JsonResponse({"error": "No bot response"}, status=500)
        
        return JsonResponse({"reply": bot_message}, status=200) 
    
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    
    except (IndexError, AttributeError) as e:
        return JsonResponse({"error": f"Failed to generate response: {e}"}, status=500) # TODO: remove error displaying from client-side code
    
    except Exception as e:
        return JsonResponse({"error": f"Internal server error: {e}"}, status=500)
    
PossibleReplies = [
"Ba Armandinho é o terror né meu, eu fico no horror com esse loco, é um poeta né meu, ba. Não tem quem não goste do loco, o pinta é afudê."
]

def PostUserFiles(request):
    file = request.FILES.get("File")
    ext = Path(file.name).suffix.lower()
    filename = f"{uuid.uuid4().hex}{ext}"
    out_path = Path(settings.MEDIA_ROOT) / "uploads" / filename
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("wb") as out:
        for chunk in file.chunks():
            out.write(chunk)
    BotResponse = random.choice(PossibleReplies)
    return JsonResponse({"Reply": BotResponse}, status=200)