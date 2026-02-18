import { Link } from 'react-router-dom';

export default function Cart({ carrito }) {
  // Calculamos el total sumando los precios de todos los postres en el carrito
  const total = carrito.reduce((suma, postre) => suma + postre.precio, 0);

  return (
    <div style={{ padding: '60px 20px', fontFamily: 'sans-serif', backgroundColor: '#fcfcfc', minHeight: '80vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        
        <h2 style={{ fontFamily: 'serif', color: '#3b2f2f', fontSize: '32px', marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
          Tu Pedido
        </h2>

        {carrito.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', fontSize: '18px', padding: '40px 0' }}>
            Tu carrito está vacío. <br/><br/>
            <Link to="/" style={{ color: '#b5835a', textDecoration: 'none', fontWeight: 'bold' }}>Volver al menú</Link>
          </p>
        ) : (
          <div>
            {/* Lista de productos */}
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {carrito.map((postre, index) => (
                <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontSize: '30px' }}>{postre.imagen}</span>
                    <span style={{ fontSize: '16px', color: '#333', fontWeight: 'bold' }}>{postre.nombre}</span>
                  </div>
                  <span style={{ fontSize: '18px', color: '#b5835a', fontWeight: 'bold' }}>${postre.precio}</span>
                </li>
              ))}
            </ul>

            {/* Total y Botón de pago */}
            <div style={{ marginTop: '30px', textAlign: 'right' }}>
              <h3 style={{ fontSize: '24px', color: '#333', fontFamily: 'serif' }}>Total: <span style={{ color: '#d63384' }}>${total}</span></h3>
              <button style={{ padding: '15px 40px', background: '#3b2f2f', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '20px' }}>
                Proceder al Pago
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}