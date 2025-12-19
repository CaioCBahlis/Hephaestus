from django.shortcuts import render
from django.http import JsonResponse
import json
import random

# Create your views here.

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

def PostUserQuery(request):

    data = json.loads(request.body.decode("utf-8"))
    query = data.get("message")
    print(query)
    
    BotResponse = random.choice(PossibleReplies)
    return JsonResponse({"Reply": BotResponse}, status=200)