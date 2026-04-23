import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
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
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarHistorial = async () => {
      if (user?.id) {
        try {
          const response = await fetch(
            `https://syscunid.com.mx/api/obtener_pedidos.php?usuario_id=${user.id}`
          );
          const data = await response.json();
          setPedidos(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error('Error al conectar con HostGator:', error);
          setPedidos([]);
        } finally {
          setCargando(false);
        }
      } else {
        setCargando(false);
      }
    };
    cargarHistorial();
  }, [user]);

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', fontFamily: 'sans-serif' }}>
        <p>Debes iniciar sesión para ver tu cuenta.</p>
        <button onClick={() => navigate('/login')} style={{ color: '#b5835a', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
          Ir al Login
        </button>
      </div>
    );
  }

  return (
    <div className="panel-usuario" style={{ paddingTop: '100px' }}>

      {/* ── Encabezado ── */}
      <div className="panel-header">
        <div className="panel-header__info">
          <div className="panel-header__avatar">
            {user.nombre?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="panel-header__name">{user.nombre}</h2>
            <p className="panel-header__email">{user.email}</p>
          </div>
        </div>
        <button
          className="panel-header__logout"
          onClick={() => { logout(); navigate('/'); }}
        >
          Cerrar sesión
        </button>
      </div>

      {/* ── Mis Pedidos ── */}
      <div className="panel-card">
        <h3 className="panel-card__title">📦 Mis Pedidos</h3>

        {cargando ? (
          <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
            Cargando pedidos...
          </p>
        ) : pedidos.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
            Aún no tienes pedidos registrados.
          </p>
        ) : (
          pedidos.map((p) => (
            <div className="pedido-item" key={p.id}>
              <div>
                <div className="pedido-item__id">
                  #{p.id} · {new Date(p.fecha).toLocaleDateString('es-MX')}
                </div>
                <div className="pedido-item__products">
                  {p.productos || 'Ver detalles en sucursal'}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span className="pedido-item__price">
                  ${parseFloat(p.total).toFixed(2)}
                </span>
                <span className={`pedido-badge pedido-badge--${p.estado}`}>
                  {estadoLabel[p.estado] || 'Pendiente'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}