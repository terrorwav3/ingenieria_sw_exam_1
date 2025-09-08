import React, { useState } from 'react';
import { Card, ListGroup, Badge, Button, Row, Col, Form, Alert } from 'react-bootstrap';
import { deleteTransaction } from '../services/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const TransactionList = ({ transactions, onTransactionDeleted, loading }) => {
  const [filter, setFilter] = useState({
    type: 'all',
    month: '',
    category: 'all'
  });
  const [deleteLoading, setDeleteLoading] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta transacción?')) {
      setDeleteLoading(id);
      try {
        await deleteTransaction(id);
        onTransactionDeleted();
      } catch (error) {
        console.error('Error deleting transaction:', error);
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter.type !== 'all' && transaction.transaction_type !== filter.type) {
      return false;
    }
    if (filter.month && !transaction.date.startsWith(filter.month)) {
      return false;
    }
    if (filter.category !== 'all' && transaction.category !== filter.category) {
      return false;
    }
    return true;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getCategoryLabel = (category) => {
    const categories = {
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
    return categories[category] || category;
  };

  if (loading) {
    return (
      <Card>
        <Card.Body className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header>
        <Row className="align-items-center">
          <Col>
            <h5 className="mb-0" style={{color: '#000000', fontWeight: 'bold'}}>Transacciones ({filteredTransactions.length})</h5>
          </Col>
        </Row>
      </Card.Header>
      
      <Card.Body>
        {/* Filters */}
        <Row className="mb-3">
          <Col md={4}>
            <Form.Select
              size="sm"
              value={filter.type}
              onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="all">Todos los tipos</option>
              <option value="income">Solo Ingresos</option>
              <option value="expense">Solo Egresos</option>
            </Form.Select>
          </Col>
          <Col md={4}>
            <Form.Control
              type="month"
              size="sm"
              value={filter.month}
              onChange={(e) => setFilter(prev => ({ ...prev, month: e.target.value }))}
            />
          </Col>
          <Col md={4}>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setFilter({ type: 'all', month: '', category: 'all' })}
              style={{
                backgroundColor: '#000000',
                borderColor: '#000000',
                color: '#ffffff'
              }}
            >
              Limpiar Filtros
            </Button>
          </Col>
        </Row>

        {filteredTransactions.length === 0 ? (
          <Alert variant="info">
            No hay transacciones que coincidan con los filtros seleccionados.
          </Alert>
        ) : (
          <ListGroup variant="flush">
            {filteredTransactions.map((transaction) => (
              <ListGroup.Item
                key={transaction.id}
                className={`transaction-item ${transaction.transaction_type} p-3`}
              >
                <Row className="align-items-center">
                  <Col md={6}>
                    <h6 className="mb-1">{transaction.title}</h6>
                    <small className="text-muted">
                      {getCategoryLabel(transaction.category)} • {' '}
                      {format(new Date(transaction.date), 'dd MMM yyyy', { locale: es })}
                    </small>
                    {transaction.description && (
                      <p className="mb-0 mt-1 text-muted small">
                        {transaction.description}
                      </p>
                    )}
                  </Col>
                  <Col md={4} className="text-end">
                    <div className={`h5 mb-0`} style={{color: transaction.transaction_type === 'income' ? '#BAFF39' : '#dc3545'}}>
                      {transaction.transaction_type === 'income' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </div>
                    <span
                      className="badge mt-1"
                      style={{
                        backgroundColor: transaction.transaction_type === 'income' ? '#BAFF39' : '#dc3545',
                        color: '#000000',
                        fontWeight: '600',
                        border: 'none',
                        padding: '0.375rem 0.75rem',
                        borderRadius: '0.375rem',
                        fontSize: '0.75rem'
                      }}
                    >
                      {transaction.transaction_type === 'income' ? 'Ingreso' : 'Egreso'}
                    </span>
                  </Col>
                  <Col md={2} className="text-end">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleDelete(transaction.id)}
                      disabled={deleteLoading === transaction.id}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        transition: 'box-shadow 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.boxShadow = '0 2px 8px rgba(128, 128, 128, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      {deleteLoading === transaction.id ? (
                        <span className="spinner-border spinner-border-sm" />
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 6H5H21" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
};

export default TransactionList;
