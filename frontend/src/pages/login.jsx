import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import fondoImg from "../assets/fondo 1.jpeg";

const BACKEND_URL = "https://nil-bakery.onrender.com";

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
        console.log('Estructura de respuesta:', res);
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
      // Paso A: pedir opciones al backend
      const res = await fetch(`${BACKEND_URL}/api/webauthn/login/begin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email }),
      });

      if (!res.ok) throw new Error("Error al iniciar sesión biométrica.");

      const options = await res.json();

      // Paso B: convertir challenge a ArrayBuffer
      options.challenge = base64ToBuffer(options.challenge);

      if (options.allowCredentials) {
        options.allowCredentials = options.allowCredentials.map((c) => ({
          ...c,
          id: base64ToBuffer(c.id),
        }));
      }

      // Paso C: activar biometría del dispositivo
      const credential = await navigator.credentials.get({
        publicKey: options,
      });

      // Paso D: enviar credencial al backend para verificar
      const completeRes = await fetch(`${BACKEND_URL}/api/webauthn/login/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: email,
          credential: {
            id: credential.id,
            rawId: bufferToBase64(credential.rawId),
            type: credential.type,
            response: {
              authenticatorData: bufferToBase64(credential.response.authenticatorData),
              clientDataJSON: bufferToBase64(credential.response.clientDataJSON),
              signature: bufferToBase64(credential.response.signature),
              userHandle: credential.response.userHandle
                ? bufferToBase64(credential.response.userHandle)
                : null,
            },
          },
        }),
      });

      if (!completeRes.ok) throw new Error("Huella no reconocida.");

      const data = await completeRes.json();

      if (data.token && data.usuario) {
        login(data.token, data.usuario);
        alert(`¡Bienvenido, ${data.usuario.nombre}! 🖐️✅`);
        navigate('/');
      } else {
        alert('Huella verificada, pero faltan datos de usuario');
        navigate('/');
      }

    } catch (error) {
      console.error(error);
      alert("No se pudo iniciar sesión con huella: " + error.message);
    } finally {
      setHuellaCargando(false);
    }
  };

  // ── Helpers base64 ───────────────────────────────────────────────────
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

  // ── UI ────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${fondoImg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '20px'
    }}>

      <div style={{
        background: 'rgba(255,255,255,0.95)',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '380px',
        textAlign: 'center',
        fontFamily: 'sans-serif'
      }}>

        <h2 style={{ fontFamily: 'serif', color: '#3b2f2f', fontSize: '32px', marginBottom: '5px', marginTop: '0' }}>Bienvenido</h2>
        <p style={{ color: '#666', marginBottom: '30px', fontSize: '14px' }}>Ingresa a tu cuenta para continuar</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          <div style={{ textAlign: 'left' }}>
            <label style={labelStyle}>Correo Electrónico</label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={labelStyle}>Contraseña</label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          <button type="submit" style={btnDarkStyle}>
            Entrar
          </button>
        </form>

        {/* Separador */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', gap: '10px' }}>
          <div style={{ flex: 1, height: '1px', background: '#ddd' }} />
          <span style={{ color: '#999', fontSize: '12px' }}>O</span>
          <div style={{ flex: 1, height: '1px', background: '#ddd' }} />
        </div>

        {/* Botón de huella */}
        <button
          onClick={handleLoginHuella}
          disabled={huellaCargando}
          style={{
            ...btnHuellaStyle,
            background: huellaCargando ? '#999' : '#b5835a',
            cursor: huellaCargando ? 'not-allowed' : 'pointer',
          }}
        >
          {huellaCargando ? 'Verificando huella...' : '🖐️ Iniciar sesión con huella'}
        </button>

        <p style={{ marginTop: '8px', fontSize: '11px', color: '#999' }}>
          Ingresa tu correo antes de usar la huella
        </p>

        <p style={{ marginTop: '15px', fontSize: '13px', color: '#666' }}>
          ¿No tienes cuenta?{' '}
          <Link to="/registro" style={{ color: '#b5835a', textDecoration: 'none', fontWeight: 'bold' }}>
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}

// ── Estilos ────────────────────────────────────────────────────────────
const labelStyle = {
  fontWeight: 'bold', fontSize: '12px', color: '#333',
  textTransform: 'uppercase', letterSpacing: '1px',
};

const inputStyle = {
  width: '100%', padding: '12px', marginTop: '8px',
  borderRadius: '5px', border: '1px solid #ccc',
  boxSizing: 'border-box', fontFamily: 'sans-serif',
};

const btnDarkStyle = {
  padding: '15px', background: '#3b2f2f', color: 'white',
  border: 'none', borderRadius: '5px', cursor: 'pointer',
  fontSize: '14px', textTransform: 'uppercase',
  letterSpacing: '2px', marginTop: '10px', transition: '0.3s',
  width: '100%',
};

const btnHuellaStyle = {
  padding: '15px', color: 'white',
  border: 'none', borderRadius: '5px',
  fontSize: '14px', textTransform: 'uppercase',
  letterSpacing: '1px', transition: '0.3s',
  width: '100%',
};
