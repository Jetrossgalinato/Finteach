from django.shortcuts import render
from dotenv import load_dotenv
load_dotenv()

from rest_framework import generics
from rest_framework.permissions import AllowAny
from .serializers import RegisterSerializer
from django.contrib.auth import get_user_model
from .models import Account, Activity, Goal, Budget
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    user = request.user

    # Get or create account and budget for the user
    account, _ = Account.objects.get_or_create(user=user)
    budget, _ = Budget.objects.get_or_create(user=user)

    # Get recent activity (latest 5)
    activities = Activity.objects.filter(user=user).order_by('-date')[:5]
    activity_list = [
        {
            "type": a.type,
            "detail": a.detail,
            "date": a.date.strftime("%Y-%m-%d %H:%M:%S"),
        }
        for a in activities
    ]

    # Get goals
    goals = Goal.objects.filter(user=user)
    goals_list = [
        {
            "id": g.id,
            "name": g.name,
            "current": float(g.current),
            "target": float(g.target),
        }
        for g in goals
    ]

    return Response({
        "checking_balance": float(account.checking_balance),
        "savings_balance": float(account.savings_balance),
        "investment_balance": float(account.investment_balance),
        "recent_activity": activity_list,
        "monthly_budget": float(budget.monthly_budget),
        "goals": goals_list,
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_transaction(request):
    """
    Add a deposit or expense to a user's account and log the activity.
    Expected JSON:
    {
        "type": "deposit" or "expense",
        "account": "checking" | "savings" | "investment",
        "amount": 100.00,
        "note": "optional note",
        "goal_id": (optional, for savings deposit to a goal)
    }
    """
    user = request.user
    data = request.data
    account, _ = Account.objects.get_or_create(user=user)
    amount = float(data.get("amount", 0))
    account_type = data.get("account")
    note = data.get("note", "")
    goal_id = data.get("goal_id")
    trans_type = data.get("type")

    if amount <= 0 or account_type not in ["checking", "savings", "investment"]:
        return Response({"error": "Invalid data"}, status=status.HTTP_400_BAD_REQUEST)

    if trans_type == "deposit":
        if account_type == "checking":
            account.checking_balance += amount
        elif account_type == "savings":
            account.savings_balance += amount
            # Add to goal if specified
            if goal_id:
                try:
                    goal = Goal.objects.get(id=goal_id, user=user)
                    goal.current += amount
                    goal.save()
                except Goal.DoesNotExist:
                    pass
        elif account_type == "investment":
            account.investment_balance += amount
        detail = f"Deposited ₱{amount:.2f} to {account_type.capitalize()}"
        if account_type == "savings" and goal_id:
            try:
                goal = Goal.objects.get(id=goal_id, user=user)
                detail += f" (Goal: {goal.name})"
            except Goal.DoesNotExist:
                pass
    elif trans_type == "expense":
        if account_type == "checking":
            account.checking_balance = max(0, account.checking_balance - amount)
        elif account_type == "savings":
            account.savings_balance = max(0, account.savings_balance - amount)
        elif account_type == "investment":
            account.investment_balance = max(0, account.investment_balance - amount)
        detail = f"Spent ₱{amount:.2f} from {account_type.capitalize()}"
        if note:
            detail += f" ({note})"
    else:
        return Response({"error": "Invalid transaction type"}, status=status.HTTP_400_BAD_REQUEST)

    account.save()
    Activity.objects.create(user=user, type=trans_type, detail=detail)
    return Response({"success": True})

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_budget(request):
    """
    Update the user's monthly budget.
    Expected JSON: { "monthly_budget": 1234.56 }
    """
    user = request.user
    budget, _ = Budget.objects.get_or_create(user=user)
    amount = request.data.get("monthly_budget")
    if amount is not None:
        budget.monthly_budget = float(amount)
        budget.save()
        return Response({"monthly_budget": float(budget.monthly_budget)})
    return Response({"error": "No budget provided"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_goal(request):
    """
    Add a new financial goal.
    Expected JSON: { "name": "Goal Name", "target": 1000, "current": 0 }
    """
    user = request.user
    name = request.data.get("name")
    target = request.data.get("target")
    current = request.data.get("current", 0)
    if not name or target is None:
        return Response({"error": "Name and target required"}, status=status.HTTP_400_BAD_REQUEST)
    goal = Goal.objects.create(user=user, name=name, target=target, current=current)
    return Response({"id": goal.id, "name": goal.name, "target": float(goal.target), "current": float(goal.current)})

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def edit_goal(request, goal_id):
    """
    Edit an existing goal.
    Expected JSON: { "name": "...", "target": ..., "current": ... }
    """
    user = request.user
    try:
        goal = Goal.objects.get(id=goal_id, user=user)
    except Goal.DoesNotExist:
        return Response({"error": "Goal not found"}, status=status.HTTP_404_NOT_FOUND)
    name = request.data.get("name")
    target = request.data.get("target")
    current = request.data.get("current")
    if name is not None:
        goal.name = name
    if target is not None:
        goal.target = target
    if current is not None:
        goal.current = current
    goal.save()
    return Response({"id": goal.id, "name": goal.name, "target": float(goal.target), "current": float(goal.current)})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_goal(request, goal_id):
    user = request.user
    try:
        goal = Goal.objects.get(id=goal_id, user=user)
        goal.delete()
        return Response({"success": True})
    except Goal.DoesNotExist:
        return Response({"error": "Goal not found"}, status=status.HTTP_404_NOT_FOUND)