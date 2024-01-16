import os
import logging

# Django Imports #
from django.http import HttpResponse
from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.shortcuts import get_object_or_404

# Rest Imports #
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

# File Imports #
from ..models.models import Document
from ..utils.serializer import DocumentSerializer
from ..utils.ocr import ocr_and_extract_keywords

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_file(request):
    """
    Uploads a file, performs OCR, and extracts keywords.

    This endpoint allows authenticated users to upload a file, which is then processed using OCR
    to extract text and keywords. The extracted information is stored in the database.

    Args:
        request (HttpRequest): The HTTP request object containing the file to be uploaded.

    Returns:
        Response: JSON response with document information on successful upload or error message on failure.
    """
    try:
        file = request.FILES.get('file')
        file_name = default_storage.save(file.name, ContentFile(file.read()))
        file_path = os.path.join(settings.MEDIA_ROOT, file_name)
        text, keywords = ocr_and_extract_keywords(file_path)
        document = Document.objects.create(
            file=file_name,
            text=text,
            keywords=keywords
        )
        response_data = {
            'id': document.id,
            'file_name': str(document.file),
            'text': document.text,
            'keywords': document.keywords,
        }
        return Response(response_data, status=status.HTTP_201_CREATED)
    except ValidationError as error:
        return Response({'error': str(error)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as error:
        return Response({'error': str(error)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_document(request, document_id):
    """
    Downloads the file associated with a specific document.

    Args:
        request (HttpRequest): The HTTP request object.
        document_id (int): The unique identifier of the document.

    Returns:
        HttpResponse: The file content with appropriate headers for download, or an error response.
    """
    try:
        document = get_object_or_404(Document, id=document_id)
        file_path = document.file.path
        with open(file_path, 'rb') as file:
            response = HttpResponse(file.read(), content_type='application/octet-stream')
            response['Content-Disposition'] = f'attachment; filename="{document.file.name}"'
            return response

    except Exception as error:
        return Response({'error': str(error)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def document_list(request):
    """
    Retrieves a list of all documents.

    This endpoint allows authenticated users to retrieve a list of all documents stored in the system.

    Args:
        request (HttpRequest): The HTTP request object.

    Returns:
        Response: JSON response with a list of document information on successful retrieval or error message on failure.
    """
    try:
        documents = Document.objects.all()
        serializer = DocumentSerializer(documents, many=True)
        return Response(serializer.data)
    except Exception as error:
        return Response({'error': str(error)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_document_information(request, document_id):
    """
    Retrieves information about a specific document.

    This endpoint allows authenticated users to retrieve detailed information about a specific document
    identified by its unique identifier.

    Args:
        request (HttpRequest): The HTTP request object.
        document_id (int): The unique identifier of the document.

    Returns:
        Response: JSON response with document information on successful retrieval or error message on failure.
    """
    try:
        document = get_object_or_404(Document, id=document_id)
        return Response({'file_name': str(document.file), 'text': document.text, 'keywords': document.keywords})
    except Exception as error:
        return Response({'error': str(error)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)