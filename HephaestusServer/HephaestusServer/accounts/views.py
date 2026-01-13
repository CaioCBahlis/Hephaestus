import json
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import ensure_csrf_cookie
from accounts.models import UserAccount, UserAccountManager
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

@ensure_csrf_cookie


@require_POST
def Register(request):
    data = json.loads(request.body.decode("utf-8"))
    
    Name = data.get("Name")
    LastName = data.get("LastName")
    EmailAddress = data.get('Email')
    Password = data.get("Password")

    #TODO Check if Email Address Already In Database And redirect to Login Page
    # Salt and Hash the password, password is being stored in plaintext

    User = UserAccount.objects.create_user(
        email=EmailAddress,
        password=Password,
        first_name=Name,
        last_name=LastName,
    )

    return JsonResponse({"ok":True}, status=200)


@ensure_csrf_cookie
def GetCSRF(request):
     return JsonResponse({"ok": True})



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def auth_me(request):

    return JsonResponse({"id": request.user.id, "email": request.user.email})