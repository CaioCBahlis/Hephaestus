from django.http import JsonResponse
from django.conf import settings
from pathlib import Path
import uuid
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
import json
import random
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from chatbot.models import Conversations, Files


from chatbot.utils import ParseToGemini



from . import gemini_config

# Create your views here.

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def post_user_query(request, session_id) -> JsonResponse:
    UserId = request.user.id
    
    try:
        data = json.loads(request.body.decode("utf-8"))        
        conversation_history = data.get("ChatContext") 

        if not conversation_history:
            print(f"Error sending message, got: Conversation History Missing")
            return JsonResponse({"error": "Conversation history missing"}, status=400)
        
        ConvSession = Conversations.objects.get(id=session_id)
        ConvSession.messages = conversation_history
        ConvSession.save()


        GeminiPayload = ParseToGemini(conversation_history) #Model Agnostic, change parsing based on Model


        model = gemini_config.generate_chatbot_model({"to_be_implemented": "Get_User_Data"}) 
        bot_response = model.generate_content(GeminiPayload)
        bot_message = bot_response.candidates[0].content.parts[0].text


        Bot_Reply_Json = {"Text": bot_message, "MessageType": "Text", "UserMessage": False}
        

        ConvSession.messages.append(Bot_Reply_Json)
        ConvSession.save()
        
        if not bot_message:
            print(f"Error sending message, got: No bot response")
            return JsonResponse({"error": "No bot response"}, status=500)
        
        return JsonResponse({"reply": bot_message}, status=200) 
    
    except json.JSONDecodeError:
        print(f"Error sending message, got: Invalid JSON")
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    
    except (IndexError, AttributeError) as e:
        ErrorMessage = {"error": f"Failed to generate response: {e}"}
        print(f"Error sending message, got: {ErrorMessage}")
        return JsonResponse(ErrorMessage, status=500) # TODO: remove error displaying from client-side code
    
    except Exception as e:
        ErrorMessage = {"error": f"Internal server error: {e}"}
        print(f"Error sending message, got: {ErrorMessage}")
        return JsonResponse({"error": f"Internal server error: {e}"}, status=500)
    
    
PossibleReplies = [
"Ba Armandinho é o terror né meu, eu fico no horror com esse loco, é um poeta né meu, ba. Não tem quem não goste do loco, o pinta é afudê."
]
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def PostUserFiles(request, session_id):
    id = request.user.id

    file = request.FILES.get("File")
    ext = Path(file.name).suffix.lower()
    filename = f"{uuid.uuid4().hex}{ext}"
    out_path = Path(settings.MEDIA_ROOT) / "uploads" / filename
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("wb") as out:
        for chunk in file.chunks():
            out.write(chunk)

    Files.objects.create(file_name=filename, path=out_path, extension=ext, user_id=request.user)
    BotResponse = random.choice(PossibleReplies)
    return JsonResponse({"reply": BotResponse}, status=200)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_session_id(request):
    UserId = request.user.id

    NewSession = Conversations.objects.create(name="undefined", messages=[{"Text": "Hello, I'm Hephaestus AI, your personal financial Advisor. How can I help you today?", "MessageType": "Text", "UserMessage": False}], user_id=request.user)
    return JsonResponse({"SessionId": NewSession.id}, status=201) #Created Status



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_sessions(request):
    UserId = request.user.id

    UserConversations = Conversations.objects.filter(user_id_id=request.user)
   

    MyConversation = []
    for Conversation in UserConversations[::-1]: #Newest Conversations First
        ConversationObj = {"id": Conversation.id, "name": Conversation.name, "messages": Conversation.messages}
        MyConversation.append(ConversationObj)


    return JsonResponse({"Sessions": MyConversation}, status=200)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_session_context(request, session_id):
    UserId = request.user.id

    UserConversations = Conversations.objects.get(id=session_id, user_id_id=request.user)
    print(UserConversations)


    return JsonResponse({"messages": UserConversations.messages}, status=200)
