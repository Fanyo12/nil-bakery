import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../services/authService";

export default function Register() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: "", // Agregado para validación visual en el frontend
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Verificamos que las contraseñas coincidan antes de enviarlas al servidor
    if (form.password !== form.confirmPassword) {
      alert("Las contraseñas no coinciden. Por favor, verifica.");
      return;
    }

    // 2. Intentamos registrar al usuario con tu servicio
    try {
      const res = await registerUser({
        nombre: form.nombre,
        email: form.email,
        password: form.password
      });
      console.log(res);
      alert("¡Usuario creado con éxito! 🔥");
      // Opcional: Aquí después podrías redirigirlo a la pantalla de Login
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      // Foto de fondo elegante de panadería
      backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(https://images.unsplash.com/photo-1486427944299-d1955d23e34d?q=80&w=2000&auto=format&fit=crop)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '40px 20px'
    }}>
      
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
        fontFamily: 'sans-serif'
      }}>
        
        <h2 style={{ fontFamily: 'serif', color: '#3b2f2f', fontSize: '30px', marginBottom: '5px', marginTop: '0' }}>Crear Cuenta</h2>
        <p style={{ color: '#666', marginBottom: '25px', fontSize: '14px' }}>Únete a Nil Bakery para hacer tus pedidos</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontWeight: 'bold', fontSize: '11px', color: '#333', textTransform: 'uppercase', letterSpacing: '1px' }}>Nombre Completo</label>
            <input 
              name="nombre"
              type="text" 
              placeholder="Ej. Juan Pérez"
              value={form.nombre}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', fontFamily: 'sans-serif' }}
            />
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ fontWeight: 'bold', fontSize: '11px', color: '#333', textTransform: 'uppercase', letterSpacing: '1px' }}>Correo Electrónico</label>
            <input 
              name="email"
              type="email" 
              placeholder="ejemplo@correo.com"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', fontFamily: 'sans-serif' }}
            />
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ fontWeight: 'bold', fontSize: '11px', color: '#333', textTransform: 'uppercase', letterSpacing: '1px' }}>Contraseña</label>
            <input 
              name="password"
              type="password" 
              placeholder="********"
              value={form.password}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', fontFamily: 'sans-serif' }}
            />
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ fontWeight: 'bold', fontSize: '11px', color: '#333', textTransform: 'uppercase', letterSpacing: '1px' }}>Confirmar Contraseña</label>
            <input 
              name="confirmPassword"
              type="password" 
              placeholder="********"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', fontFamily: 'sans-serif' }}
            />
          </div>

          <button 
            type="submit" 
            style={{ padding: '12px', background: '#3b2f2f', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '10px', transition: '0.3s' }}
          >
            Registrarse
          </button>
        </form>
        
        <p style={{ marginTop: '20px', fontSize: '13px', color: '#666' }}>
          ¿Ya tienes cuenta? <Link to="/login" style={{ color: '#b5835a', textDecoration: 'none', fontWeight: 'bold' }}>Inicia sesión aquí</Link>
        </p>

      </div>
    </div>
  );
}