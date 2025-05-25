from django.shortcuts import render
from dotenv import load_dotenv
load_dotenv()

from rest_framework import generics
from rest_framework.permissions import AllowAny
from .serializers import RegisterSerializer
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import requests
import os
import logging

class RegisterView(generics.CreateAPIView):
    queryset = get_user_model().objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    user = request.user
    return Response({'username': user.username})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_chat(request):
    user_message = request.data.get('message', '')
    if not user_message:
        return Response({'reply': "Please enter a message."}, status=status.HTTP_400_BAD_REQUEST)

    system_prompt = (
        "You are a helpful financial advisor. Only answer financial-related questions. "
        "If the question is not about finance, politely say you can only answer finance-related questions."
    )

    cohere_api_key = os.getenv("COHERE_API_KEY")
    try:
        response = requests.post(
            "https://api.cohere.ai/v1/chat",
            headers={
                "Authorization": f"Bearer {cohere_api_key}",
                "Content-Type": "application/json"
            },
            json={
                "message": user_message,
                "model": "command-r-plus",  # You can use "command-r" or another available model
                "chat_history": [
                    {"role": "SYSTEM", "message": system_prompt}
                ]
            },
            timeout=30
        )
        data = response.json()
        ai_reply = data.get("text", "Sorry, I couldn't process your request at this time.")
    except Exception as e:
        logging.exception("Cohere API call failed")
        ai_reply = "Sorry, I couldn't process your request at this time."

    return Response({'reply': ai_reply})