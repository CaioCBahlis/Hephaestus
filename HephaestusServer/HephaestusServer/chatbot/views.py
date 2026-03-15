import base64
from datetime import timezone
import traceback
from urllib import response
from django.http import JsonResponse
from django.conf import settings
from pathlib import Path
import uuid
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from chatbot.models import Conversations, Files
from chatbot.utils import ParseBankStatement
from chatbot import gemini_config, utils
from django.core.cache import cache
from google.genai import types
from django.shortcuts import render

MIME_BY_EXT = {".pdf":"application/pdf", ".csv":"text/csv"}

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

        cache.set(hash(str(UserId)+str(session_id)), ConvSession.messages)
        cache.delete(hash(UserId))
        
        user_data = {}

        try: 
            bot_message = utils.get_gemini_response(UserId, user_data, conversation_history)
        except Exception as e:
            traceback.print_exc() 
            return JsonResponse({"error": str(e)}, status=500)
        
        
        is_chart = isinstance(bot_message, dict) and bot_message.get("type") == "chart"

        Bot_Reply_Json = {
            "Text": json.dumps(bot_message["data"]) if is_chart else bot_message,
            "MessageType": "Graph" if is_chart else "Text",
            "UserMessage": False
        }

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
    
    return JsonResponse({"error": f"Internal server error:"}, status=500)
    
    

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
    ParseBankStatement(out_path, id)

    
    with open(out_path, "rb") as f:
        b64_data = base64.b64encode(f.read()).decode("utf-8")
        
    file_bytes = out_path.read_bytes()
    mime_type = MIME_BY_EXT.get(ext, "application/octet-stream")
    client, _ = gemini_config.generate_chatbot_model(
        user_data={"to_be_implemented": "Get_User_Data"},
        tool_map={} 
    )
    resp = client.models.generate_content(
        model="gemini-2.5-flash",  
        contents=[
            "Summarize this document and ask if the user has any questions.",
            types.Part.from_bytes(data=file_bytes, mime_type=mime_type),
        ],
    )

    BotReply = resp.text
    
    return JsonResponse({"reply": BotReply}, status=200)


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

    """"
    redis_key = f"{hash(UserId)}"
    ans = cache.get(redis_key)
    if ans is not None:
        print('UserSessions Cache Hit')
        return JsonResponse({"Sessions": ans}, status=200)
    """
    

    UserConversations = Conversations.objects.filter(user_id_id=request.user).order_by("updated_at")
   

    MyConversation = []
    for Conversation in UserConversations[::-1]: #Newest Conversations First
        ConversationObj = {"id": Conversation.id, "name": Conversation.name, "messages": Conversation.messages}
        MyConversation.append(ConversationObj)
    
    #ans = cache.set(redis_key, MyConversation)

    return JsonResponse({"Sessions": MyConversation}, status=200)



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_session_context(request, session_id):
    UserId = request.user.id

    """
    ans = cache.get(hash(str(UserId)+str(session_id)))
    if ans is not None:
        print("Session Context Cache Hit")
        return JsonResponse({"messages": ans}, status=200)
    """


    UserConversations = Conversations.objects.get(id=session_id, user_id_id=request.user)
    cache.set(hash(str(UserId)+str(session_id)), UserConversations.messages)


    return JsonResponse({"messages": UserConversations.messages}, status=200)



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def post_message_feedback(request, session_id):
    user_id = request.user.id

    try:
        data = json.loads(request.body.decode("utf-8"))
        conversation_history = data.get("ChatContext")

        conv_session = Conversations.objects.get(id=session_id)
        conv_session.messages = conversation_history
        conv_session.save()

    except Exception as e:
        error_message = {"error": f"Internal server error: {e}"}
        print(f"Error sending message, got: {error_message}")
        return JsonResponse(error_message, status=500)

    return JsonResponse({"success": True}, status=200)