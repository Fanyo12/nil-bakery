import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import Cart from './pages/carrito';
import logoPanaderia from './assets/logo-nil.png';

function App() {
  // 1. Aquí guardamos los postres que el usuario elige
  const [carrito, setCarrito] = useState([]);

  // 2. Esta función recibe un postre y lo mete al carrito
  const agregarAlCarrito = (postre) => {
    setCarrito([...carrito, postre]);
    // Una pequeña alerta para confirmar (luego podemos poner algo más bonito)
    alert(`¡${postre.nombre} agregado al carrito!`); 
  };

  return (
    <BrowserRouter>
      {/* Menú de navegación */}
      <nav style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '20px 5vw', backgroundColor: '#ffffff', borderBottom: '1px solid #eaeaea', 
        fontFamily: 'sans-serif', flexWrap: 'wrap', gap: '20px'
      }}>
<div style={{ textAlign: 'center', flexGrow: 1, minWidth: '150px' }}>
          {/* Envolvemos la imagen en un Link para que al darle clic te lleve al Inicio */}
          <Link to="/">
            <img 
              src={logoPanaderia} 
              alt="Logo Nil Bakery" 
              style={{ height: '100px', objectFit: 'contain', cursor: 'pointer' }} 
            />
          </Link>
        </div>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', flexGrow: 2 }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#b5835a', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '2px solid #b5835a', paddingBottom: '5px' }}>Inicio</Link>
          <Link to="/" style={{ textDecoration: 'none', color: '#333', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>Menú</Link>
          <Link to="/login" style={{ textDecoration: 'none', color: '#333', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase' }}>Iniciar Sesión</Link>
          
          {/* 3. Agregamos el enlace al Carrito que muestra la cantidad de productos */}
          <Link to="/carrito" style={{ textDecoration: 'none', color: 'white', backgroundColor: '#b5835a', padding: '8px 15px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>
            🛒 Mi Carrito ({carrito.length})
          </Link>
        </div>
      </nav>

<Routes>
        <Route path="/" element={<Home agregarAlCarrito={agregarAlCarrito} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        
        {/* Aquí conectamos la pantalla y le enviamos la memoria del carrito */}
        <Route path="/carrito" element={<Cart carrito={carrito} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;