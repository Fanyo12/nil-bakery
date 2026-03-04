import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Importamos todas tus pantallas (¡Ojo con las mayúsculas!)
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import Cart from './pages/carrito';

// Descomenta esta línea abajo y pon el nombre de tu logo cuando lo tengas
// import logoPanaderia from './assets/tu-logo.png';

function App() {
  // Memoria del carrito
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (postre) => {
    setCarrito([...carrito, postre]);
    alert(`¡${postre.nombre} agregado al carrito!`); 
  };

  return (
    <BrowserRouter>
      {/* MENÚ DE NAVEGACIÓN */}
      <nav style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '20px 5vw', backgroundColor: '#ffffff', borderBottom: '1px solid #eaeaea', 
        fontFamily: 'sans-serif', flexWrap: 'wrap', gap: '20px'
      }}>
        <div style={{ textAlign: 'center', flexGrow: 1, minWidth: '150px', fontSize: '24px', fontWeight: 'bold', fontFamily: 'serif' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#333' }}>
            {/* Si ya tienes tu logo, borra el texto de abajo y descomenta la etiqueta <img /> */}
            ☕ Nil Bakery
            {/* <img src={logoPanaderia} alt="Logo Nil Bakery" style={{ height: '50px', objectFit: 'contain', cursor: 'pointer' }} /> */}
          </Link>
        </div>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', flexGrow: 2 }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#b5835a', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '2px solid #b5835a', paddingBottom: '5px' }}>Inicio</Link>
          <Link to="/" style={{ textDecoration: 'none', color: '#333', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>Menú</Link>
          <Link to="/login" style={{ textDecoration: 'none', color: '#333', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>Iniciar Sesión</Link>
          
          <Link to="/carrito" style={{ textDecoration: 'none', color: 'white', backgroundColor: '#b5835a', padding: '8px 15px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>
            🛒 Mi Carrito ({carrito.length})
          </Link>
        </div>
      </nav>

      {/* RUTAS (Aquí es donde React decide qué pantalla mostrar) */}
      <Routes>
        <Route path="/" element={<Home agregarAlCarrito={agregarAlCarrito} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/carrito" element={<Cart carrito={carrito} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
