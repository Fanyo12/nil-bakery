import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../services/authService";
import fondoImg from "../assets/fondo 2.jpeg";
const BACKEND_URL = "https://nil-bakery.onrender.com";

export default function Register() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [usuarioRegistrado, setUsuarioRegistrado] = useState(false);
  const [userId, setUserId] = useState(null);
  const [huellaCargando, setHuellaCargando] = useState(false);
  const [huellaRegistrada, setHuellaRegistrada] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ── 1. Registro normal ──────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Las contraseñas no coinciden. Por favor, verifica.");
      return;
    }

    try {
      const res = await registerUser({
        nombre: form.nombre,
        email: form.email,
        password: form.password,
      });

      console.log(res);
      // Guardamos el id del usuario para usarlo en WebAuthn
      setUserId(res.id || res.userId || res.user?.id);
      setUsuarioRegistrado(true);
      alert("¡Usuario creado con éxito! 🔥 Ahora puedes registrar tu huella.");
    } catch (error) {
      alert(error.message);
    }
  };

  // ── 2. Registro de huella (WebAuthn) ────────────────────────────────
  const handleRegistrarHuella = async () => {
    if (!window.PublicKeyCredential) {
      alert("Tu navegador no soporta autenticación biométrica.");
      return;
    }

    setHuellaCargando(true);

    try {
      // Paso A: pedir opciones al backend
      const res = await fetch(`${BACKEND_URL}/api/webauthn/register/begin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email })
      });

      if (!res.ok) throw new Error("Error al iniciar el registro biométrico.");

      const options = await res.json();

      // Paso B: convertir challenge y user.id de base64 a ArrayBuffer
      options.challenge = base64ToBuffer(options.challenge);
      options.user.id = base64ToBuffer(options.user.id);

      if (options.excludeCredentials) {
        options.excludeCredentials = options.excludeCredentials.map((c) => ({
          ...c,
          id: base64ToBuffer(c.id),
        }));
      }

      // Paso C: activar biometría del dispositivo
      const credential = await navigator.credentials.create({
        publicKey: options,
      });

      // Paso D: enviar credencial al backend para guardarla
      const finishRes = await fetch(`${BACKEND_URL}/api/webauthn/register/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.email,
          credential: {
            id: credential.id,
            rawId: bufferToBase64(credential.rawId),
            type: credential.type,
            response: {
              attestationObject: bufferToBase64(credential.response.attestationObject),
              clientDataJSON: bufferToBase64(credential.response.clientDataJSON),
            },
          },
        }),
      });

      if (!finishRes.ok) throw new Error("Error al guardar la huella.");

      setHuellaRegistrada(true);
      alert("¡Huella registrada con éxito! 🖐️✅");
    } catch (error) {
      console.error(error);
      alert("No se pudo registrar la huella: " + error.message);
    } finally {
      setHuellaCargando(false);
    }
  };

  // ── Helpers base64 ──────────────────────────────────────────────────
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

  // ── UI ───────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "85vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundImage: `linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)), url(${fondoImg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      padding: "40px 20px",
    }}>
      <div style={{
        background: "rgba(255,255,255,0.95)",
        padding: "40px",
        borderRadius: "10px",
        boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
        width: "100%",
        maxWidth: "400px",
        textAlign: "center",
        fontFamily: "sans-serif",
      }}>
        <h2 style={{ fontFamily: "serif", color: "#3b2f2f", fontSize: "30px", marginBottom: "5px", marginTop: "0" }}>
          Crear Cuenta
        </h2>
        <p style={{ color: "#666", marginBottom: "25px", fontSize: "14px" }}>
          Únete a Nil Bakery para hacer tus pedidos
        </p>

        {/* ── Formulario de registro ── */}
        {!usuarioRegistrado ? (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div style={{ textAlign: "left" }}>
              <label style={labelStyle}>Nombre Completo</label>
              <input name="nombre" type="text" placeholder="Ej. Valerie Rodriguez"
                value={form.nombre} onChange={handleChange} required style={inputStyle} />
            </div>

            <div style={{ textAlign: "left" }}>
              <label style={labelStyle}>Correo Electrónico</label>
              <input name="email" type="email" placeholder="ejemplo@correo.com"
                value={form.email} onChange={handleChange} required style={inputStyle} />
            </div>

            <div style={{ textAlign: "left" }}>
              <label style={labelStyle}>Contraseña</label>
              <input name="password" type="password" placeholder="********"
                value={form.password} onChange={handleChange} required style={inputStyle} />
            </div>

            <div style={{ textAlign: "left" }}>
              <label style={labelStyle}>Confirmar Contraseña</label>
              <input name="confirmPassword" type="password" placeholder="********"
                value={form.confirmPassword} onChange={handleChange} required style={inputStyle} />
            </div>

            <button type="submit" style={btnPrimaryStyle}>Registrarse</button>
          </form>
        ) : (
          /* ── Sección de huella (aparece tras registrarse) ── */
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div style={{ background: "#f0faf0", border: "1px solid #a8d5a2", borderRadius: "8px", padding: "15px" }}>
              <p style={{ color: "#2d6a2d", fontWeight: "bold", margin: "0 0 5px" }}>✅ ¡Cuenta creada!</p>
              <p style={{ color: "#555", fontSize: "13px", margin: "0" }}>
                Ahora puedes registrar tu huella para iniciar sesión más fácil.
              </p>
            </div>

            {!huellaRegistrada ? (
              <button
                onClick={handleRegistrarHuella}
                disabled={huellaCargando}
                style={{
                  ...btnPrimaryStyle,
                  background: huellaCargando ? "#999" : "#b5835a",
                  cursor: huellaCargando ? "not-allowed" : "pointer",
                }}
              >
                {huellaCargando ? "Activando biometría..." : "🖐️ Registrar Huella"}
              </button>
            ) : (
              <div style={{ background: "#fff8f0", border: "1px solid #e0b07a", borderRadius: "8px", padding: "15px" }}>
                <p style={{ color: "#7a4a1e", fontWeight: "bold", margin: "0" }}>🖐️ ¡Huella registrada con éxito!</p>
              </div>
            )}

            <Link to="/login" style={{ ...btnPrimaryStyle, textDecoration: "none", display: "block", background: "#3b2f2f" }}>
              Ir a Iniciar Sesión
            </Link>
          </div>
        )}

        <p style={{ marginTop: "20px", fontSize: "13px", color: "#666" }}>
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" style={{ color: "#b5835a", textDecoration: "none", fontWeight: "bold" }}>
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}

// ── Estilos reutilizables ─────────────────────────────────────────────
const labelStyle = {
  fontWeight: "bold", fontSize: "11px", color: "#333",
  textTransform: "uppercase", letterSpacing: "1px",
};

const inputStyle = {
  width: "100%", padding: "10px", marginTop: "5px",
  borderRadius: "5px", border: "1px solid #ccc",
  boxSizing: "border-box", fontFamily: "sans-serif",
};

const btnPrimaryStyle = {
  padding: "12px", background: "#3b2f2f", color: "white",
  border: "none", borderRadius: "5px", cursor: "pointer",
  fontSize: "13px", textTransform: "uppercase",
  letterSpacing: "2px", marginTop: "10px", transition: "0.3s",
};