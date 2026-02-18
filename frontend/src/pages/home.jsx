import { useState } from 'react';

export default function Home({ agregarAlCarrito }) {
  const [postres, setPostres] = useState([
    { id: 1, nombre: 'Pastel de Chocolate', precio: 250, imagen: '🍫' },
    { id: 2, nombre: 'Cheesecake de Fresa', precio: 180, imagen: '🍰' },
    { id: 3, nombre: 'Pan de Muerto Especial', precio: 35, imagen: '🥐' },
    { id: 4, nombre: 'Galletas de Mantequilla', precio: 15, imagen: '🍪' },
    { id: 5, nombre: 'Cupcake de Vainilla', precio: 25, imagen: '🧁' },
  ]);

  return (
    <div style={{ fontFamily: 'sans-serif', margin: '0', padding: '0' }}>
      
      {/* SECCIÓN HERO RESPONSIVA */}
      <div style={{ 
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2000&auto=format&fit=crop)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '80vh', 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
        padding: '40px 20px'
      }}>
        <span style={{ border: '1px solid rgba(255,255,255,0.5)', padding: '5px 15px', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px', color: '#e0c3a8' }}>
          Panadería Artesanal
        </span>
        
        {/* Usamos clamp() para que la letra se encoja en celulares */}
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

      {/* CATÁLOGO */}
      <div style={{ padding: '60px 20px', backgroundColor: '#fcfcfc' }}>
        <h2 style={{ textAlign: 'center', color: '#333', fontFamily: 'serif', fontSize: 'clamp(28px, 5vw, 36px)', fontWeight: 'normal', marginBottom: '40px' }}>
          Nuestras Especialidades
        </h2>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center' }}>
          {postres.map((postre) => (
            <div key={postre.id} style={{ border: '1px solid #eee', padding: '25px', width: '220px', textAlign: 'center', backgroundColor: 'white', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '70px', margin: '10px 0' }}>{postre.imagen}</div>
              <h3 style={{ fontSize: '18px', margin: '15px 0', color: '#333', fontFamily: 'serif' }}>{postre.nombre}</h3>
              <p style={{ color: '#b5835a', fontSize: '20px', margin: '10px 0' }}>${postre.precio}</p>
              <button 
              onClick={() => agregarAlCarrito(postre)} 
              style={{ width: '100%', padding: '12px', background: '#3b2f2f', color: 'white', border: 'none', cursor: 'pointer', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '15px', transition: '0.3s' }}>
                Añadir al Carrito
                </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}