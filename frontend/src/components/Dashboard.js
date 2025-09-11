import React from 'react';
import { Card, Row, Col, Alert } from 'react-bootstrap';
import { getCurrentMonthSummary } from '../services/api';
import { useState, useEffect } from 'react';

const Dashboard = ({ transactions, monthlyStats, loading }) => {
  const [currentMonthData, setCurrentMonthData] = useState(null);

  useEffect(() => {
    const loadCurrentMonth = async () => {
      try {
        const data = await getCurrentMonthSummary();
        setCurrentMonthData(data);
      } catch (error) {
        console.error('Error loading current month data:', error);
      }
    };
    loadCurrentMonth();
  }, [transactions]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getRecentTransactions = () => {
    return transactions
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5);
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

  return (
    <div>
      {/* Current Month Summary */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="summary-card income">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0" style={{color: '#000000', fontWeight: 'bold'}}>Ingresos del Mes</h6>
                  <h4 className="text-success mb-0">
                    {currentMonthData ? formatCurrency(currentMonthData.total_income) : '$0'}
                  </h4>
                </div>
                <div className="text-success">
                  <i className="fas fa-arrow-up fa-2x"></i>
                  💰
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="summary-card expense">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0" style={{color: '#000000', fontWeight: 'bold'}}>Egresos del Mes</h6>
                  <h4 className="text-danger mb-0">
                    {currentMonthData ? formatCurrency(currentMonthData.total_expenses) : '$0'}
                  </h4>
                </div>
                <div className="text-danger">
                  💸
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="summary-card balance">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0" style={{color: '#000000', fontWeight: 'bold'}}>Balance del Mes</h6>
                  <h4 className={`mb-0 ${currentMonthData && currentMonthData.net_balance >= 0 ? 'text-success' : 'text-danger'}`}>
                    {currentMonthData ? formatCurrency(currentMonthData.net_balance) : '$0'}
                  </h4>
                </div>
                <div className={currentMonthData && currentMonthData.net_balance >= 0 ? 'text-success' : 'text-danger'}>
                  {currentMonthData && currentMonthData.net_balance >= 0 ? '📈' : '📉'}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="summary-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0" style={{color: '#000000', fontWeight: 'bold'}}>Transacciones</h6>
                  <h4 className="text-primary mb-0">
                    {currentMonthData ? currentMonthData.transaction_count : 0}
                  </h4>
                </div>
                <div className="text-primary">
                  📊
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Transactions */}
      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Transacciones Recientes</h5>
            </Card.Header>
            <Card.Body>
              {getRecentTransactions().length === 0 ? (
                <Alert variant="info">
                  No hay transacciones registradas aún.
                </Alert>
              ) : (
                <div>
                  {getRecentTransactions().map((transaction) => (
                    <div key={transaction.id} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                      <div>
                        <h6 className="mb-0">{transaction.title}</h6>
                        <small className="text-muted">{transaction.date}</small>
                      </div>
                      <div className={`fw-bold ${transaction.transaction_type === 'income' ? 'text-success' : 'text-danger'}`}>
                        {transaction.transaction_type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Resumen por Meses</h5>
            </Card.Header>
            <Card.Body>
              {monthlyStats.length === 0 ? (
                <Alert variant="info">
                  No hay datos mensuales disponibles.
                </Alert>
              ) : (
                <div>
                  {monthlyStats.slice(0, 6).map((stat) => (
                    <div key={stat.month} className="d-flex justify-content-between align-items-center py-2 border-bottom">
                      <div>
                        <h6 className="mb-0">{stat.month}</h6>
                        <small className="text-muted">{stat.transaction_count} transacciones</small>
                      </div>
                      <div className={`fw-bold ${stat.net_balance >= 0 ? 'text-success' : 'text-danger'}`}>
                        {formatCurrency(stat.net_balance)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
