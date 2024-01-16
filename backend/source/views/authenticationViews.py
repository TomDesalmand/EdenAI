# Django Imports #
from django.contrib.auth.models import User

# Rest Imports #
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

# File Imports #
from ..utils.serializer import UserLoginSerializer, UserRegistrationSerializer

@api_view(['POST'])
def register(request):
    """
    Registers a new user in the system.

    This endpoint creates a new user with the provided username, email, and password. 
    It returns a JWT access token for the newly created user.

    Args:
        request (HttpRequest): The HTTP request object containing user data.

    Returns:
        Response: JSON response with the JWT access token on success or error message on failure.
    """
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        user = User.objects.create_user(username=username, email=email, password=password)
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        return Response({'access_token': access_token}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login(request):
    """
    Authenticates a user based on username and password.

    This endpoint checks the user credentials and, if valid, returns a JWT access token.
    In case of invalid credentials, it returns an error.

    Args:
        request (HttpRequest): The HTTP request object containing username and password.

    Returns:
        Response: JSON response with the JWT access token on successful login or error message on failure.
    """
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        user = User.objects.filter(username=username).first()
        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            return Response({'access_token': access_token}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def check_token(request):
    """
    Checks the validity of the provided JWT access token.

    Args:
        request (HttpRequest): The HTTP request object containing the JWT access token.

    Returns:
        Response: JSON response indicating the token's validity.
    """
    return Response({'message': 'Token is valid'}, status=status.HTTP_200_OK)