from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Q
from django.db.models.functions import TruncMonth
from datetime import datetime, date
from .models import Transaction
from .serializers import TransactionSerializer, MonthlyStatsSerializer


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    
    def get_queryset(self):
        queryset = Transaction.objects.all()
        
        # Filter by month and year
        month = self.request.query_params.get('month')
        year = self.request.query_params.get('year')
        
        if month and year:
            queryset = queryset.filter(date__month=month, date__year=year)
        elif year:
            queryset = queryset.filter(date__year=year)
        
        # Filter by transaction type
        transaction_type = self.request.query_params.get('type')
        if transaction_type in ['income', 'expense']:
            queryset = queryset.filter(transaction_type=transaction_type)
        
        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def monthly_stats(self, request):
        """Get monthly statistics for all months with transactions"""
        # Get all transactions grouped by month
        monthly_data = Transaction.objects.annotate(
            month=TruncMonth('date')
        ).values('month').annotate(
            total_income=Sum('amount', filter=Q(transaction_type='income')),
            total_expenses=Sum('amount', filter=Q(transaction_type='expense')),
            transaction_count=Sum('id')
        ).order_by('-month')
        
        # Process the data
        stats = []
        for data in monthly_data:
            total_income = data['total_income'] or 0
            total_expenses = data['total_expenses'] or 0
            net_balance = total_income - total_expenses
            
            stats.append({
                'month': data['month'].strftime('%Y-%m'),
                'total_income': total_income,
                'total_expenses': total_expenses,
                'net_balance': net_balance,
                'transaction_count': Transaction.objects.filter(
                    date__year=data['month'].year,
                    date__month=data['month'].month
                ).count()
            })
        
        serializer = MonthlyStatsSerializer(stats, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def current_month_summary(self, request):
        """Get summary for current month"""
        today = date.today()
        current_month_transactions = Transaction.objects.filter(
            date__year=today.year,
            date__month=today.month
        )
        
        total_income = current_month_transactions.filter(
            transaction_type='income'
        ).aggregate(Sum('amount'))['amount__sum'] or 0
        
        total_expenses = current_month_transactions.filter(
            transaction_type='expense'
        ).aggregate(Sum('amount'))['amount__sum'] or 0
        
        return Response({
            'month': today.strftime('%Y-%m'),
            'total_income': total_income,
            'total_expenses': total_expenses,
            'net_balance': total_income - total_expenses,
            'transaction_count': current_month_transactions.count()
        })
