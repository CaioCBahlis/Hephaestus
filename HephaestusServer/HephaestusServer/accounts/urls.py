from django.urls import path
from . import views

urlpatterns = [
    path("login/", views.LogIn),
    path("csrf/", views.GetCSRF),
]