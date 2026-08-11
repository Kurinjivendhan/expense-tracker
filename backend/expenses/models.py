from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Expense(models.Model):

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField( max_digits=10, decimal_places=2)
    category = models.CharField(max_length=50)
    description = models.CharField(max_length=255, blank=True)
    payment_method = models.CharField(max_length=30)
    date=models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__ (self):
        return f"{self.category} - ₹{self.amount}"