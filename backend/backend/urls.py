"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from source.views.authenticationViews import register, login, check_token
from source.views.documentViews import upload_file, download_document, document_list, get_document_information

urlpatterns = [
    #path('admin/', admin.site.urls),
    path('api/token', check_token, name='check_token'),
    path('api/register', register, name='register'),
    path('api/login', login, name='login'),
    path('api/upload', upload_file, name='upload_file'),
    path('api/download/<int:document_id>', download_document, name='download_document'),
    path('api/list', document_list, name='document_list'),
    path('api/document/<int:document_id>', get_document_information, name='get_document_text'),
]
