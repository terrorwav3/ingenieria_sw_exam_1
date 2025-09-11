import React from 'react';
import { Card, Row, Col, Alert } from 'react-bootstrap';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Charts = ({ monthlyStats, transactions, loading }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Monthly Income vs Expenses Chart
  const getMonthlyComparisonData = () => {
    const sortedStats = monthlyStats
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6); // Last 6 months

    return {
      labels: sortedStats.map(stat => {
        // Parse the month string (YYYY-MM) without timezone issues
        const [year, month] = stat.month.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        return date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
      }),
      datasets: [
        {
          label: 'Ingresos',
          data: sortedStats.map(stat => parseFloat(stat.total_income)),
          backgroundColor: 'rgba(40, 167, 69, 0.8)',
          borderColor: 'rgba(40, 167, 69, 1)',
          borderWidth: 1,
        },
        {
          label: 'Egresos',
          data: sortedStats.map(stat => parseFloat(stat.total_expenses)),
          backgroundColor: 'rgba(220, 53, 69, 0.8)',
          borderColor: 'rgba(220, 53, 69, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  // Net Balance Trend Chart
  const getBalanceTrendData = () => {
    const sortedStats = monthlyStats
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6);

    return {
      labels: sortedStats.map(stat => {
        // Parse the month string (YYYY-MM) without timezone issues
        const [year, month] = stat.month.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        return date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
      }),
      datasets: [
        {
          label: 'Balance Neto',
          data: sortedStats.map(stat => parseFloat(stat.net_balance)),
          borderColor: 'rgba(0, 123, 255, 1)',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
      ],
    };
  };

  // Category Distribution Chart
  const getCategoryData = () => {
    const categoryTotals = {};
    const categoryColors = {
      // Income categories
      salary: '#28a745',
      freelance: '#20c997',
      investment: '#17a2b8',
      gift: '#6f42c1',
      other_income: '#6c757d',
      // Expense categories
      food: '#dc3545',
      transport: '#fd7e14',
      utilities: '#ffc107',
      entertainment: '#e83e8c',
      healthcare: '#007bff',
      education: '#6610f2',
      shopping: '#d63384',
      rent: '#198754',
      other_expense: '#495057',
    };

    transactions.forEach(transaction => {
      if (!categoryTotals[transaction.category]) {
        categoryTotals[transaction.category] = 0;
      }
      categoryTotals[transaction.category] += parseFloat(transaction.amount);
    });

    const categories = Object.keys(categoryTotals);
    const amounts = Object.values(categoryTotals);
    const colors = categories.map(cat => categoryColors[cat] || '#6c757d');

    return {
      labels: categories.map(cat => {
        const categoryLabels = {
          salary: 'Salario',
          freelance: 'Trabajo Independiente',
          investment: 'Inversiones',
          gift: 'Regalo',
          other_income: 'Otros Ingresos',
          food: 'Alimentación',
          transport: 'Transporte',
          utilities: 'Servicios Públicos',
          entertainment: 'Entretenimiento',
          healthcare: 'Salud',
          education: 'Educación',
          shopping: 'Compras',
          rent: 'Arriendo',
          other_expense: 'Otros Gastos'
        };
        return categoryLabels[cat] || cat;
      }),
      datasets: [
        {
          data: amounts,
          backgroundColor: colors,
          borderColor: colors.map(color => color),
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return formatCurrency(value);
          }
        }
      }
    }
  };

  const lineChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function(value) {
            return formatCurrency(value);
          }
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.raw / total) * 100).toFixed(1);
            return `${context.label}: ${formatCurrency(context.raw)} (${percentage}%)`;
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (monthlyStats.length === 0 && transactions.length === 0) {
    return (
      <Alert variant="info">
        No hay datos suficientes para mostrar gráficos. Agrega algunas transacciones para ver los análisis.
      </Alert>
    );
  }

  return (
    <div>
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Ingresos vs Egresos Mensuales</h5>
            </Card.Header>
            <Card.Body>
              <div className="chart-container">
                {monthlyStats.length > 0 ? (
                  <Bar data={getMonthlyComparisonData()} options={chartOptions} />
                ) : (
                  <Alert variant="info">No hay datos mensuales disponibles</Alert>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Tendencia del Balance Neto</h5>
            </Card.Header>
            <Card.Body>
              <div className="chart-container">
                {monthlyStats.length > 0 ? (
                  <Line data={getBalanceTrendData()} options={lineChartOptions} />
                ) : (
                  <Alert variant="info">No hay datos mensuales disponibles</Alert>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Distribución por Categorías</h5>
            </Card.Header>
            <Card.Body>
              <div className="chart-container">
                {transactions.length > 0 ? (
                  <Doughnut data={getCategoryData()} options={doughnutOptions} />
                ) : (
                  <Alert variant="info">No hay transacciones para mostrar</Alert>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Estadísticas Generales</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <h6 className="text-muted">Total de Transacciones</h6>
                <h4 className="text-danger">{transactions.length}</h4>
              </div>
              <div className="mb-3">
                <h6 className="text-muted">Meses con Datos</h6>
                <h4 className="text-danger">{monthlyStats.length}</h4>
              </div>
              <div className="mb-3">
                <h6 className="text-muted">Promedio Mensual</h6>
                <h4 className="text-danger">
                  {monthlyStats.length > 0 
                    ? formatCurrency(
                        monthlyStats.reduce((sum, stat) => sum + parseFloat(stat.net_balance), 0) / monthlyStats.length
                      )
                    : '$0'
                  }
                </h4>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Charts;
