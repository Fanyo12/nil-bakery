import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/panelAdmin.css';

// Datos de ejemplo (reemplazar con llamadas al backend)
const productosEjemplo = [
  { id: 1, nombre: 'Pan de Centeno', categoria: 'Panes', precio: 85, stock: 24, estado: 'activo' },
  { id: 2, nombre: 'Croissant de Mantequilla', categoria: 'Postres', precio: 55, stock: 18, estado: 'activo' },
  { id: 3, nombre: 'Tarta de Manzana', categoria: 'Postres', precio: 120, stock: 6, estado: 'activo' },
  { id: 4, nombre: 'Café de Especialidad', categoria: 'Bebidas', precio: 65, stock: 0, estado: 'inactivo' },
  { id: 5, nombre: 'Brownie de Chocolate', categoria: 'Postres', precio: 75, stock: 12, estado: 'activo' },
];

const pedidosEjemplo = [
  { id: '#0046', cliente: 'Ana Martínez', total: 155, estado: 'pendiente', fecha: '09 Mar 2025' },
  { id: '#0045', cliente: 'Luis Herrera', total: 255, estado: 'en-camino', fecha: '08 Mar 2025' },
  { id: '#0044', cliente: 'Sofía Torres', total: 85, estado: 'completado', fecha: '07 Mar 2025' },
  { id: '#0043', cliente: 'Carlos Ruiz', total: 195, estado: 'completado', fecha: '06 Mar 2025' },
];

const usuariosEjemplo = [
  { id: 1, nombre: 'Ana Martínez', email: 'ana@email.com', pedidos: 5, estado: 'activo' },
  { id: 2, nombre: 'Luis Herrera', email: 'luis@email.com', pedidos: 3, estado: 'activo' },
  { id: 3, nombre: 'Sofía Torres', email: 'sofia@email.com', pedidos: 1, estado: 'activo' },
];

const navItems = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'productos', icon: '🍞', label: 'Productos' },
  { id: 'pedidos', icon: '📦', label: 'Pedidos' },
  { id: 'usuarios', icon: '👥', label: 'Usuarios' },
];

export default function PanelAdmin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [seccion, setSeccion] = useState('dashboard');

  // Proteger ruta — solo admin puede entrar
  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', fontFamily: 'sans-serif' }}>
        <p style={{ color: '#666' }}>Debes iniciar sesión para acceder al panel.</p>
        <Link to="/login" style={{ color: '#b5835a', fontWeight: 'bold' }}>Ir al Login</Link>
      </div>
    );
  }

  // Aquí puedes agregar: if (user.rol !== 'admin') navigate('/')
  
  return (
    <div className="panel-admin">
      {/* Sidebar */}
      <aside className="panel-admin__sidebar">
        <div className="panel-admin__logo">☕ Nil <span>Admin</span></div>

        {navItems.map(item => (
          <button
            key={item.id}
            className={`sidebar-nav-item ${seccion === item.id ? 'active' : ''}`}
            onClick={() => setSeccion(item.id)}
          >
            <span className="sidebar-nav-item__icon">{item.icon}</span>
            {item.label}
          </button>
        ))}

        <button
          className="sidebar-nav-item"
          style={{ marginTop: 'auto', color: '#ff8a80', borderColor: 'transparent' }}
          onClick={() => { logout(); navigate('/'); }}
        >
          <span className="sidebar-nav-item__icon">🚪</span>
          Cerrar sesión
        </button>
      </aside>

      {/* Contenido */}
      <main className="panel-admin__main">
        <div className="panel-admin__topbar">
          <h1 className="panel-admin__page-title">
            {navItems.find(n => n.id === seccion)?.icon}{' '}
            {navItems.find(n => n.id === seccion)?.label}
          </h1>
          <span style={{ fontSize: '13px', color: '#999' }}>👤 {user.nombre}</span>
        </div>

        {/* ── DASHBOARD ── */}
        {seccion === 'dashboard' && (
          <>
            <div className="admin-stats">
              <div className="admin-stat-card">
                <div className="admin-stat-card__value">$1,840</div>
                <div className="admin-stat-card__label">Ventas hoy</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-card__value">24</div>
                <div className="admin-stat-card__label">Pedidos activos</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-card__value">5</div>
                <div className="admin-stat-card__label">Productos</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-card__value">3</div>
                <div className="admin-stat-card__label">Usuarios</div>
              </div>
            </div>

            {/* Últimos pedidos */}
            <div className="admin-table-card">
              <div className="admin-table-header">
                <h3 className="admin-table-title">Últimos Pedidos</h3>
                <button className="admin-add-btn" onClick={() => setSeccion('pedidos')}>Ver todos</button>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th><th>Cliente</th><th>Total</th><th>Estado</th><th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidosEjemplo.slice(0, 3).map(p => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.cliente}</td>
                      <td>${p.total}</td>
                      <td><span className={`admin-badge admin-badge--${p.estado}`}>{p.estado}</span></td>
                      <td>{p.fecha}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── PRODUCTOS ── */}
        {seccion === 'productos' && (
          <div className="admin-table-card">
            <div className="admin-table-header">
              <h3 className="admin-table-title">Productos</h3>
              <button className="admin-add-btn">+ Agregar Producto</button>
            </div>
            <table className="admin-table">
              <thead>
                <tr><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Estado</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {productosEjemplo.map(p => (
                  <tr key={p.id}>
                    <td>{p.nombre}</td>
                    <td>{p.categoria}</td>
                    <td>${p.precio}</td>
                    <td>{p.stock}</td>
                    <td><span className={`admin-badge admin-badge--${p.estado}`}>{p.estado}</span></td>
                    <td>
                      <button className="admin-table__action" title="Editar">✏️</button>
                      <button className="admin-table__action" title="Eliminar">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── PEDIDOS ── */}
        {seccion === 'pedidos' && (
          <div className="admin-table-card">
            <div className="admin-table-header">
              <h3 className="admin-table-title">Todos los Pedidos</h3>
            </div>
            <table className="admin-table">
              <thead>
                <tr><th>ID</th><th>Cliente</th><th>Total</th><th>Estado</th><th>Fecha</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {pedidosEjemplo.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.cliente}</td>
                    <td>${p.total}</td>
                    <td><span className={`admin-badge admin-badge--${p.estado}`}>{p.estado}</span></td>
                    <td>{p.fecha}</td>
                    <td>
                      <button className="admin-table__action" title="Ver detalle">👁️</button>
                      <button className="admin-table__action" title="Editar estado">✏️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── USUARIOS ── */}
        {seccion === 'usuarios' && (
          <div className="admin-table-card">
            <div className="admin-table-header">
              <h3 className="admin-table-title">Usuarios Registrados</h3>
            </div>
            <table className="admin-table">
              <thead>
                <tr><th>Nombre</th><th>Correo</th><th>Pedidos</th><th>Estado</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {usuariosEjemplo.map(u => (
                  <tr key={u.id}>
                    <td>{u.nombre}</td>
                    <td>{u.email}</td>
                    <td>{u.pedidos}</td>
                    <td><span className={`admin-badge admin-badge--${u.estado}`}>{u.estado}</span></td>
                    <td>
                      <button className="admin-table__action" title="Ver">👁️</button>
                      <button className="admin-table__action" title="Bloquear">🚫</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}