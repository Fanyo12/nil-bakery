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
  const [modal, setModal] = useState({ show: false, type: 'success', title: '', message: '', orderId: '', total: '', whatsappLink: '' });

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
      alert("Por favor, inicia sesión para poder finalizar tu compra.");
      navigate('/login');
      return;
    }

    setIsLoading(true);
    // Generar un ID de orden único para el correo y WhatsApp
    const orderId = 'NIL-' + Math.floor(100000 + Math.random() * 900000);
    const orderDate = new Date().toLocaleString('es-MX');

    // Generar resumen para el cuerpo del correo
    let resumenTexto = "";
    carrito.forEach(item => {
      resumenTexto += `• ${item.nombre_pan} - $${parseFloat(item.precio).toFixed(2)}\n`;
    });

    try {
      // --- 1. ENVIAR CORREO PRIMERO (Prioridad) ---
      await emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_NEGOCIO, {
        order_id: orderId,
        customer_name: formData.customerName,
        customer_email: formData.email,
        customer_phone: formData.phone,
        order_summary: resumenTexto,
        total: total.toFixed(2),
        date: orderDate
      });

      // --- 2. GUARDAR EN HOSTGATOR (Segundo paso) ---
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
        console.error("Error al guardar en BD, pero el correo fue enviado:", dbError);
      }

      // --- 3. CONFIGURAR WHATSAPP Y MODAL DE ÉXITO ---
      const whatsappText = `¡Hola! Mi pedido es el ${orderId}. Ya realicé la transferencia de $${total.toFixed(2)}. Mi nombre es ${formData.customerName}.`;
      const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`;

      setModal({
        show: true,
        type: 'success',
        title: '¡Pedido Recibido!',
        orderId: orderId,
        total: total.toFixed(2),
        whatsappLink: whatsappLink
      });

      // Limpiar el carrito globalmente
      if (setCarrito) setCarrito([]);

    } catch (error) {
      console.error("Error general en el proceso:", error);
      setModal({ 
        show: true, 
        type: 'error', 
        title: 'Error', 
        message: 'No se pudo procesar el pedido. Por favor intenta de nuevo.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '100px 20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ background: 'white', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        
        <div style={{ background: '#3b2f2f', color: 'white', padding: '20px', textAlign: 'center' }}>
          <h2 style={{ margin: 0 }}>{mostrarPago ? 'Finalizar Compra' : 'Mi Carrito'}</h2>
        </div>

        <div style={{ padding: '30px' }}>
          {carrito.length === 0 ? (
            <div style={{ textAlign: 'center' }}>
              <p>Tu carrito está vacío</p>
              <Link to="/" style={{ color: '#b5835a' }}>Ir a comprar postres</Link>
            </div>
          ) : (
            <>
              {!mostrarPago ? (
                <div>
                  {carrito.map((item, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #eee' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <img src={item.imagen} alt={item.nombre_pan} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                        <span style={{ fontWeight: 'bold' }}>{item.nombre_pan}</span>
                      </div>
                      <span style={{ color: '#b5835a', fontWeight: 'bold' }}>${parseFloat(item.precio).toFixed(2)}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: '25px', textAlign: 'right' }}>
                    <h3>Total: <span style={{ color: '#d63384' }}>${total.toFixed(2)} MXN</span></h3>
                    <button onClick={() => setMostrarPago(true)} style={{ background: '#3b2f2f', color: 'white', padding: '12px 30px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>
                      Proceder al Pago
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={processPayment}>
                  <div style={{ background: '#fff9f0', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ffe4bc' }}>
                    <p style={{ margin: '0 0 5px 0' }}><strong>Datos para Transferencia:</strong></p>
                    <p style={{ margin: 0, fontSize: '14px' }}>BBVA: 012345678901234567 (Nil Bakery)</p>
                  </div>

                  <div style={{ display: 'grid', gap: '15px' }}>
                    <input type="text" id="customerName" placeholder="Nombre completo" required onChange={handleInputChange} style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ddd' }} />
                    <input type="email" id="email" placeholder="Correo electrónico" required onChange={handleInputChange} style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ddd' }} />
                    <input type="tel" id="phone" placeholder="Teléfono" required onChange={handleInputChange} style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ddd' }} />
                  </div>

                  <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button type="button" onClick={() => setMostrarPago(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>← Volver</button>
                    <button type="submit" disabled={isLoading} style={{ background: '#28a745', color: 'white', padding: '12px 30px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                      {isLoading ? 'Enviando...' : 'Confirmar y Pagar'}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>

      {modal.show && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '15px', textAlign: 'center', maxWidth: '400px' }}>
            <h2>{modal.title}</h2>
            <p>Tu orden <strong>{modal.orderId}</strong> por <strong>${modal.total}</strong> está lista.</p>
            <a href={modal.whatsappLink} target="_blank" rel="noreferrer" style={{ display: 'block', background: '#25D366', color: 'white', padding: '12px', borderRadius: '5px', textDecoration: 'none', margin: '20px 0' }}>
              Enviar comprobante por WhatsApp
            </a>
            <button onClick={() => navigate('/')} style={{ background: '#eee', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}