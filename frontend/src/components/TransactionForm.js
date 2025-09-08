import React, { useState } from 'react';
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { createTransaction } from '../services/api';

const TransactionForm = ({ onTransactionAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    transaction_type: 'income',
    category: 'salary',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const incomeCategories = [
    { value: 'salary', label: 'Salario' },
    { value: 'freelance', label: 'Trabajo Independiente' },
    { value: 'investment', label: 'Inversiones' },
    { value: 'business', label: 'Negocio' },
    { value: 'rental', label: 'Alquiler' },
    { value: 'bonus', label: 'Bonificación' },
    { value: 'commission', label: 'Comisión' },
    { value: 'dividend', label: 'Dividendos' },
    { value: 'gift', label: 'Regalo' },
    { value: 'refund', label: 'Reembolso' },
    { value: 'other_income', label: 'Otros Ingresos' }
  ];

  const expenseCategories = [
    { value: 'food', label: 'Alimentación' },
    { value: 'transport', label: 'Transporte' },
    { value: 'utilities', label: 'Servicios Públicos' },
    { value: 'rent', label: 'Arriendo' },
    { value: 'healthcare', label: 'Salud' },
    { value: 'education', label: 'Educación' },
    { value: 'entertainment', label: 'Entretenimiento' },
    { value: 'shopping', label: 'Compras' },
    { value: 'groceries', label: 'Mercado' },
    { value: 'clothing', label: 'Ropa' },
    { value: 'insurance', label: 'Seguros' },
    { value: 'taxes', label: 'Impuestos' },
    { value: 'debt', label: 'Deudas' },
    { value: 'maintenance', label: 'Mantenimiento' },
    { value: 'subscriptions', label: 'Suscripciones' },
    { value: 'travel', label: 'Viajes' },
    { value: 'other_expense', label: 'Otros Gastos' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Reset category when transaction type changes
    if (name === 'transaction_type') {
      setFormData(prev => ({
        ...prev,
        category: value === 'income' ? 'salary' : 'food'
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await createTransaction(formData);
      setSuccess('Transacción creada exitosamente');
      setFormData({
        title: '',
        description: '',
        amount: '',
        transaction_type: 'income',
        category: 'salary',
        date: new Date().toISOString().split('T')[0]
      });
      onTransactionAdded();
    } catch (error) {
      setError('Error al crear la transacción. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const categories = formData.transaction_type === 'income' ? incomeCategories : expenseCategories;

  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0" style={{color: '#000000'}}>Nueva Transacción</h5>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Título *</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Ej: Salario mensual"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descripción opcional"
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label style={{color: '#000000'}}>Tipo de Transacción *</Form.Label>
                <Form.Select
                  name="transaction_type"
                  value={formData.transaction_type}
                  onChange={handleChange}
                  required
                  className="custom-select"
                >
                  <option value="income">Ingreso</option>
                  <option value="expense">Egreso</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Categoría *</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label style={{color: '#000000'}}>Fecha *</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="custom-date-picker"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label style={{color: '#000000'}}>Monto *</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0.01"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  placeholder="0.00"
                />
              </Form.Group>
            </Col>
          </Row>

          <Button
            variant={formData.transaction_type === 'income' ? 'success' : 'danger'}
            type="submit"
            disabled={loading}
            className="w-100"
            style={{
              backgroundColor: formData.transaction_type === 'income' ? '#BAFF39' : '#dc3545',
              borderColor: formData.transaction_type === 'income' ? '#BAFF39' : '#dc3545',
              color: '#000000 !important',
              fontWeight: '600'
            }}
          >
            {loading ? 'Guardando...' : `Agregar ${formData.transaction_type === 'income' ? 'Ingreso' : 'Egreso'}`}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default TransactionForm;
