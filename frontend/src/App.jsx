import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Páginas
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import Cart from './pages/carrito';
import Menu from './pages/menu';
import NuestraHistoria from './pages/nuestraHistoria';
import PanelUsuario from './pages/panelUsuario';
import PanelAdmin from './pages/panelAdmin';

// Estilos del nav
import './styles/App.css';

function App() {
  const [carrito, setCarrito] = useState([]);
  const { user, logout } = useAuth();

  const agregarAlCarrito = (postre) => {
    setCarrito([...carrito, postre]);
    alert(`¡${postre.nombre} agregado al carrito!`);
  };

  return (
    <>
      {/* NAVEGACIÓN */}
      <nav className="navbar">
        <div className="navbar__logo">
          <Link to="/">Nil Bakery</Link>
        </div>

        <div className="navbar__links">
          <Link to="/" className="navbar__link">Inicio</Link>
          <Link to="/menu" className="navbar__link">Menú</Link>
          <Link to="/nuestra-historia" className="navbar__link">Nuestra Historia</Link>

          {user ? (
            <>
              <Link to="/mi-cuenta" className="navbar__link navbar__link--user">
                👤 {user.nombre}
              </Link>
              {/* Mostrar panel admin solo si el usuario es admin */}
              {user.rol === 'admin' && (
                <Link to="/admin" className="navbar__link">Admin</Link>
              )}
              <button
                onClick={() => { logout(); window.location.href = '/'; }}
                className="navbar__btn-logout"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link to="/login" className="navbar__btn-login">Iniciar Sesión</Link>
          )}

          <Link to="/carrito" className="navbar__btn-cart">
            🛒 Mi Carrito ({carrito.length})
          </Link>
        </div>
      </nav>

      {/* RUTAS */}
      <Routes>
        <Route path="/" element={<Home agregarAlCarrito={agregarAlCarrito} />} />
        <Route path="/menu" element={<Menu agregarAlCarrito={agregarAlCarrito} />} />
        <Route path="/nuestra-historia" element={<NuestraHistoria />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/carrito" element={<Cart carrito={carrito} />} />
        <Route path="/mi-cuenta" element={<PanelUsuario />} />
        <Route path="/admin" element={<PanelAdmin />} />
      </Routes>
    </>
  );
}

export default App;