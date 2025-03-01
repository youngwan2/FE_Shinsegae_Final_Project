import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // ✅ Router 유지
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      {' '}
      {/* ✅ 여기에만 Router 남기기 */}
      <App />
    </Router>
  </React.StrictMode>,
);
