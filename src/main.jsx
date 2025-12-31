import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';

// StrictMode desactivado temporalmente para evitar doble montaje en desarrollo
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
