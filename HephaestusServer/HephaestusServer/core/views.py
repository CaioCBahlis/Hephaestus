from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes


@api_view(["GET"])
def frontend(request):
    return render(request, "index.html")