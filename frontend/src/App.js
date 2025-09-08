import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, Tab, Tabs } from 'react-bootstrap';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Dashboard from './components/Dashboard';
import Charts from './components/Charts';
import LandingPage from './components/LandingPage';
import { getTransactions, getMonthlyStats } from './services/api';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    if (!showLanding) {
      loadData();
    }
  }, [showLanding]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [transactionsData, statsData] = await Promise.all([
        getTransactions(),
        getMonthlyStats()
      ]);
      setTransactions(transactionsData);
      setMonthlyStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionAdded = () => {
    loadData();
  };

  const handleTransactionDeleted = () => {
    loadData();
  };

  const handleStart = () => {
    setShowLanding(false);
  };

  if (showLanding) {
    return <LandingPage onStart={handleStart} />;
  }

  return (
    <div className="App">
      <Navbar variant="dark" expand="lg" className="mb-4 custom-navbar">
        <Container>
          <Navbar.Brand className="golfspace-logo">
            <span className="money">Money</span>
            <span className="tracker">Tracker</span>
            <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="navbar-tree-icon">
              <path d="M50 85 L50 60" stroke="#BAFF39" strokeWidth="4" strokeLinecap="round"/>
              <circle cx="50" cy="40" r="20" fill="#BAFF39"/>
              <circle cx="35" cy="35" r="12" fill="#BAFF39"/>
              <circle cx="65" cy="35" r="12" fill="#BAFF39"/>
              <circle cx="50" cy="25" r="10" fill="#BAFF39"/>
            </svg>
          </Navbar.Brand>
          <div className="navbar-home-icon" onClick={() => setShowLanding(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#BAFF39" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 22V12H15V22" stroke="#BAFF39" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </Container>
      </Navbar>


      <Container className="mt-4">
        {/* Navigation Tabs */}
        <div className="d-flex justify-content-center mb-4">
          <button 
            className={`nav-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <span className="mx-3 text-white">|</span>
          <button 
            className={`nav-tab-btn ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            Transacciones
          </button>
          <span className="mx-3 text-white">|</span>
          <button 
            className={`nav-tab-btn ${activeTab === 'charts' ? 'active' : ''}`}
            onClick={() => setActiveTab('charts')}
          >
            Análisis
          </button>
        </div>
        
        {activeTab === 'dashboard' && (
          <Dashboard 
            transactions={transactions}
            monthlyStats={monthlyStats}
            loading={loading}
          />
        )}
        
        {activeTab === 'transactions' && (
          <div className="row">
            <div className="col-md-4">
              <TransactionForm onTransactionAdded={handleTransactionAdded} />
            </div>
            <div className="col-md-8">
              <TransactionList 
                transactions={transactions}
                onTransactionDeleted={handleTransactionDeleted}
                loading={loading}
              />
            </div>
          </div>
        )}
        
        {activeTab === 'charts' && (
          <Charts 
            monthlyStats={monthlyStats}
            transactions={transactions}
            loading={loading}
          />
        )}
      </Container>
    </div>
  );
}

export default App;
