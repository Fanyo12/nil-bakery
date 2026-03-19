import { generateRegistrationOptions, verifyRegistrationResponse } from '@simplewebauthn/server';
import pool from '../config/db.js';
import {
  generateAuthenticationOptions,
  verifyAuthenticationResponse
} from '@simplewebauthn/server';

// ===============================
// BEGIN REGISTRATION
// ===============================
const generateRegistration = async (req, res) => {
  try {

    const { email } = req.body;

    console.log('Iniciando registro biométrico para:', email);

    const [users] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    const user = users[0];

    if (user.credential_id) {
      return res.status(400).json({
        error: 'Este usuario ya tiene un dispositivo registrado'
      });
    }

    const rpID = process.env.NODE_ENV === 'production'
      ? 'nil-bakery-1.onrender.com'
      : 'localhost';

    const options = await generateRegistrationOptions({
      rpName: 'Nil Bakery',
      rpID,
      userID: user.id.toString(),
      userName: user.email,
      userDisplayName: user.nombre || user.email,
      timeout: 60000,
      authenticatorSelection: {
        userVerification: 'preferred'
      }
    });

    // guardar challenge en BD
    await pool.query(
      'UPDATE usuarios SET current_challenge = ? WHERE id = ?',
      [options.challenge, user.id]
    );

    console.log('Challenge guardado para usuario:', user.id);

    res.json(options);

  } catch (error) {

    console.error('Error en generateRegistration:', error);

    res.status(500).json({
      error: 'Error al generar registro biométrico'
    });

  }
};



// ===============================
// COMPLETE REGISTRATION
// ===============================
const verifyRegistration = async (req, res) => {

  try {

    const { email, attestationResponse } = req.body;

    const [users] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    const user = users[0];

    const verification = await verifyRegistrationResponse({

      response: attestationResponse,

      expectedChallenge: user.current_challenge,

      expectedOrigin: process.env.NODE_ENV === 'production'
        ? 'https://nil-bakery-1.onrender.com'
        : 'http://localhost:5173',

      expectedRPID: process.env.NODE_ENV === 'production'
        ? 'nil-bakery-1.onrender.com'
        : 'localhost'

    });

    if (verification.verified) {

      const { credentialID, credentialPublicKey } = verification.registrationInfo;

      await pool.query(
        `UPDATE usuarios 
         SET credential_id = ?, 
             public_key = ?, 
             current_challenge = NULL 
         WHERE id = ?`,
        [
          Buffer.from(credentialID).toString('base64'),
          Buffer.from(credentialPublicKey).toString('base64'),
          user.id
        ]
      );

      console.log("✅ Dispositivo registrado:", user.id);

      res.json({
        verified: true,
        message: "Dispositivo registrado correctamente"
      });

    } else {

      res.status(400).json({
        verified: false,
        error: "Verificación fallida"
      });

    }

  } catch (error) {

    console.error("Error en verifyRegistration:", error);

    res.status(500).json({
      error: "Error verificando registro biométrico"
    });

  }

}
const generateAuthentication = async (req, res) => {
  try {
    // 🔥 mantener conexión viva
    await pool.query('SELECT 1');

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'Email requerido'
      });
    }

    const [users] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      });
    }

    const user = users[0];

    if (!user.credential_id) {
      return res.status(400).json({
        error: 'Este usuario no tiene biometría registrada'
      });
    }

    const rpID = process.env.NODE_ENV === 'production'
      ? 'nil-bakery-1.onrender.com'
      : 'localhost';

    const options = await generateAuthenticationOptions({
      rpID,
      allowCredentials: [
        {
          id: Buffer.from(user.credential_id, 'base64'),
          type: 'public-key'
        }
      ],
      userVerification: 'preferred',
      timeout: 60000
    });

    // 🔥 guardar challenge
    await pool.query(
      'UPDATE usuarios SET current_challenge = ? WHERE id = ?',
      [options.challenge, user.id]
    );

    console.log('🔐 Challenge login generado para:', user.id);

    res.json(options);

  } catch (error) {
    console.error('Error en generateAuthentication:', error);

    res.status(500).json({
      error: 'Error en login biométrico'
    });
  }
};

const verifyAuthentication = async (req, res) => {
  try {

    const { email, credential } = req.body;

    const [users] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = users[0];

    const verification = await verifyAuthenticationResponse({
      response: credential,
      expectedChallenge: user.current_challenge,
      expectedOrigin: process.env.NODE_ENV === 'production'
        ? 'https://nil-bakery-1.onrender.com'
        : 'http://localhost:5173',
      expectedRPID: process.env.NODE_ENV === 'production'
        ? 'nil-bakery-1.onrender.com'
        : 'localhost',
      authenticator: {
        credentialID: Buffer.from(user.credential_id, 'base64'),
        credentialPublicKey: Buffer.from(user.public_key, 'base64'),
      }
    });

    if (verification.verified) {

      res.json({
        success: true,
        message: 'Login biométrico exitoso 🔐'
      });

    } else {

      res.status(400).json({
        success: false,
        error: 'No se pudo autenticar'
      });

    }

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Error en verificación de login'
    });
  }
};

// exportar funciones
export {
  generateRegistration,
  verifyRegistration,
  generateAuthentication,
  verifyAuthentication
};
