import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/panelAdmin.css';

const API = 'https://nil-bakery.onrender.com/api';

// ✅ CAMBIO 1: Se agregó 'ganancias' como nueva sección en el sidebar
const navItems = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'productos', icon: '🍞', label: 'Productos' },
  { id: 'pedidos', icon: '📦', label: 'Pedidos' },
  { id: 'usuarios', icon: '👥', label: 'Usuarios' },
  { id: 'ganancias', icon: '💰', label: 'Ganancias' }, // ← NUEVO
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
      // 1. Obtenemos el token (Asegúrate de que así se llame en tu localStorage)
      const token = localStorage.getItem('token'); 
      
      // 2. Configuramos las credenciales
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Aquí va la llave de acceso
        }
      };

      if (seccion === 'productos' || seccion === 'dashboard') {
        // Los productos suelen ser públicos, pero si los proteges, agrégale el config
        const res = await fetch(`${API}/products`); 
        const json = await res.json();
        setProductos(json.data || []);
      }
      
      if (seccion === 'pedidos' || seccion === 'dashboard' || seccion === 'ganancias') {
        // 3. Enviamos el config en la petición protegida
        const res = await fetch(`${API}/admin/pedidos`, config);
        const json = await res.json();
        setPedidos(json.data || []);
      }
      
      if (seccion === 'usuarios') {
        // 3. Enviamos el config en la petición protegida
        const res = await fetch(`${API}/admin/usuarios`, config);
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

  // ✅ CAMBIO 3: ventasHoy ahora filtra TAMBIÉN por estado 'completado',
  // antes solo filtraba por fecha y sumaba pedidos sin importar su estado.
  const ventasHoy = pedidos
    .filter(p =>
      new Date(p.fecha).toDateString() === new Date().toDateString() &&
      p.estado === 'completado' // ← NUEVO filtro
    )
    .reduce((sum, p) => sum + parseFloat(p.total), 0);

  const pedidosActivos = pedidos.filter(p => p.estado === 'pendiente' || p.estado === 'en-camino').length;

  // ✅ CAMBIO 4: Nuevas variables para la sección de Ganancias
  // Total acumulado de todos los pedidos completados (sin importar fecha)
  const ventasTotales = pedidos
    .filter(p => p.estado === 'completado')
    .reduce((sum, p) => sum + parseFloat(p.total), 0);

  const pedidosCompletados = pedidos.filter(p => p.estado === 'completado');

  // Promedio de ingreso por pedido completado
  const promedioPorPedido = pedidosCompletados.length > 0
    ? ventasTotales / pedidosCompletados.length
    : 0;

  // Agrupar ventas completadas por fecha para la gráfica de barras
  const ventasPorDia = pedidosCompletados.reduce((acc, p) => {
    const fecha = new Date(p.fecha).toLocaleDateString('es-MX');
    acc[fecha] = (acc[fecha] || 0) + parseFloat(p.total);
    return acc;
  }, {});

  // Ordenar las fechas de más antigua a más reciente
  const diasGrafica = Object.entries(ventasPorDia).sort(
    (a, b) => new Date(a[0].split('/').reverse().join('-')) - new Date(b[0].split('/').reverse().join('-'))
  );

  const maxVenta = Math.max(...diasGrafica.map(([, v]) => v), 1);

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
                {/* ✅ CAMBIO 5: El valor ahora es correcto porque ventasHoy ya filtra por completado */}
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

        {/* ── GANANCIAS ── */}
        {/* ✅ CAMBIO 6: Sección completamente nueva con tarjetas de resumen y gráfica de barras */}
        {seccion === 'ganancias' && !cargando && (
          <div>
            {/* Tarjetas de resumen financiero */}
            <div className="admin-stats">
              <div className="admin-stat-card">
                {/* Total de ingresos de todos los pedidos completados */}
                <div className="admin-stat-card__value" style={{ color: '#b5835a' }}>
                  ${ventasTotales.toFixed(2)}
                </div>
                <div className="admin-stat-card__label">Ingresos totales</div>
              </div>
              <div className="admin-stat-card">
                {/* Cantidad de pedidos que ya están en estado completado */}
                <div className="admin-stat-card__value">{pedidosCompletados.length}</div>
                <div className="admin-stat-card__label">Pedidos completados</div>
              </div>
              <div className="admin-stat-card">
                {/* Cuánto genera en promedio cada pedido completado */}
                <div className="admin-stat-card__value">${promedioPorPedido.toFixed(2)}</div>
                <div className="admin-stat-card__label">Ticket promedio</div>
              </div>
              <div className="admin-stat-card">
                {/* Ventas completadas del día actual */}
                <div className="admin-stat-card__value">${ventasHoy.toFixed(2)}</div>
                <div className="admin-stat-card__label">Ventas hoy</div>
              </div>
            </div>

            {/* Gráfica de barras: ventas agrupadas por día */}
            <div className="admin-table-card">
              <div className="admin-table-header">
                <h3 className="admin-table-title">📈 Ventas por Día</h3>
                <span style={{ fontSize: '12px', color: '#999' }}>Solo pedidos completados</span>
              </div>

              {diasGrafica.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
                  No hay ventas completadas aún.
                </p>
              ) : (
                <div style={{ padding: '20px 16px' }}>

                  {/* Contenedor de barras */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '12px',
                    height: '200px',
                    borderBottom: '2px solid #eee',
                    borderLeft: '2px solid #eee',
                    paddingBottom: '8px',
                    paddingLeft: '8px',
                    marginBottom: '8px'
                  }}>
                    {diasGrafica.map(([fecha, total]) => {
                      // Altura proporcional al valor máximo, mínimo 10px para que sea visible
                      const altura = Math.max((total / maxVenta) * 175, 10);
                      return (
                        <div
                          key={fecha}
                          style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
                        >
                          {/* Monto encima de la barra */}
                          <span style={{ fontSize: '11px', color: '#b5835a', fontWeight: '700' }}>
                            ${total.toFixed(0)}
                          </span>
                          {/* Barra con degradado de la paleta del sitio */}
                          <div
                            title={`${fecha}: $${total.toFixed(2)}`}
                            style={{
                              width: '100%',
                              minWidth: '32px',
                              height: `${altura}px`,
                              background: 'linear-gradient(to top, #3b2f2f, #b5835a)',
                              borderRadius: '6px 6px 0 0',
                              transition: 'height 0.4s ease',
                              cursor: 'default',
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Etiquetas de fecha debajo de cada barra */}
                  <div style={{ display: 'flex', gap: '12px', paddingLeft: '8px' }}>
                    {diasGrafica.map(([fecha]) => (
                      <div
                        key={fecha}
                        style={{ flex: 1, textAlign: 'center', fontSize: '10px', color: '#999', minWidth: '32px' }}
                      >
                        {fecha}
                      </div>
                    ))}
                  </div>

                  {/* Tabla de detalle debajo de la gráfica */}
                  <table className="admin-table" style={{ marginTop: '32px' }}>
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Pedidos completados</th>
                        <th>Total del día</th>
                      </tr>
                    </thead>
                    <tbody>
                      {diasGrafica.map(([fecha, total]) => {
                        // Contar cuántos pedidos hubo ese día
                        const cantDia = pedidosCompletados.filter(
                          p => new Date(p.fecha).toLocaleDateString('es-MX') === fecha
                        ).length;
                        return (
                          <tr key={fecha}>
                            <td>{fecha}</td>
                            <td>{cantDia}</td>
                            <td style={{ color: '#b5835a', fontWeight: '700' }}>${total.toFixed(2)}</td>
                          </tr>
                        );
                      })}
                      {/* Fila de totales al final de la tabla */}
                      <tr style={{ borderTop: '2px solid #eee', fontWeight: '700' }}>
                        <td>Total general</td>
                        <td>{pedidosCompletados.length}</td>
                        <td style={{ color: '#b5835a' }}>${ventasTotales.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
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