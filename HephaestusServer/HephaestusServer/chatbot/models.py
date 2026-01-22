from django.db import models
import uuid


class Files(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    file_name = models.CharField(max_length=255)
    path = models.CharField(max_length=255)
    extension = models.CharField(max_length=10)
    user_id = models.ForeignKey("accounts.UserAccount", on_delete=models.CASCADE, blank=False          
)

class Conversations(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    name = models.CharField(max_length=20)
    messages = models.JSONField()
    user_id = models.ForeignKey("accounts.UserAccount", on_delete=models.CASCADE, blank=False)


class Transactions(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    date = models.IntegerField()
    description = models.CharField(max_length=200)
    amount = models.FloatField()
    balance = models.FloatField()
    category = models.CharField(max_length=200)



