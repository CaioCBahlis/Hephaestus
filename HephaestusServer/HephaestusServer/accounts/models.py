import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager


class UserAccountManager(BaseUserManager):

    def create_user(self, email, password=None, **extra_fields):

        if not email:
            return

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    

class UserAccount(AbstractBaseUser, PermissionsMixin):
        id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

        first_name = models.CharField(max_length=50)
        last_name = models.CharField(max_length=50)
        email = models.CharField(unique=True, max_length=50)
        
        objects = UserAccountManager()

        USERNAME_FIELD = "email"
        REQUIRED_FIELDS = ["first_name", "last_name"]

        def __str__(self):
            return self.email

