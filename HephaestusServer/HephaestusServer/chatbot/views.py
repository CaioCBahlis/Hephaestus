from django.http import JsonResponse
from django.shortcuts import render
from django.conf import settings
from pathlib import Path
import uuid
import json
import random

# Create your views here.
""""
PossibleReplies = [
    "MF é do Fergo",
    "Caverna é Lincoln Lau",
    "Se Nois perder essa poha",
    "Se vai chupar o meu pau",
    "te falo meu amigão",
    "então vamo Ganhar essa rounda",
    "Se não vou comer sua irmã",
    "Quentinha de Microondas",
]
"""
PossibleReplies = [
    "Ba Armandinho é o terror né meu, eu fico no horror com esse loco, é um poeta né meu, ba. Não tem quem não goste do loco, o pinta é afudê."
]

def PostUserQuery(request):

    data = json.loads(request.body.decode("utf-8"))
    query = data.get("Text")

    
    BotResponse = random.choice(PossibleReplies)
    return JsonResponse({"Reply": BotResponse}, status=200)


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