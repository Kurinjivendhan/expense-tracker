from rest_framework import serializers
from .models import Expense
from django.contrib.auth.models import User

class ExpenseSerializer(serializers.ModelSerializer):

    class Meta:
        model = Expense
        fields = [
            'id',
            'amount',
            'category',
            'description',
            'payment_method',
            'date',
            'created_at',
        ]

        read_only_fields=[
            'id',
            'created_at',
        ]


from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

from rest_framework import serializers


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True
    )

    class Meta:
        model = User

        fields = [
            "username",
            "password"
        ]


    def validate_password(self, value):

        validate_password(
            value,
            self.initial_data.get("username")
        )

        return value


    def create(self, validated_data):

        user = User.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"]
        )

        return user