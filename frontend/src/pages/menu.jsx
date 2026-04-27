import { useState, useEffect } from 'react';
// Asegúrate de tener una imagen llamada "cupcake_default.jpg" (o como le hayas puesto) en public/productos/
const imgDefault = "/productos/cup cakes.jpeg";

export default function Menu({ agregarAlCarrito }) {
  // 1. Iniciamos el estado vacío y agregamos un estado de "cargando"
  const [postres, setPostres] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 2. Usamos useEffect para ir a buscar los datos a Render/HostGator
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        // 👇 IMPORTANTE: Asegúrate de que esta URL coincida con la ruta de tu backend
        // Si tu ruta es diferente (ej. /productos en vez de /api/productos), cámbiala aquí.
        const response = await fetch("https://nil-bakery.onrender.com/api/products");
        const data = await response.json();

        // En tu controlador envías { message: '...', data: [...] }
        // Por eso accedemos a data.data
        if (data && data.data) {
          setPostres(data.data);
        }
      } catch (error) {
        console.error("Error al obtener los productos:", error);
        alert("Hubo un problema al cargar el menú.");
      } finally {
        setCargando(false); // Apagamos el estado de carga
      }
    };

    cargarProductos();
  }, []); // Los corchetes vacíos [] significan que esto solo se ejecuta UNA VEZ al abrir la página

  return (
    <div style={{ fontFamily: 'sans-serif', margin: '0', padding: '0' }}>
      
      <div style={{ 
        padding: '120px 20px 60px', /* Padding top para no quedar debajo del Navbar */
        backgroundColor: '#fcfcfc',
        minHeight: '100vh'
      }}>
        <h2 style={{ textAlign: 'center', color: '#333', fontFamily: 'serif', fontSize: 'clamp(28px, 5vw, 36px)', fontWeight: 'normal', marginBottom: '40px' }}>
          Nuestro Menú
        </h2>
        
        {/* Mostramos un mensaje de carga mientras llegan los datos */}
        {cargando ? (
          <p style={{ textAlign: 'center', fontSize: '18px', color: '#666' }}>Horneando los datos... 🧁</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center' }}>
            
        {/* Recorremos los productos que llegaron de la base de datos */}
        {postres.map((postre) => (
          <div key={postre.id} style={{ 
            display: 'flex',          // 👈 NUEVO: Convertimos la tarjeta en flexbox
            flexDirection: 'column',  // 👈 NUEVO: Ordenamos de arriba hacia abajo
            border: '1px solid #eee', 
            padding: '25px', 
            width: '220px', 
            textAlign: 'center', 
            backgroundColor: 'white', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)' 
          }}>
            
            <img 
              src={postre.imagen ? `/productos/${postre.imagen}` : imgDefault} 
              alt={postre.nombre} 
              style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }} 
              onError={(e) => {
                if (e.target.src.includes(imgDefault)) {
                  e.target.src = "https://placehold.co/400x300?text=Foto+no+disponible";
                } else {
                  e.target.src = imgDefault;
                }
              }}
            />
            
            <h3 style={{ fontSize: '18px', margin: '15px 0', color: '#333', fontFamily: 'serif' }}>
              {postre.nombre}
            </h3>
            
            {/* 👈 NUEVO: flexGrow: 1 hace que este texto ocupe el espacio sobrante, empujando el botón hacia abajo */}
            <p style={{ fontSize: '12px', color: '#777', flexGrow: 1, marginBottom: '15px' }}>
              {postre.descripcion}
            </p>

            {/* 👈 NUEVO: Agrupamos el precio y el botón, y con marginTop: 'auto' los pegamos al fondo */}
            <div style={{ marginTop: 'auto' }}>
              <p style={{ color: '#b5835a', fontSize: '20px', margin: '0 0 10px 0', fontWeight: 'bold' }}>
                ${Number(postre.precio).toFixed(2)}
              </p>
              
              <button 
                onClick={() => agregarAlCarrito(postre)} 
                style={{ width: '100%', padding: '12px', background: '#3b2f2f', color: 'white', border: 'none', cursor: 'pointer', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', transition: '0.3s' }}
              >
                Añadir al Carrito
              </button>
            </div>
            
          </div>
        ))}

            {postres.length === 0 && !cargando && (
              <p style={{ textAlign: 'center', color: '#999' }}>Aún no hay productos en el menú.</p>
            )}

          </div>
        )}
      </div>
    </div>
  );
}