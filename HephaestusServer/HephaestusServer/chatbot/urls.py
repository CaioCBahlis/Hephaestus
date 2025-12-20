from django.urls import path
from . import views
#Se Mole doi

urlpatterns = [
    path("query/", views.PostUserQuery),
    path("file_upload/", views.PostUserFiles)
]