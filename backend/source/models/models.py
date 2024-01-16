from django.db import models

class Document(models.Model):
    """
    Model for storing document information.

    This model represents a document uploaded to the system. It includes fields such as file,
    upload_date, text, and keywords.

    Attributes:
        file (FileField): The file associated with the document, stored in the 'media/' directory.
        upload_date (DateTimeField): The date and time when the document was uploaded, set automatically.
        text (TextField): The text content extracted from the document (can be blank or null).
        keywords (TextField): The keywords extracted from the document (can be blank or null).
    """
    file = models.FileField(upload_to='media/')
    upload_date = models.DateTimeField(auto_now_add=True)
    text = models.TextField(blank=True, null=True)
    keywords = models.TextField(blank=True, null=True)