import { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // 👈 IMPORTAR
import { useNavigate } from 'react-router-dom'; // 👈 IMPORTAR
import fondoImg from "../assets/fondo 3.jpeg";
import imgCupcake from "../assets/cup cakes.jpeg";
import imgGalletas from "../assets/galletas de fresa.jpeg";
import imgPan from "../assets/pan de muerto.jpeg";
import imgPastel from "../assets/pastel de chocolate.jpeg";
import imgPay from "../assets/pay de fresa.jpeg";

export default function Home({ agregarAlCarrito }) {
  const { user, logout } = useAuth(); // 👈 OBTENER USUARIO Y LOGOUT
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

const [postres, setPostres] = useState([
  { id: 1, nombre: 'Pastel de Chocolate', precio: 250, imagen: imgPastel },
  { id: 2, nombre: 'Cheesecake de Fresa', precio: 180, imagen: imgPay },
  { id: 3, nombre: 'Pan de Muerto Especial', precio: 35, imagen: imgPan },
  { id: 4, nombre: 'Galletas de Mantequilla', precio: 15, imagen: imgGalletas },
  { id: 5, nombre: 'Cupcake de Vainilla', precio: 25, imagen: imgCupcake },
]);

  return (
    
    <div style={{ fontFamily: 'sans-serif', margin: '0', padding: '0' }}>
      
      {/* 👇 NUEVO: NAVBAR CON AUTENTICACIÓN */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 40px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000
      }}>
        <h1 style={{ fontFamily: 'serif', color: '#3b2f2f', margin: 0 }}>Nil Bakery</h1>
        
        <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
          <a href="/" style={{ textDecoration: 'none', color: '#333', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>INICIO</a>
          <a href="/menu" style={{ textDecoration: 'none', color: '#333', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>MENÚ</a>
          <a href="/nuestra-historia" style={{ textDecoration: 'none', color: '#333', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>NUESTRA HISTORIA</a>
          
          {/* 👇 SECCIÓN DE USUARIO - CAMBIA SEGÚN SESIÓN */}
         {user ? (
  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
    <span style={{ color: '#b5835a', fontWeight: 'bold' }}>
      👤 {user.nombre}
    </span>

    {/* 👇 AGREGAR ESTO */}
    {user.rol === 'admin' && (
      <a href="/admin" style={{
        textDecoration: 'none',
        color: '#b5835a',
        fontWeight: 'bold',
        fontSize: '14px',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        Admin
      </a>
    )}

    <button
      onClick={handleLogout}
      style={{
        padding: '8px 15px',
        backgroundColor: '#3b2f2f',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '12px',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}
    >
      CERRAR SESIÓN
    </button>
  </div>
          ) : (
            <a href="/login" style={{
              textDecoration: 'none',
              color: '#fff',
              backgroundColor: '#3b2f2f',
              padding: '8px 20px',
              borderRadius: '5px',
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              INICIAR SESIÓN
            </a>
          )}
          
          <a href="/carrito" style={{
            textDecoration: 'none',
            color: '#333',
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            🛒 Mi Carrito (0)
          </a>
        </div>
      </nav>

      {/* SECCIÓN HERO - agregamos padding top para que no quede debajo del navbar */}
        <div style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${fondoImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '80vh', 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          padding: '80px 20px 40px 20px',
          marginTop: '60px'
        }}>
        <span style={{ border: '1px solid rgba(255,255,255,0.5)', padding: '5px 15px', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px', color: '#e0c3a8' }}>
          Panadería Artesanal
        </span>
        
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 60px)', fontFamily: 'serif', margin: '0 0 20px 0', maxWidth: '800px', fontWeight: 'normal' }}>
          El Arte del Pan en <br/> Cada Bocado
        </h1>
        
        <p style={{ fontSize: 'clamp(14px, 3vw, 16px)', maxWidth: '600px', marginBottom: '40px', lineHeight: '1.6', color: '#ddd' }}>
          Disfruta de una experiencia única con nuestros postres seleccionados y horneados artesanalmente para despertar tus sentidos.
        </p>
        
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button style={{ padding: '15px 30px', backgroundColor: '#3b2f2f', color: 'white', border: '1px solid #3b2f2f', cursor: 'pointer', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', transition: '0.3s' }}>
            Ver Menú
          </button>
          <button style={{ padding: '15px 30px', backgroundColor: 'transparent', color: 'white', border: '1px solid white', cursor: 'pointer', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', transition: '0.3s' }}>
            Nuestra Historia
          </button>
        </div>
      </div>

      {/* CATÁLOGO - todo igual */}
      <div style={{ padding: '60px 20px', backgroundColor: '#fcfcfc' }}>
        <h2 style={{ textAlign: 'center', color: '#333', fontFamily: 'serif', fontSize: 'clamp(28px, 5vw, 36px)', fontWeight: 'normal', marginBottom: '40px' }}>
          Nuestras Especialidades
        </h2>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center' }}>
          {postres.map((postre) => (
            <div key={postre.id} style={{ border: '1px solid #eee', padding: '25px', width: '220px', textAlign: 'center', backgroundColor: 'white', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <img src={postre.imagen} alt={postre.nombre} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }} />
              <h3 style={{ fontSize: '18px', margin: '15px 0', color: '#333', fontFamily: 'serif' }}>{postre.nombre}</h3>
              <p style={{ color: '#b5835a', fontSize: '20px', margin: '10px 0' }}>${postre.precio}</p>
              <button 
                onClick={() => agregarAlCarrito(postre)} 
                style={{ width: '100%', padding: '12px', background: '#3b2f2f', color: 'white', border: 'none', cursor: 'pointer', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '15px', transition: '0.3s' }}
              >
                Añadir al Carrito
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}