from django.db import models
from django.contrib.auth.models import User

class Document(models.Model):
    """
    Model for storing document information.

    This model represents a document uploaded to the system. It includes fields such as file,
    upload_date, text, and keywords.

    Attributes:
        user (ForeignKey): The user who uploaded the document.
        file (FileField): The file associated with the document, stored in the 'media/' directory.
        upload_date (DateTimeField): The date and time when the document was uploaded, set automatically.
        text (TextField): The text content extracted from the document (can be blank or null).
        keywords (ArrayField): The keywords extracted from the document (can be blank or null).
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    file = models.FileField(upload_to='media/')
    upload_date = models.DateTimeField(auto_now_add=True)
    text = models.TextField(blank=True, null=True)
    keywords = models.JSONField(blank=True, null=True)
