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

  // ✅ Eliminar un producto del carrito
  const eliminarItem = (index) => {
    const nuevo = carrito.filter((_, i) => i !== index);
    setCarrito(nuevo);
  };

  // ✅ Aumentar cantidad (duplica el item en el array)
  const aumentar = (index) => {
    const item = carrito[index];
    setCarrito([...carrito, item]);
  };

  // ✅ Disminuir cantidad (elimina una ocurrencia)
  const disminuir = (index) => {
    // Cuenta cuántas veces aparece este item
    const nombre = carrito[index].nombre || carrito[index].nombre_pan || carrito[index].name;
    const ocurrencias = carrito.filter(i => (i.nombre || i.nombre_pan || i.name) === nombre).length;
    
    if (ocurrencias <= 1) {
      eliminarItem(index);
    } else {
      const nuevo = [...carrito];
      nuevo.splice(index, 1);
      setCarrito(nuevo);
    }
  };

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

    let resumenTexto = "";
    carrito.forEach(item => {
      const nombre = item.nombre || item.nombre_pan || item.name || 'Producto';
      resumenTexto += `• ${nombre} - $${parseFloat(item.precio).toFixed(2)}\n`;
    });

    try {
      await emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_NEGOCIO, {
        order_id: orderId,
        customer_name: formData.customerName,
        to_email: formData.email,
        customer_phone: formData.phone,
        order_summary: resumenTexto,
        total: total.toFixed(2),
        order_date: orderDate
      });

      await emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_CLIENTE, {
        order_id: orderId,
        customer_name: formData.customerName,
        to_email: formData.email,
        customer_phone: formData.phone,
        order_summary: resumenTexto,
        total: total.toFixed(2),
        order_date: orderDate
      });

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

  // ✅ Agrupar items para mostrar cantidad
  const itemsAgrupados = carrito.reduce((acc, item, index) => {
    const nombre = item.nombre || item.nombre_pan || item.name;
    const existe = acc.find(i => i.nombre === nombre);
    if (existe) {
      existe.cantidad++;
      existe.subtotal += parseFloat(item.precio);
    } else {
      acc.push({
        nombre,
        precio: parseFloat(item.precio),
        subtotal: parseFloat(item.precio),
        cantidad: 1,
        index
      });
    }
    return acc;
  }, []);

  return (
    <div style={{ paddingTop: '100px', minHeight: '80vh', paddingInline: '20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <div style={{ background: '#3b2f2f', color: 'white', padding: '20px', textAlign: 'center' }}>
          <h2 style={{ margin: 0 }}>{mostrarPago ? 'Confirmar Pedido' : 'Tu Carrito'}</h2>
        </div>

        <div style={{ padding: '30px' }}>
          {carrito.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>🛒</div>
              <p style={{ color: '#999' }}>Tu carrito está vacío.</p>
              <Link to="/menu" style={{ color: '#b5835a', fontWeight: 'bold' }}>Ver Menú</Link>
            </div>
          ) : (
            <>
              {!mostrarPago ? (
                <div>
                  {/* ✅ Lista con controles de cantidad */}
                  {itemsAgrupados.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #eee' }}>
                      
                      <span style={{ flex: 1, fontWeight: '500' }}>{item.nombre}</span>
                      
                      {/* Controles cantidad */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '20px' }}>
                        <button
                          onClick={() => disminuir(item.index)}
                          style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #ddd', background: '#f5f5f5', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >−</button>
                        <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 'bold' }}>{item.cantidad}</span>
                        <button
                          onClick={() => aumentar(item.index)}
                          style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #ddd', background: '#f5f5f5', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >+</button>
                      </div>

                      <span style={{ fontWeight: 'bold', minWidth: '70px', textAlign: 'right' }}>
                        ${item.subtotal.toFixed(2)}
                      </span>

                      {/* Botón eliminar */}
                      <button
                        onClick={() => {
                          const nuevo = carrito.filter((_, idx) => {
                            const n = carrito[idx].nombre || carrito[idx].nombre_pan || carrito[idx].name;
                            return n !== item.nombre;
                          });
                          setCarrito(nuevo);
                        }}
                        style={{ marginLeft: '12px', background: 'none', border: 'none', cursor: 'pointer', color: '#ff6b6b', fontSize: '16px' }}
                      >🗑️</button>
                    </div>
                  ))}

                  <div style={{ marginTop: '20px', textAlign: 'right' }}>
                    <h3 style={{ color: '#3b2f2f' }}>Total: ${total.toFixed(2)}</h3>
                    <button
                      onClick={() => setMostrarPago(true)}
                      style={{ background: '#3b2f2f', color: 'white', border: 'none', padding: '12px 25px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      Continuar al pago →
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={processPayment} style={{ display: 'grid', gap: '15px' }}>
                  {/* Resumen del pedido */}
                  <div style={{ background: '#faf6f2', borderRadius: '10px', padding: '15px', marginBottom: '5px' }}>
                    <p style={{ fontWeight: 'bold', color: '#3b2f2f', margin: '0 0 10px' }}>Resumen del pedido:</p>
                    {itemsAgrupados.map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                        <span>{item.nombre} x{item.cantidad}</span>
                        <span>${item.subtotal.toFixed(2)}</span>
                      </div>
                    ))}
                    <div style={{ borderTop: '1px solid #ddd', marginTop: '10px', paddingTop: '10px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Total</span>
                      <span style={{ color: '#b5835a' }}>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <input type="text" id="customerName" placeholder="Nombre Completo" required onChange={handleInputChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                  <input type="email" id="email" placeholder="Tu Correo" required onChange={handleInputChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                  <input type="tel" id="phone" placeholder="Teléfono" required onChange={handleInputChange} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                    <button type="button" onClick={() => setMostrarPago(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>← Atrás</button>
                    <button type="submit" disabled={isLoading} style={{ background: '#28a745', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '8px', cursor: 'pointer' }}>
                      {isLoading ? 'Procesando...' : '✅ Confirmar y Pagar'}
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