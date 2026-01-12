from django.urls import path
from . import views

#Se Mole doi
# Imagina duro

# TODO: change name to more descriptive
urlpatterns = [
    path("query/", views.post_user_query), # POST
    path("file_upload/", views.PostUserFiles)
]