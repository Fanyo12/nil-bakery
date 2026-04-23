import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { useAuth } from '../context/AuthContext';

const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'Qk-Fnl9FrLEiRolBh',
  SERVICE_ID: 'service_in3a5ri',
  TEMPLATE_NEGOCIO: 'template_c0qdz9e',
  TEMPLATE_CLIENTE: 'template_kgyp7ta'
};
const WHATSAPP_NUMBER = '527831169505';

export default function Cart({ carrito, setCarrito }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [mostrarPago, setMostrarPago] = useState(false);
  const [formData, setFormData] = useState({ customerName: '', email: '', phone: '', notes: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, type: 'success', title: '', orderId: '', total: '', whatsappLink: '' });

  useEffect(() => {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
  }, []);

  const total = carrito.reduce((suma, postre) => {
    const valor = parseFloat(postre.precio) || 0;
    return suma + valor;
  }, 0);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const processPayment = async (e) => {
    e.preventDefault();
    if (carrito.length === 0) return;
    
    if (!user) {
      alert("Por favor, inicia sesión para finalizar tu compra.");
      return navigate('/login');
    }

    setIsLoading(true);
    const orderId = 'NIL-' + Math.floor(100000 + Math.random() * 900000);
    const orderDate = new Date().toLocaleString('es-MX');

    // ✅ Fix 2: usar nombre correcto del producto
    let resumenTexto = "";
    carrito.forEach(item => {
      const nombre = item.nombre || item.nombre_pan || item.name || 'Producto';
      resumenTexto += `• ${nombre} - $${parseFloat(item.precio).toFixed(2)}\n`;
    });

    try {
      // ✅ Fix 1: to_email en lugar de customer_email
      await emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_NEGOCIO, {
        order_id: orderId,
        customer_name: formData.customerName,
        to_email: formData.email,        // 👈 corregido
        customer_phone: formData.phone,
        order_summary: resumenTexto,
        total: total.toFixed(2),
        order_date: orderDate
      });

      // Correo al cliente
      await emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_CLIENTE, {
        order_id: orderId,
        customer_name: formData.customerName,
        to_email: formData.email,        // 👈 corregido
        customer_phone: formData.phone,
        order_summary: resumenTexto,
        total: total.toFixed(2),
        order_date: orderDate
      });

      // Guardar en HostGator
      try {
        await fetch("https://syscunid.com.mx/api/guardar_pedido.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuario_id: user.id,
            total: total,
            productos: carrito 
          })
        });
      } catch (dbError) {
        console.error("Error en BD, pero correo enviado:", dbError);
      }

      const whatsappText = `¡Hola! Mi pedido es el ${orderId}. Ya realicé la transferencia de $${total.toFixed(2)}.`;
      const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`;

      setModal({
        show: true,
        type: 'success',
        title: '¡Pedido Recibido!',
        orderId: orderId,
        total: total.toFixed(2),
        whatsappLink: whatsappLink
      });

      if (setCarrito) setCarrito([]);

    } catch (error) {
      console.error("Error general:", error);
      alert("Hubo un detalle con el envío. Si el pago se realizó, contacta a soporte.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '80vh', paddingInline: '20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <div style={{ background: '#3b2f2f', color: 'white', padding: '20px', textAlign: 'center' }}>
          <h2 style={{ margin: 0 }}>{mostrarPago ? 'Confirmar Pedido' : 'Tu Carrito'}</h2>
        </div>

        <div style={{ padding: '30px' }}>
          {carrito.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>Tu carrito está vacío.</p>
              <Link to="/" style={{ color: '#b5835a', fontWeight: 'bold' }}>Volver a la tienda</Link>
            </div>
          ) : (
            <>
              {!mostrarPago ? (
                <div>
                  {carrito.map((item, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #eee' }}>
                      {/* ✅ Fix 2: nombre correcto */}
                      <span>{item.nombre || item.nombre_pan || item.name}</span>
                      <span style={{ fontWeight: 'bold' }}>${parseFloat(item.precio).toFixed(2)}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: '20px', textAlign: 'right' }}>
                    <h3>Total: ${total.toFixed(2)}</h3>
                    <button onClick={() => setMostrarPago(true)} style={{ background: '#3b2f2f', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '8px', cursor: 'pointer' }}>
                      Continuar
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={processPayment} style={{ display: 'grid', gap: '15px' }}>
                  <input type="text" id="customerName" placeholder="Nombre Completo" required onChange={handleInputChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                  <input type="email" id="email" placeholder="Tu Correo" required onChange={handleInputChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                  <input type="tel" id="phone" placeholder="Teléfono" required onChange={handleInputChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                    <button type="button" onClick={() => setMostrarPago(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>Atrás</button>
                    <button type="submit" disabled={isLoading} style={{ background: '#28a745', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '8px', cursor: 'pointer' }}>
                      {isLoading ? 'Procesando...' : 'Confirmar y Pagar'}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>

      {modal.show && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ background: 'white', padding: '40px', borderRadius: '25px', textAlign: 'center', maxWidth: '450px', width: '90%' }}>
            <div style={{ fontSize: '60px', color: '#28a745', marginBottom: '20px' }}>✓</div>
            <h2 style={{ margin: '0 0 10px' }}>{modal.title}</h2>
            <p>Orden: <strong>{modal.orderId}</strong></p>
            <p>Total: <strong>${modal.total} MXN</strong></p>
            <a href={modal.whatsappLink} target="_blank" rel="noreferrer" style={{ display: 'block', background: '#25D366', color: 'white', padding: '15px', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold', margin: '25px 0' }}>
              Enviar Comprobante por WhatsApp
            </a>
            <button onClick={() => navigate('/')} style={{ background: '#f0f0f0', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>Volver al inicio</button>
          </div>
        </div>
      )}
    </div>
  );
}