import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/panelAdmin.css';

const API = 'https://nil-bakery.onrender.com/api';

const navItems = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'productos', icon: '🍞', label: 'Productos' },
  { id: 'pedidos', icon: '📦', label: 'Pedidos' },
  { id: 'usuarios', icon: '👥', label: 'Usuarios' },
];

const estadoOpciones = ['pendiente', 'en-camino', 'completado'];

export default function PanelAdmin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [seccion, setSeccion] = useState('dashboard');
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [modalProducto, setModalProducto] = useState(false);
  const [productoForm, setProductoForm] = useState({ nombre: '', descripcion: '', precio: '', stock: '' });
  const [editandoId, setEditandoId] = useState(null);

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <p>Debes iniciar sesión.</p>
        <Link to="/login" style={{ color: '#b5835a' }}>Ir al Login</Link>
      </div>
    );
  }

  if (user.rol !== 'admin') {
    navigate('/');
    return null;
  }

  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      try {
        if (seccion === 'productos' || seccion === 'dashboard') {
          const res = await fetch(`${API}/products`);
          const json = await res.json();
          setProductos(json.data || []);
        }
        if (seccion === 'pedidos' || seccion === 'dashboard') {
          const res = await fetch(`${API}/admin/pedidos`);
          const json = await res.json();
          setPedidos(json.data || []);
        }
        if (seccion === 'usuarios') {
          const res = await fetch(`${API}/admin/usuarios`);
          const json = await res.json();
          setUsuarios(json.data || []);
        }
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [seccion]);

  const cambiarEstadoPedido = async (id, estado) => {
    try {
      await fetch(`${API}/admin/pedidos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado })
      });
      setPedidos(prev => prev.map(p => p.id === id ? { ...p, estado } : p));
    } catch (error) {
      alert('Error al actualizar estado');
    }
  };

  const abrirModalNuevo = () => {
    setProductoForm({ nombre: '', descripcion: '', precio: '', stock: '' });
    setEditandoId(null);
    setModalProducto(true);
  };

  const abrirModalEditar = (p) => {
    setProductoForm({ nombre: p.nombre, descripcion: p.descripcion, precio: p.precio, stock: p.stock });
    setEditandoId(p.id);
    setModalProducto(true);
  };

  const guardarProducto = async () => {
    const url = editandoId ? `${API}/products/${editandoId}` : `${API}/products`;
    const method = editandoId ? 'PUT' : 'POST';
    try {
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoForm)
      });
      setModalProducto(false);
      const res = await fetch(`${API}/products`);
      const json = await res.json();
      setProductos(json.data || []);
    } catch (error) {
      alert('Error al guardar producto');
    }
  };

  const eliminarProducto = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return;
    try {
      await fetch(`${API}/products/${id}`, { method: 'DELETE' });
      setProductos(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      alert('Error al eliminar');
    }
  };

  const ventasHoy = pedidos
    .filter(p => new Date(p.fecha).toDateString() === new Date().toDateString())
    .reduce((sum, p) => sum + parseFloat(p.total), 0);

  const pedidosActivos = pedidos.filter(p => p.estado === 'pendiente' || p.estado === 'en-camino').length;

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

        {cargando && <p className="admin-cargando">Cargando...</p>}

        {/* ── DASHBOARD ── */}
        {seccion === 'dashboard' && !cargando && (
          <>
            <div className="admin-stats">
              <div className="admin-stat-card">
                <div className="admin-stat-card__value">${ventasHoy.toFixed(0)}</div>
                <div className="admin-stat-card__label">Ventas hoy</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-card__value">{pedidosActivos}</div>
                <div className="admin-stat-card__label">Pedidos activos</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-card__value">{productos.length}</div>
                <div className="admin-stat-card__label">Productos</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-card__value">{pedidos.length}</div>
                <div className="admin-stat-card__label">Pedidos totales</div>
              </div>
            </div>

            <div className="admin-table-card">
              <div className="admin-table-header">
                <h3 className="admin-table-title">Últimos Pedidos</h3>
                <button className="admin-add-btn" onClick={() => setSeccion('pedidos')}>Ver todos</button>
              </div>
              <table className="admin-table">
                <thead>
                  <tr><th>ID</th><th>Cliente</th><th>Total</th><th>Estado</th><th>Fecha</th></tr>
                </thead>
                <tbody>
                  {pedidos.slice(0, 5).map(p => (
                    <tr key={p.id}>
                      <td>#{p.id}</td>
                      <td>{p.cliente}</td>
                      <td>${parseFloat(p.total).toFixed(2)}</td>
                      <td><span className={`admin-badge admin-badge--${p.estado}`}>{p.estado}</span></td>
                      <td>{new Date(p.fecha).toLocaleDateString('es-MX')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── PRODUCTOS ── */}
        {seccion === 'productos' && !cargando && (
          <div className="admin-table-card">
            <div className="admin-table-header">
              <h3 className="admin-table-title">Productos</h3>
              <button className="admin-add-btn" onClick={abrirModalNuevo}>+ Agregar Producto</button>
            </div>
            <table className="admin-table">
              <thead>
                <tr><th>Nombre</th><th>Descripción</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {productos.map(p => (
                  <tr key={p.id}>
                    <td>{p.nombre}</td>
                    <td>{p.descripcion}</td>
                    <td>${parseFloat(p.precio).toFixed(2)}</td>
                    <td>{p.stock}</td>
                    <td>
                      <button className="admin-table__action" onClick={() => abrirModalEditar(p)}>✏️</button>
                      <button className="admin-table__action" onClick={() => eliminarProducto(p.id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── PEDIDOS ── */}
        {seccion === 'pedidos' && !cargando && (
          <div className="admin-table-card">
            <div className="admin-table-header">
              <h3 className="admin-table-title">Todos los Pedidos</h3>
            </div>
            <table className="admin-table">
              <thead>
                <tr><th>ID</th><th>Cliente</th><th>Total</th><th>Estado</th><th>Fecha</th><th>Cambiar Estado</th></tr>
              </thead>
              <tbody>
                {pedidos.map(p => (
                  <tr key={p.id}>
                    <td>#{p.id}</td>
                    <td>{p.cliente}<br/><small style={{ color: '#999' }}>{p.email}</small></td>
                    <td>${parseFloat(p.total).toFixed(2)}</td>
                    <td><span className={`admin-badge admin-badge--${p.estado}`}>{p.estado}</span></td>
                    <td>{new Date(p.fecha).toLocaleDateString('es-MX')}</td>
                    <td>
                      <select
                        className="admin-estado-select"
                        value={p.estado}
                        onChange={(e) => cambiarEstadoPedido(p.id, e.target.value)}
                      >
                        {estadoOpciones.map(op => (
                          <option key={op} value={op}>{op}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── USUARIOS ── */}
        {seccion === 'usuarios' && !cargando && (
          <div className="admin-table-card">
            <div className="admin-table-header">
              <h3 className="admin-table-title">Usuarios Registrados</h3>
            </div>
            <table className="admin-table">
              <thead>
                <tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Pedidos</th></tr>
              </thead>
              <tbody>
                {usuarios.map(u => (
                  <tr key={u.id}>
                    <td>{u.nombre}</td>
                    <td>{u.email}</td>
                    <td><span className={`admin-badge admin-badge--${u.rol === 'admin' ? 'completado' : 'pendiente'}`}>{u.rol || 'cliente'}</span></td>
                    <td>{u.total_pedidos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* ── Modal Producto ── */}
      {modalProducto && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h3 className="admin-modal__title">
              {editandoId ? 'Editar Producto' : 'Nuevo Producto'}
            </h3>
            <div className="admin-modal__grid">
              <input className="admin-modal__input" placeholder="Nombre" value={productoForm.nombre} onChange={e => setProductoForm({...productoForm, nombre: e.target.value})} />
              <input className="admin-modal__input" placeholder="Descripción" value={productoForm.descripcion} onChange={e => setProductoForm({...productoForm, descripcion: e.target.value})} />
              <input className="admin-modal__input" placeholder="Precio" type="number" value={productoForm.precio} onChange={e => setProductoForm({...productoForm, precio: e.target.value})} />
              <input className="admin-modal__input" placeholder="Stock" type="number" value={productoForm.stock} onChange={e => setProductoForm({...productoForm, stock: e.target.value})} />
            </div>
            <div className="admin-modal__actions">
              <button className="admin-modal__btn-cancel" onClick={() => setModalProducto(false)}>Cancelar</button>
              <button className="admin-modal__btn-save" onClick={guardarProducto}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}