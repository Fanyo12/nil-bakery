# 🍰 NIL BAKERY  
Version Node Express MySQL React  

Sistema web de venta de postres artesanales con autenticación tradicional y biométrica (WebAuthn).  
Desarrollado con arquitectura distribuida: backend en Node.js/Express, frontend en React y base de datos MySQL.

---

## ✨ Características

| Módulo | Funcionalidades |
|--------|----------------|
| 🔐 Autenticación | Registro de usuarios • Login tradicional • Inicio con huella digital (WebAuthn) • JWT • Roles (cliente/admin) |
| 🍰 Catálogo | CRUD de postres • Categorías • Control de stock • Imágenes |
| 🛒 Carrito | Agregar productos • Crear pedidos • Historial de compras • Cálculo automático de totales |
| 👥 Usuarios | Perfil personal • Gestión de cuentas • Panel admin |
| ⚙️ Admin | Gestión de pedidos • Visualización de usuarios • Actualización de estado de pedidos |
| 📱 Multiplataforma | PC (Windows Hello) • Celulares (huella/Face ID) • Diseño responsive |

---

## 🛠️ Tecnologías

| Área | Tecnologías |
|------|-----------|
| Backend | Node.js • Express • JWT • Bcrypt • WebAuthn • MySQL2 |
| Frontend | React • Tailwind CSS • Axios |
| Base de Datos | MySQL (HostGator) |
| Autenticación Biométrica | WebAuthn (Windows Hello, Touch ID, Face ID) |
| DevOps | GitHub • Render • HostGator |

---

## 🔧 API Admin (NUEVO)

Endpoints disponibles:

- `GET /api/admin/pedidos` → Obtener todos los pedidos con datos del cliente  
- `PUT /api/admin/pedidos/:id` → Actualizar estado del pedido  
- `GET /api/admin/usuarios` → Obtener lista de usuarios  

📌 Estos endpoints ya están conectados a la base de datos en producción.

---

## 👥 Equipo NIL BAKERY

| Integrante | Rol | GitHub | Responsabilidad | Emoji |
|------------|-----|--------|-----------------|-------|
| Fany | Backend Developer | @Fanyo12 | API REST, seguridad, WebAuthn, JWT, panel admin | 💻 |
| Bryan | Frontend Developer | @Bryan28-11 | UI con React, integración con API, diseño responsive | 🎨 |
| Irán | Database Admin | @IRANv28 | MySQL, HostGator, estructura de BD | 🗄️ |

---

## 🚀 Links importantes

- Backend en producción: https://nil-bakery.onrender.com  
- Repositorio GitHub: https://github.com/Fanyo12/nil-bakery  
- Frontend: (en desarrollo)

---

## 📌 Estado del Proyecto

| Etapa | Estado |
|------|--------|
| ✅ Backend base | Funcional y desplegado en Render |
| ✅ Conexión a BD | Conectado a MySQL (HostGator) |
| ✅ API Admin | Endpoints funcionales |
| 🔄 Frontend | En desarrollo (integración con API) |
| ⬜ Seguridad avanzada | Pendiente (roles y protección de rutas) |
| ⬜ Carrito de compras | En desarrollo |

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

## 🧁 Desarrollado con ❤️ por el equipo NIL BAKERY
