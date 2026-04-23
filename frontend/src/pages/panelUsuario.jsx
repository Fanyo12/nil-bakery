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
        <p style={{ color: '#666' }}>Debes iniciar sesión para ver tu cuenta.</p>
        <button
          onClick={() => navigate('/login')}
          style={{ color: '#b5835a', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}
        >
          Ir al Login
        </button>
      </div>
    );
  }

  return (
    <div className="panel-usuario">

      {/* ── Header con avatar ── */}
      <div className="panel-usuario__header">
        <div className="panel-usuario__avatar">
          {user.nombre?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="panel-usuario__name">{user.nombre}</h2>
          <p className="panel-usuario__email">{user.email}</p>
        </div>
      </div>

      {/* ── Grid principal ── */}
      <div className="panel-usuario__grid">

        {/* Columna izquierda — Info personal */}
        <div className="panel-card">
          <h3 className="panel-card__title">Mi Información</h3>

          <div className="panel-info-item">
            <div className="panel-info-item__label">Nombre</div>
            <div className="panel-info-item__value">{user.nombre}</div>
          </div>

          <div className="panel-info-item">
            <div className="panel-info-item__label">Correo</div>
            <div className="panel-info-item__value">{user.email}</div>
          </div>

          <div className="panel-info-item">
            <div className="panel-info-item__label">Rol</div>
            <div className="panel-info-item__value" style={{ textTransform: 'capitalize' }}>
              {user.rol || 'Cliente'}
            </div>
          </div>

          <button
            className="panel-edit-btn"
            onClick={() => { logout(); navigate('/'); }}
          >
            🚪 Cerrar Sesión
          </button>
        </div>

        {/* Columna derecha — Historial de pedidos */}
        <div className="panel-card">
          <h3 className="panel-card__title">📦 Mis Pedidos</h3>

          {cargando ? (
            <div className="panel-empty">
              <div className="panel-empty__icon">⏳</div>
              <p>Cargando tus pedidos...</p>
            </div>
          ) : pedidos.length === 0 ? (
            <div className="panel-empty">
              <div className="panel-empty__icon">🛍️</div>
              <p>Aún no tienes pedidos registrados.</p>
            </div>
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
    </div>
  );
}