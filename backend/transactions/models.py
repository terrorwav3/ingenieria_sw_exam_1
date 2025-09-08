from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal


class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('income', 'Ingreso'),
        ('expense', 'Egreso'),
    ]
    
    CATEGORIES = [
        ('salary', 'Salario'),
        ('freelance', 'Trabajo Independiente'),
        ('investment', 'Inversiones'),
        ('gift', 'Regalo'),
        ('other_income', 'Otros Ingresos'),
        ('food', 'Alimentación'),
        ('transport', 'Transporte'),
        ('utilities', 'Servicios Públicos'),
        ('entertainment', 'Entretenimiento'),
        ('healthcare', 'Salud'),
        ('education', 'Educación'),
        ('shopping', 'Compras'),
        ('rent', 'Arriendo'),
        ('other_expense', 'Otros Gastos'),
    ]
    
    title = models.CharField(max_length=200, verbose_name="Título")
    description = models.TextField(blank=True, verbose_name="Descripción")
    amount = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        validators=[MinValueValidator(Decimal('0.01'))],
        verbose_name="Monto"
    )
    transaction_type = models.CharField(
        max_length=10, 
        choices=TRANSACTION_TYPES,
        verbose_name="Tipo de Transacción"
    )
    category = models.CharField(
        max_length=20, 
        choices=CATEGORIES,
        verbose_name="Categoría"
    )
    date = models.DateField(verbose_name="Fecha")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-date', '-created_at']
        verbose_name = "Transacción"
        verbose_name_plural = "Transacciones"
    
    def __str__(self):
        return f"{self.title} - ${self.amount} ({self.get_transaction_type_display()})"
