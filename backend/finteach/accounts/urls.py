from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import RegisterView, get_user_info, ai_chat, dashboard,add_transaction, update_budget, add_goal, edit_goal, delete_goal

urlpatterns = [
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/user/', get_user_info, name='get_user_info'),
    path('api/ai-chat/', ai_chat, name='ai_chat'),
    path('api/dashboard/',dashboard, name='dashboard'),
    path('api/transaction/', add_transaction, name='add_transaction'),
    path('api/budget/', update_budget, name='update_budget'),
    path('api/goals/', add_goal, name='add_goal'),
    path('api/goals/<int:goal_id>/', edit_goal, name='edit_goal'),
    path('api/goals/<int:goal_id>/delete/', delete_goal, name='delete_goal'),
]
