import json
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt



@require_POST
def LogIn(request):

    data = json.loads(request.body.decode("utf-8"))

    email_adress = data.get('email_adress')
    password = data.get('password')

    if email_adress == "admin" and password == 'admin':
        return JsonResponse({"ok":True}, status=200)
    return JsonResponse({"error": "Invalid Crentials"}, status=400)
