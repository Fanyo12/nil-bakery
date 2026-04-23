import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';

// Configuración de EmailJS
const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'Qk-Fnl9FrLEiRolBh',
  SERVICE_ID: 'service_in3a5ri',
  TEMPLATE_NEGOCIO: 'template_c0qdz9e',
  TEMPLATE_CLIENTE: 'template_kgyp7ta'
};
const WHATSAPP_NUMBER = '527831169505';

export default function Cart({ carrito, setCarrito }) {
  const navigate = useNavigate();
  const [mostrarPago, setMostrarPago] = useState(false);
  const [formData, setFormData] = useState({ customerName: '', email: '', phone: '', notes: '' });
  const [isLoading, setIsLoading] = useState(false);
  
  const [modal, setModal] = useState({ show: false, type: 'success', title: '', message: '', orderId: '', total: '', whatsappLink: '' });

  useEffect(() => {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
  }, []);

  // 👇 AQUÍ ESTÁ LA CORRECCIÓN: Usamos parseFloat para forzar la suma matemática
  const total = carrito.reduce((suma, postre) => {
    const precio = parseFloat(postre.precio) || 0;
    return suma + precio;
  }, 0);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const closeModal = () => {
    setModal({ ...modal, show: false });
    if (modal.type === 'success') {
      if (setCarrito) setCarrito([]); 
      navigate('/'); 
    }
  };

  const processPayment = async (e) => {
    e.preventDefault();
    if (carrito.length === 0) return;

    const { customerName, email, phone, notes } = formData;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setModal({ show: true, type: 'error', title: 'Correo inválido', message: 'Por favor ingresa un correo electrónico válido.' });
      return;
    }

    const orderDate = new Date().toLocaleString('es-MX', { dateStyle: 'full', timeStyle: 'short' });
    const orderId = 'NIL-' + Date.now().toString().slice(-8);

    let businessSummary = `═══════════════════════════════\n      🍞 NIL BAKERY 🍞\n═══════════════════════════════\n\n📋 DETALLE DEL PEDIDO:\n\n`;
    carrito.forEach(item => {
      businessSummary += `• ${item.nombre}\n  Precio: $${parseFloat(item.precio).toFixed(2)}\n\n`;
    });
    businessSummary += `───────────────────────────────\n💰 TOTAL: $${total.toFixed(2)} MXN\n───────────────────────────────\n\n🆔 ID Pedido: ${orderId}\n👤 Cliente: ${customerName}\n📧 Email: ${email}\n📞 Teléfono: ${phone}\n`;
    if (notes) businessSummary += `📝 Notas: ${notes}\n`;
    businessSummary += '\n⚠️ Pendiente de comprobante de pago por WhatsApp';

    let clientSummary = '';
    carrito.forEach(item => {
      clientSummary += `• ${item.nombre} - $${parseFloat(item.precio).toFixed(2)}\n`;
    });
    clientSummary += `\n💰 TOTAL: $${total.toFixed(2)} MXN`;

    setIsLoading(true);

    try {
      await emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_NEGOCIO, {
        to_name: 'Nil Bakery Admin',
        order_summary: businessSummary,
        total: total.toFixed(2),
        order_date: orderDate
      });

      await emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_CLIENTE, {
        to_email: email,
        customer_name: customerName,
        order_id: orderId,
        order_date: orderDate,
        customer_email: email,
        customer_phone: phone,
        order_summary: clientSummary,
        total: total.toFixed(2)
      });

      const whatsappText = `Hola, quiero enviar mi comprobante de pago para el pedido: ${orderId}\n\n📋 NOMBRE: ${customerName}\n📞 TELÉFONO: ${phone}\n💰 TOTAL: $${total.toFixed(2)}\n🆔 PEDIDO: ${orderId}`;
      const encodedWhatsapp = encodeURIComponent(whatsappText);
      const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedWhatsapp}`;

      setModal({
        show: true,
        type: 'success',
        title: '✅ ¡Pedido registrado!',
        orderId: orderId,
        total: total.toFixed(2),
        whatsappLink: whatsappLink
      });

    } catch (error) {
      console.error('Error de EmailJS:', error);
      setModal({ show: true, type: 'error', title: 'Error', message: 'Hubo un problema al procesar tu pedido. Intenta nuevamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#fcfcfc', minHeight: '100vh' }}>
      
      <div style={{ padding: '120px 20px 60px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '800px', background: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          
          <h2 style={{ fontFamily: 'serif', color: '#3b2f2f', fontSize: '32px', marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
            Tu Pedido
          </h2>

          {carrito.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', fontSize: '18px', padding: '40px 0' }}>
              Tu carrito está vacío. <br/><br/>
              <Link to="/menu" style={{ color: '#b5835a', textDecoration: 'none', fontWeight: 'bold' }}>Ver el menú</Link>
            </p>
          ) : (
            <div>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {carrito.map((postre, index) => (
                  <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      {postre.imagen && (
                        <img src={postre.imagen} alt={postre.nombre} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }} />
                      )}
                      <span style={{ fontSize: '16px', color: '#333', fontWeight: 'bold' }}>{postre.nombre}</span>
                    </div>
                    {/* 👇 AQUÍ TAMBIÉN FORZAMOS EL FORMATO CORRECTO */}
                    <span style={{ fontSize: '18px', color: '#b5835a', fontWeight: 'bold' }}>${parseFloat(postre.precio).toFixed(2)}</span>
                  </li>
                ))}
              </ul>

              {!mostrarPago ? (
                <div style={{ marginTop: '30px', textAlign: 'right' }}>
                  <h3 style={{ fontSize: '24px', color: '#333', fontFamily: 'serif' }}>Total: <span style={{ color: '#d63384' }}>${total.toFixed(2)}</span></h3>
                  <button 
                    onClick={() => setMostrarPago(true)} 
                    style={{ padding: '15px 40px', background: '#3b2f2f', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '20px', transition: '0.3s' }}
                  >
                    Proceder al Pago
                  </button>
                </div>
              ) : (
                <div style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '30px' }}>
                  <h3 style={{ fontFamily: 'serif', color: '#3b2f2f', fontSize: '24px', marginBottom: '20px' }}>
                    🏦 Finalizar Compra
                  </h3>
                  
                  <div style={{ background: '#fef5e8', borderRadius: '10px', padding: '20px', marginBottom: '25px', border: '1px solid #e6d5b8' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#b87c4f' }}>💰 Datos para transferencia</h4>
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#333' }}>Banco: <strong>BBVA</strong></p>
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#333' }}>CLABE: <strong>012345678901234567</strong></p>
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#333' }}>Titular: <strong>Nil Bakery</strong></p>
                  </div>

                  <form onSubmit={processPayment} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input type="text" id="customerName" value={formData.customerName} onChange={handleInputChange} placeholder="Tu Nombre Completo" required style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' }} />
                    <input type="email" id="email" value={formData.email} onChange={handleInputChange} placeholder="Correo Electrónico" required style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' }} />
                    <input type="tel" id="phone" value={formData.phone} onChange={handleInputChange} placeholder="Teléfono" required style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' }} />
                    <textarea id="notes" value={formData.notes} onChange={handleInputChange} placeholder="Notas adicionales del pedido (Opcional)" rows="3" style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box', fontFamily: 'sans-serif' }} />
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', flexWrap: 'wrap', gap: '15px' }}>
                      <h3 style={{ fontSize: '24px', color: '#333', fontFamily: 'serif', margin: 0 }}>Total: <span style={{ color: '#d63384' }}>${total.toFixed(2)}</span></h3>
                      <button 
                        type="submit" 
                        disabled={isLoading} 
                        style={{ padding: '15px 40px', background: isLoading ? '#999' : '#3b2f2f', color: 'white', border: 'none', borderRadius: '5px', cursor: isLoading ? 'not-allowed' : 'pointer', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px' }}
                      >
                        {isLoading ? 'Procesando...' : 'Confirmar Pedido'}
                      </button>
                    </div>
                    
                    <button type="button" onClick={() => setMostrarPago(false)} style={{ background: 'none', border: 'none', color: '#666', textDecoration: 'underline', cursor: 'pointer', marginTop: '10px', textAlign: 'right' }}>
                      Volver al resumen del carrito
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Ventana Emergente */}
      {modal.show && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '40px', borderRadius: '10px', maxWidth: '500px', width: '90%', textAlign: 'center', fontFamily: 'sans-serif' }}>
            <div style={{ fontSize: '60px', marginBottom: '10px' }}>{modal.type === 'success' ? '✅' : '❌'}</div>
            <h2 style={{ fontFamily: 'serif', color: '#3b2f2f' }}>{modal.title}</h2>
            
            {modal.type === 'success' ? (
              <div>
                <p style={{ color: '#666' }}>Tu pedido ha sido registrado exitosamente.</p>
                <div style={{ background: '#fef5e8', padding: '20px', borderRadius: '10px', margin: '20px 0', border: '2px dashed #b87c4f' }}>
                  <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#8b5a2b' }}>🆔 <strong>TU NÚMERO DE PEDIDO:</strong></p>
                  <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#3b2f2f' }}>{modal.orderId}</span><br/>
                  <button 
                    onClick={() => { navigator.clipboard.writeText(modal.orderId); alert('¡Número de pedido copiado!'); }} 
                    style={{ marginTop: '15px', padding: '8px 15px', border: '1px solid #b87c4f', background: 'transparent', color: '#b87c4f', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    📋 Copiar ID
                  </button>
                </div>
                <p style={{ fontSize: '18px' }}><strong>💰 Total a pagar: <span style={{ color: '#d63384' }}>${modal.total} MXN</span></strong></p>
                <a 
                  href={modal.whatsappLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ display: 'inline-block', background: '#25D366', color: 'white', padding: '15px 30px', borderRadius: '30px', textDecoration: 'none', margin: '20px 0', fontWeight: 'bold', letterSpacing: '1px' }}
                >
                  📱 Enviar comprobante
                </a>
              </div>
            ) : (
              <p style={{ color: '#666', margin: '20px 0' }}>{modal.message}</p>
            )}

            <button onClick={closeModal} style={{ width: '100%', padding: '15px', background: '#3b2f2f', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px', textTransform: 'uppercase', letterSpacing: '2px' }}>
              Cerrar y volver al inicio
            </button>
          </div>
        </div>
      )}
    </div>
  );
}