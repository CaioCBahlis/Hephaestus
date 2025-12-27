from django.db import models
import uuid


class Files(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    file_name = models.CharField(max_length=255)
    path = models.CharField(max_length=255)
    extension = models.CharField(max_length=10)
    user_id = models.ForeignKey("accounts.UserAccount", on_delete=models.CASCADE, blank=False          
)

