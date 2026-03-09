import { generateRegistrationOptions } from '@simplewebauthn/server';
import pool from '../config/db.js'; // Ajusta la ruta según tu estructura

const generateRegistration = async (req, res) => {
  try {
    // 1. El frontend nos envía el email del usuario
    const { email } = req.body;
    
    console.log('Iniciando registro biométrico para:', email);

    // 2. Buscar si el usuario existe en nuestra BD
    const [users] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ?', 
      [email]
    );
    
    // 3. Si no existe, error
    if (users.length === 0) {
      return res.status(404).json({ 
        error: 'Usuario no encontrado' 
      });
    }
    
    const user = users[0];
    console.log('Usuario encontrado:', user.id);

    // 4. Verificar si ya tiene un dispositivo registrado
    if (user.credential_id) {
      return res.status(400).json({ 
        error: 'Este usuario ya tiene un dispositivo registrado' 
      });
    }

    // 5. Determinar el RP ID según el entorno
    const rpID = process.env.NODE_ENV === 'production' 
      ? 'nil-bakery.onrender.com'  // producción
      : 'localhost';                 // desarrollo

    // 6. Generar las opciones para el registro biométrico
    const options = await generateRegistrationOptions({
      rpName: 'Nil Bakery',
      rpID: rpID,
      userID: user.id.toString(),
      userName: user.email,
      userDisplayName: user.nombre || user.email,
      excludeCredentials: [],
      authenticatorSelection: {
        userVerification: 'preferred',
      },
      timeout: 60000,
    });

    // 7. Guardar el challenge en la base de datos
    await pool.query(
      'UPDATE usuarios SET current_challenge = ? WHERE id = ?',
      [options.challenge, user.id]
    );
    
    console.log('Challenge guardado para usuario:', user.id);

    // 8. Enviar las opciones al frontend
    res.json(options);

  } catch (error) {
    console.error('Error en generateRegistration:', error);
    res.status(500).json({ 
      error: 'Error al generar registro biométrico' 
    });
  }
};

// Exportamos la función
export { generateRegistration };