import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { loginUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import fondoImg from "../assets/fondo 1.jpeg";
import '../styles/login.css'; // 👈 IMPORTAMOS LOS ESTILOS AQUÍ

const BACKEND_URL = "https://nil-bakery.onrender.com";

// ── Helpers base64 ────────────────────────────────────────────────────
function base64ToBuffer(base64) {
  const bin = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0)).buffer;
}

function bufferToBase64(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [huellaCargando, setHuellaCargando] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // ── 1. Login normal ─────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password });
      console.log('Respuesta del backend:', res);

      if (res.token && res.usuario) {
        login(res.token, res.usuario);
        alert(`¡Bienvenido de vuelta, ${res.usuario.nombre}! ☕`);
        navigate('/');
      } else {
        alert('Login exitoso, pero faltan datos de usuario');
        navigate('/');
      }
    } catch (error) {
      alert(error.message || "Error al iniciar sesión. Verifica tus datos.");
    }
  };

  // ── 2. Login con huella (WebAuthn) ──────────────────────────────────
  const handleLoginHuella = async () => {
    if (!window.PublicKeyCredential) {
      alert("Tu navegador no soporta autenticación biométrica.");
      return;
    }

    if (!email) {
      alert("Ingresa tu correo electrónico primero para usar la huella.");
      return;
    }

    setHuellaCargando(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/webauthn/login/begin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Error al iniciar sesión biométrica.");

      const options = await res.json();
      options.challenge = base64ToBuffer(options.challenge);

      if (options.allowCredentials) {
        options.allowCredentials = options.allowCredentials.map((c) => ({
          ...c,
          id: base64ToBuffer(c.id),
        }));
      }

      const cred = await navigator.credentials.get({
        publicKey: options,
      });

      const credentialJSON = {
        id: cred.id,
        rawId: bufferToBase64(cred.rawId),
        type: cred.type,
        response: {
          clientDataJSON: bufferToBase64(cred.response.clientDataJSON),
          authenticatorData: bufferToBase64(cred.response.authenticatorData),
          signature: bufferToBase64(cred.response.signature),
          userHandle: cred.response.userHandle
            ? bufferToBase64(cred.response.userHandle)
            : null,
        },
      };

      const completeRes = await fetch(`${BACKEND_URL}/api/webauthn/login/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          credential: credentialJSON
        }),
      });

      if (!completeRes.ok) throw new Error("Huella no reconocida.");

      const data = await completeRes.json();
      console.log("Login biométrico exitoso:", data);

      if (data.token && data.usuario) {
        login(data.token, data.usuario);
        alert(`¡Bienvenido, ${data.usuario.nombre}! 🖐️✅`);
        navigate('/');
      } else if (data.success) {
        alert("Huella verificada ✅ pero el backend no devuelve sesión aún.");
      } else {
        alert("Error al iniciar sesión con huella.");
      }

    } catch (error) {
      console.error(error);
      alert("No se pudo iniciar sesión con huella: " + error.message);
    } finally {
      setHuellaCargando(false);
    }
  };

  // ── UI ────────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />

      <div 
        className="login-container" 
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${fondoImg})` }}
      >
        <div className="login-card">

          <h2 className="login-title">Bienvenido</h2>
          <p className="login-subtitle">Ingresa a tu cuenta para continuar</p>

          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <label className="input-label">Correo Electrónico</label>
              <input
                type="email"
                placeholder="Valerie@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Contraseña</label>
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field"
              />
            </div>

            <button type="submit" className="btn-dark">Entrar</button>
          </form>

          {/* Separador */}
          <div className="login-separator">
            <div className="separator-line" />
            <span className="separator-text">O</span>
            <div className="separator-line" />
          </div>

          {/* Botón de huella */}
          <button
            onClick={handleLoginHuella}
            disabled={huellaCargando}
            className={`btn-dark ${!huellaCargando ? 'btn-huella' : ''}`}
          >
            {huellaCargando ? 'Verificando huella...' : '🖐️ Iniciar sesión con huella'}
          </button>

          <p className="hint-text">
            Ingresa tu correo antes de usar la huella
          </p>

          <p className="signup-text">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="signup-link">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}