from django.urls import path
from . import views


# TODO: change name to more descriptive
urlpatterns = [
    path("query/<uuid:session_id>", views.post_user_query), # POST
    path("file_upload/<uuid:session_id>", views.PostUserFiles),
    path("get_session_id/", views.get_session_id),
    path("get_user_sessions", views.get_user_sessions),
    path("get_session_context/<uuid:session_id>", views.get_session_context)
]
