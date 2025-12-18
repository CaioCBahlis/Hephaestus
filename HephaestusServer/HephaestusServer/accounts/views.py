import json
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import ensure_csrf_cookie

@ensure_csrf_cookie



@require_POST
def LogIn(request):

    data = json.loads(request.body.decode("utf-8"))

    email_adress = data.get('email_address')
    password = data.get('password')

    if email_adress == "admin" and password == 'admin':
        return JsonResponse({"ok":True}, status=200)
    return JsonResponse({"error": "Invalid Crentials"}, status=400)

@ensure_csrf_cookie
def GetCSRF(request):
     return JsonResponse({"ok": True})

