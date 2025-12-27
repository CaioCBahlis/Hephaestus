from django.db import models
import uuid


class UserAccount(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.CharField(max_length=50)
    password = models.CharField(max_length=255)

