import requests
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

def ocr_and_extract_keywords(file_path):
    """
    Performs OCR on the provided file and extracts keywords.

    This function sends the file to an external OCR API and processes the response
    to extract text and keywords. It handles errors and logs them appropriately.

    Args:
        file_path (str): The file path of the document to be processed.

    Returns:
        tuple: A tuple containing the extracted text and list of keywords, or (None, None) in case of errors.
    """
    with open(file_path, 'rb') as file:
        files = {
            'file': (file.name, file, 'application/pdf')
        }
        payload = {
            "response_as_dict": False,
            "attributes_as_list": False,
            "show_original_response": False,
            "providers": "google"
        }
        response = requests.post(
            settings.EDEN_API_URL,
            files=files,
            headers=settings.EDEN_API_HEADERS,
            data=payload
        )
        if response.status_code == 200:
            try:
                data = response.json()
                text = data[0]['text']
                keywords = [box['text'] for box in data[0]['bounding_boxes']]
                return text, keywords
            except ValueError as error:
                logger.error("Error parsing API response as JSON: %s", error)
                return None, None
        else:
            logger.error("API request failed with status code: %s", response.status_code)
            logger.error("Message: %s", response.text)
            return None, None