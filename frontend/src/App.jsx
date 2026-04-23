import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

// Componentes
import Navbar from './components/Navbar';

// Páginas
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import Cart from './pages/carrito';
import Menu from './pages/menu';
import NuestraHistoria from './pages/nuestraHistoria';
import PanelUsuario from './pages/panelUsuario';
import PanelAdmin from './pages/panelAdmin';

// Estilos globales
import './styles/App.css';

function App() {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (postre) => {
    setCarrito([...carrito, postre]);
    alert(`¡${postre.nombre} agregado al carrito!`);
  };

  return (
    <>
      {/* 👇 Aquí está tu Navbar con la prop carritoCount que creaste */}
      <Navbar carritoCount={carrito.length} />

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