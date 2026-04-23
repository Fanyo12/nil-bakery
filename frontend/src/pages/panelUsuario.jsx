import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/panelUsuario.css';

const estadoLabel = {
  completado: 'Completado',
  pendiente: 'Pendiente',
  'en-camino': 'En camino',
};

export default function PanelUsuario() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
  const cargarHistorial = async () => {
    if (user?.id) {
      try {
        // Pon aquí la URL de donde subiste el archivo en HostGator
        // En PanelUsuario.jsx
        const response = await fetch(`https://syscunid.com.mx/api/obtener_pedidos.php?usuario_id=${user.id}`);
        const data = await response.json();
        setPedidos(data);
      } catch (error) {
        console.error("Error al conectar con HostGator:", error);
      }
    }
  };
  cargarHistorial();
}, [user]);

  if (!user) return <p>Inicia sesión para continuar.</p>;

  return (
        <div className="panel-usuario" style={{ paddingTop: '100px' }}> 
          {/* El resto de tu código... */}
        </div>
      );
      {/* Header y Datos de Usuario (Igual que antes) */}
      
      <div className="panel-card">
        <h3 className="panel-card__title">Mis Pedidos Reales</h3>
        {pedidos.length === 0 ? (
          <p>Aún no tienes pedidos.</p>
        ) : (
          pedidos.map((p) => (
            <div className="pedido-item" key={p.id}>
              <div>
                <div className="pedido-item__id">#{p.id.toString().padStart(4, '0')} · {new Date(p.fecha).toLocaleDateString()}</div>
                {/* Aquí mostramos la lista de productos que viene de detalle_pedidos */}
                <div className="pedido-item__products">{p.productos.join(', ')}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span className="pedido-item__price">${p.total}</span>
                <span className={`pedido-badge pedido-badge--${p.estado}`}>
                  {estadoLabel[p.estado]}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
}