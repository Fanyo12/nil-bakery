import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom'; // 👈 Cambio aquí
import { useAuth } from './context/AuthContext'; // 👈 IMPORTAR NUEVO

// Importamos todas tus pantallas
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import Cart from './pages/carrito';

function App() {
  // Memoria del carrito
  const [carrito, setCarrito] = useState([]);
  const { user, logout } = useAuth(); // 👈 USAR AUTH

  const agregarAlCarrito = (postre) => {
    setCarrito([...carrito, postre]);
    alert(`¡${postre.nombre} agregado al carrito!`); 
  };

  return (
    <>
      {/* MENÚ DE NAVEGACIÓN - AHORA CON USUARIO */}
      <nav style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '20px 5vw', backgroundColor: '#ffffff', borderBottom: '1px solid #eaeaea', 
        fontFamily: 'sans-serif', flexWrap: 'wrap', gap: '20px'
      }}>
        <div style={{ textAlign: 'center', flexGrow: 1, minWidth: '150px', fontSize: '24px', fontWeight: 'bold', fontFamily: 'serif' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#333' }}>
            ☕ Nil Bakery
          </Link>
        </div>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', flexGrow: 2 }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#b5835a', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '2px solid #b5835a', paddingBottom: '5px' }}>Inicio</Link>
          <Link to="/menu" style={{ textDecoration: 'none', color: '#333', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>Menú</Link>
          
          {/* 👇 SECCIÓN DE USUARIO - NUEVO */}
          {user ? (
            <>
              <span style={{ color: '#b5835a', fontWeight: 'bold' }}>👤 {user.nombre}</span>
              <button 
                onClick={() => {
                  logout();
                  window.location.href = '/';
                }}
                style={{ 
                  background: 'none', 
                  border: '1px solid #333',
                  padding: '5px 10px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  color: '#333',
                  fontSize: '12px'
                }}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link to="/login" style={{ textDecoration: 'none', color: '#333', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>Iniciar Sesión</Link>
          )}
          
          <Link to="/carrito" style={{ textDecoration: 'none', color: 'white', backgroundColor: '#b5835a', padding: '8px 15px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>
            🛒 Mi Carrito ({carrito.length})
          </Link>
        </div>
      </nav>

      {/* RUTAS */}
      <Routes>
        <Route path="/" element={<Home agregarAlCarrito={agregarAlCarrito} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/carrito" element={<Cart carrito={carrito} />} />
      </Routes>
    </>
  );
}

export default App;