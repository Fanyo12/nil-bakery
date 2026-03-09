import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // 👈 Importar
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>  {/* 👈 Solo UN BrowserRouter */}
      <AuthProvider>  {/* 👈 AuthProvider envuelve todo */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
