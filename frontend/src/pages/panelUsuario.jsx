import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/panelUsuario.css';

// Datos de ejemplo (se reemplazarán con datos reales del backend)
const pedidosEjemplo = [
  { id: '#0041', productos: 'Pan de Centeno, Croissant x2', precio: 195, estado: 'completado', fecha: '02 Mar 2025' },
  { id: '#0038', productos: 'Brownie, Café de Especialidad', precio: 140, estado: 'completado', fecha: '24 Feb 2025' },
  { id: '#0045', productos: 'Baguette x3, Tarta de Manzana', precio: 255, estado: 'en-camino', fecha: '08 Mar 2025' },
  { id: '#0046', productos: 'Pan de Nuez, Chocolate Caliente', precio: 155, estado: 'pendiente', fecha: '09 Mar 2025' },
];

const estadoLabel = {
  completado: 'Completado',
  pendiente: 'Pendiente',
  'en-camino': 'En camino',
};

export default function PanelUsuario() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Proteger ruta — si no hay sesión, redirigir al login
  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', fontFamily: 'sans-serif' }}>
        <p style={{ fontSize: '16px', color: '#666' }}>Debes iniciar sesión para ver tu perfil.</p>
        <Link to="/login" style={{ color: '#b5835a', fontWeight: 'bold' }}>Ir al Login</Link>
      </div>
    );
  }

  const inicial = user.nombre ? user.nombre.charAt(0).toUpperCase() : '?';

  return (
    <div className="panel-usuario">
      {/* Header */}
      <div className="panel-usuario__header">
        <div className="panel-usuario__avatar">{inicial}</div>
        <div>
          <h2 className="panel-usuario__name">Hola, {user.nombre} 👋</h2>
          <p className="panel-usuario__email">{user.email}</p>
        </div>
      </div>

      <div className="panel-usuario__grid">
        {/* Columna izquierda: Info */}
        <div>
          <div className="panel-card">
            <h3 className="panel-card__title">Mi Información</h3>

            <div className="panel-info-item">
              <div className="panel-info-item__label">Nombre</div>
              <div className="panel-info-item__value">{user.nombre || '—'}</div>
            </div>

            <div className="panel-info-item">
              <div className="panel-info-item__label">Correo</div>
              <div className="panel-info-item__value">{user.email || '—'}</div>
            </div>

            <div className="panel-info-item">
              <div className="panel-info-item__label">Teléfono</div>
              <div className="panel-info-item__value">{user.telefono || 'No registrado'}</div>
            </div>

            <div className="panel-info-item">
              <div className="panel-info-item__label">Miembro desde</div>
              <div className="panel-info-item__value">2025</div>
            </div>

            <button className="panel-edit-btn">✏️ Editar perfil</button>

            <button
              className="panel-edit-btn"
              style={{ marginTop: '10px', borderColor: '#cc4444', color: '#cc4444' }}
              onClick={() => { logout(); navigate('/'); }}
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Columna derecha: Pedidos */}
        <div>
          <div className="panel-card">
            <h3 className="panel-card__title">Mis Pedidos</h3>

            {pedidosEjemplo.length === 0 ? (
              <div className="panel-empty">
                <div className="panel-empty__icon">🛒</div>
                <p>Aún no tienes pedidos</p>
                <Link to="/menu" style={{ color: '#b5835a', fontWeight: 'bold', fontSize: '13px' }}>
                  Ver Menú
                </Link>
              </div>
            ) : (
              pedidosEjemplo.map((p) => (
                <div className="pedido-item" key={p.id}>
                  <div>
                    <div className="pedido-item__id">{p.id} · {p.fecha}</div>
                    <div className="pedido-item__products">{p.productos}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span className="pedido-item__price">${p.precio}</span>
                    <span className={`pedido-badge pedido-badge--${p.estado}`}>
                      {estadoLabel[p.estado]}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}