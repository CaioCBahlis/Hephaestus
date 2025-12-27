import json
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import ensure_csrf_cookie
from accounts.models import UserAccount

@ensure_csrf_cookie



@require_POST
def LogIn(request):

    data = json.loads(request.body.decode("utf-8"))

    #Add Proper Login Verification

    email_address = data.get('email_address')
    password = data.get('password')

    if email_address == "admin" and password == 'admin':
        return JsonResponse({"ok":True}, status=200)
    return JsonResponse({"error": "Invalid Crentials"}, status=400)

@require_POST
def Register(request):
    data = json.loads(request.body.decode("utf-8"))
    
    Name = data.get("Name")
    LastName = data.get("LastName")
    EmailAddress = data.get('Email')
    Password = data.get("Password")

    #TODO Check if Email Address Already In Database And redirect to Login Page
    # Salt and Hash the password, password is being stored in plaintext

    NewAccount = UserAccount.objects.create(
        first_name = Name,
        last_name = LastName,
        email = EmailAddress,
        password = Password,
    )

    return JsonResponse({"ok":True}, status=200)


@ensure_csrf_cookie
def GetCSRF(request):
     return JsonResponse({"ok": True})

