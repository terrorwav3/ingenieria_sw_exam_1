from django.contrib import admin
from .models import Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['title', 'amount', 'transaction_type', 'category', 'date', 'created_at']
    list_filter = ['transaction_type', 'category', 'date']
    search_fields = ['title', 'description']
    ordering = ['-date', '-created_at']
    date_hierarchy = 'date'
