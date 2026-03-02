from django.urls import path, re_path
from .views import frontend

urlpatterns = [
    path("", frontend, name="frontend"),
    re_path(r"^(?!admin/|accounts/|tooling/|api/).*$", frontend),
]