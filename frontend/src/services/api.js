import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Transaction API calls
export const getTransactions = async (filters = {}) => {
  try {
    const response = await api.get('/transactions/', { params: filters });
    return response.data.results || response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const createTransaction = async (transactionData) => {
  try {
    const response = await api.post('/transactions/', transactionData);
    return response.data;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};

export const updateTransaction = async (id, transactionData) => {
  try {
    const response = await api.put(`/transactions/${id}/`, transactionData);
    return response.data;
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
};

export const deleteTransaction = async (id) => {
  try {
    await api.delete(`/transactions/${id}/`);
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};

export const getMonthlyStats = async () => {
  try {
    const response = await api.get('/transactions/monthly_stats/');
    return response.data;
  } catch (error) {
    console.error('Error fetching monthly stats:', error);
    throw error;
  }
};

export const getCurrentMonthSummary = async () => {
  try {
    const response = await api.get('/transactions/current_month_summary/');
    return response.data;
  } catch (error) {
    console.error('Error fetching current month summary:', error);
    throw error;
  }
};

export default api;
