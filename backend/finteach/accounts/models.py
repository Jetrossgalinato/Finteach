from django.db import models

from django.db import models
from django.contrib.auth.models import User

class Account(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    checking_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    savings_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    investment_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)

class Activity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(max_length=20)
    detail = models.CharField(max_length=255)
    date = models.DateTimeField(auto_now_add=True)

class Goal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    current = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    target = models.DecimalField(max_digits=12, decimal_places=2)

class Budget(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    monthly_budget = models.DecimalField(max_digits=12, decimal_places=2, default=0)