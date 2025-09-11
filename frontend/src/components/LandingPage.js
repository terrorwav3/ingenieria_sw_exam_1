import React from 'react';
import { Button } from 'react-bootstrap';

const LandingPage = ({ onStart }) => {
  return (
    <div className="landing-page">
      <div className="landing-tree-logo">
        <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="animated-tree">
          <path d="M50 85 L50 60" stroke="#8B4513" strokeWidth="4" strokeLinecap="round"/>
          <circle cx="50" cy="40" r="25" className="tree-leaf-1"/>
          <circle cx="35" cy="35" r="15" className="tree-leaf-2"/>
          <circle cx="65" cy="35" r="15" className="tree-leaf-3"/>
          <circle cx="50" cy="25" r="12" className="tree-leaf-4"/>
        </svg>
      </div>
      <div className="landing-logo">
        <span className="money">Money</span>
        <span className="tracker">Tracker</span>
      </div>
      <p className="landing-subtitle">
        Controla tus finanzas de manera inteligente
      </p>
      <Button 
        className="btn-inicia"
        onClick={onStart}
      >
        Inicia
      </Button>
    </div>
  );
};

export default LandingPage;
