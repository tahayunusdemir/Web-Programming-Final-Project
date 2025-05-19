// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Style file (to be created)
import App from './App'; // Main App component (to be created)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 