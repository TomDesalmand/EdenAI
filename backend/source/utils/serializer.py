from rest_framework import serializers
from ..models.models import Document
from django.contrib.auth.models import User

class DocumentSerializer(serializers.ModelSerializer):
    """
    Serializer for the Document model.

    This serializer is used to convert Document model instances into JSON representation
    for API responses. It includes fields such as id, upload_date, file, and keywords.

    Attributes:
        id (IntegerField): The unique identifier of the document.
        upload_date (DateTimeField): The date and time when the document was uploaded.
        file (CharField): The name of the file associated with the document.
        keywords (CharFieldArray): The keywords extracted from the document.
    """
    class Meta:
        model = Document
        fields = ['id', 'upload_date', 'file', 'keywords']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['file'] = str(instance.file)
        return representation


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.

    This serializer is used to validate and process user registration data,
    including username, email, and password.

    Attributes:
        username (CharField): The desired username for user registration.
        email (EmailField): The email address for user registration.
        password (CharField): The password for user registration (write-only).
    """
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

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