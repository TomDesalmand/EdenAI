from rest_framework import serializers
from ..models.models import Document

class UserRegistrationSerializer(serializers.Serializer):
    """
    Serializer for user registration.

    This serializer is used to validate and process user registration data,
    including username, email, and password.

    Attributes:
        username (CharField): The desired username for user registration.
        email (EmailField): The email address for user registration.
        password (CharField): The password for user registration (write-only).
    """
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class UserLoginSerializer(serializers.Serializer):
    """
    Serializer for user login.

    This serializer is used to validate and process user login data,
    including username and password.

    Attributes:
        username (CharField): The username for user login.
        password (CharField): The password for user login (write-only).
    """
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)