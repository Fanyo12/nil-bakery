import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    alert(`Intentando iniciar sesión con: ${email}`);
  };

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      // Otra foto de panadería más oscura para el fondo
      backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.unsplash.com/photo-1486427944299-d1955d23e34d?q=80&w=2000&auto=format&fit=crop)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '20px'
    }}>
      
      {/* Tarjeta de Login estilo "Cristal" */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
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
            <label style={{ fontWeight: 'bold', fontSize: '12px', color: '#333', textTransform: 'uppercase', letterSpacing: '1px' }}>Correo Electrónico</label>
            <input 
              type="email" 
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', marginTop: '8px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', fontFamily: 'sans-serif' }}
            />
          </div>

          <div style={{ textAlign: 'left' }}>
            <label style={{ fontWeight: 'bold', fontSize: '12px', color: '#333', textTransform: 'uppercase', letterSpacing: '1px' }}>Contraseña</label>
            <input 
              type="password" 
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', marginTop: '8px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box', fontFamily: 'sans-serif' }}
            />
          </div>

          <button 
            type="submit" 
            style={{ padding: '15px', background: '#3b2f2f', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '10px', transition: '0.3s' }}
          >
            Entrar
          </button>
        </form>
        
        <p style={{ marginTop: '25px', fontSize: '13px', color: '#666' }}>
  ¿No tienes cuenta? <Link to="/registro" style={{ color: '#b5835a', textDecoration: 'none', fontWeight: 'bold' }}>Regístrate aquí</Link>
</p>

      </div>
    </div>
  );
}