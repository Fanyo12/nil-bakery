import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/navbar.css';

export default function Navbar({ carritoCount = 0 }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar-shared">
      <h1 className="navbar-shared__logo">
        <Link to="/">Nil Bakery</Link>
      </h1>

      <div className="navbar-shared__links">
        <Link to="/" className="navbar-shared__link">Inicio</Link>
        <Link to="/menu" className="navbar-shared__link">Menú</Link>
        <Link to="/nuestra-historia" className="navbar-shared__link">Nuestra Historia</Link>

        {user ? (
          <>
            <Link to="/mi-cuenta" className="navbar-shared__link navbar-shared__link--user">
              👤 {user.nombre}
            </Link>

            {user.rol === 'admin' && (
              <Link to="/admin" className="navbar-shared__link navbar-shared__link--admin">
                Admin
              </Link>
            )}

            <button onClick={handleLogout} className="navbar-shared__btn-logout">
              Cerrar sesión
            </button>
          </>
        ) : (
          <Link to="/login" className="navbar-shared__btn-login">
            Iniciar Sesión
          </Link>
        )}

        <Link to="/carrito" className="navbar-shared__btn-cart">
          🛒 Mi Carrito ({carritoCount})
        </Link>
      </div>
    </nav>
  );
}
