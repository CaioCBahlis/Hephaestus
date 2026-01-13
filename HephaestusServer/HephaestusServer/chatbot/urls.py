from django.urls import path
from . import views

#Se Mole doi
# Imagina duro

# TODO: change name to more descriptive
urlpatterns = [
    path("query/<uuid:session_id>", views.post_user_query), # POST
    path("file_upload/<uuid:session_id>", views.PostUserFiles),
    path("get_session_id/", views.get_session_id)
]