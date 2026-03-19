import { getRegistrationOptions, getAuthenticationOptions } from '../services/webauthn.service.js';
import { saveChallenge } from '../utils/challengeStore.js';
import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js'; // ajusta si tu ruta es diferente

// MOCK USER (luego vendrá de MySQL)
const mockUser = {
  id: "user123",
  email: "test@nil.com"
};
export const verifyLogin = async (req, res) => {
  try {
    const { email, assertionResponse } = req.body;

    console.log('Verificando login biométrico para:', email);

    // 🔍 Buscar usuario
    const [users] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = users[0];

    if (!user.current_challenge) {
      return res.status(400).json({ error: 'No hay login pendiente' });
    }

    // 🔐 Verificar respuesta WebAuthn
    const verification = await verifyAuthenticationResponse({
      response: assertionResponse,
      expectedChallenge: user.current_challenge,
      expectedOrigin: process.env.NODE_ENV === 'production'
        ? 'https://nil-bakery-frontend.onrender.com'
        : 'http://localhost:5173',
      expectedRPID: process.env.NODE_ENV === 'production'
        ? 'nil-bakery.onrender.com'
        : 'localhost',
      authenticator: {
        credentialID: Buffer.from(user.credential_id, 'base64'),
        credentialPublicKey: Buffer.from(user.public_key, 'base64'),
        counter: 0,
      },
    });

    if (verification.verified) {

      console.log('✅ Login biométrico exitoso:', user.id);

      // 🔥 GENERAR TOKEN (LO QUE TE FALTA)
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      // ✅ RESPUESTA COMPLETA
      return res.json({
        success: true,
        message: 'Login biométrico exitoso 🔐',
        token,
        usuario: {
          id: user.id,
          email: user.email
        }
      });

    } else {
      return res.status(400).json({
        success: false,
        error: 'Verificación fallida'
      });
    }

  } catch (error) {
    console.error('Error en verifyLogin:', error);
    res.status(500).json({
      error: 'Error en login biométrico'
    });
  }
};

// 👉 REGISTRO - OPCIONES
export const registerOptions = async (req, res) => {

  try {

    const options = await getRegistrationOptions(mockUser);

    // guardamos challenge temporal
    saveChallenge(mockUser.id, options.challenge);

    console.log("Challenge Registro:", options.challenge);

    res.json(options);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Error generating registration options" });

  }

};

// 👉 LOGIN - OPCIONES
export const loginOptions = async (req, res) => {
  try {
    const { email } = req.body;

    const options = await getAuthenticationOptions();

    // 🔍 Buscar usuario real
    const [users] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = users[0];

    // 💾 Guardar challenge en BD
    await pool.query(
      'UPDATE usuarios SET current_challenge = ? WHERE id = ?',
      [options.challenge, user.id]
    );

    console.log("Challenge Login:", options.challenge);

    res.json(options);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generating login options" });
  }
};

// ============================================
// NUEVA FUNCIÓN: Verificar y completar registro
// ============================================
import { verifyRegistrationResponse } from '@simplewebauthn/server';

const verifyRegistration = async (req, res) => {
  try {
    // 1. Recibir datos del frontend
    const { email, attestationResponse } = req.body;
    
    console.log('Verificando registro biométrico para:', email);

    // 2. Buscar usuario en BD
    const [users] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ?', 
      [email]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    const user = users[0];

    // 3. Verificar que tenga un challenge pendiente
    if (!user.current_challenge) {
      return res.status(400).json({ 
        error: 'No hay registro biométrico pendiente' 
      });
    }

    // 4. VERIFICAR la respuesta del dispositivo
    const verification = await verifyRegistrationResponse({
      response: attestationResponse,
      expectedChallenge: user.current_challenge,
      expectedOrigin: process.env.NODE_ENV === 'production'
        ? 'https://nil-bakery-frontend.onrender.com'
        : 'http://localhost:5173',
      expectedRPID: process.env.NODE_ENV === 'production'
        ? 'nil-bakery.onrender.com'
        : 'localhost',
    });

    // 5. Si la verificación fue exitosa
    if (verification.verified) {
      // Guardar la credencial en la BD
      const { credentialID, credentialPublicKey } = verification.registrationInfo;
      
      await pool.query(
        `UPDATE usuarios 
         SET credential_id = ?, 
             public_key = ?, 
             current_challenge = NULL 
         WHERE id = ?`,
        [credentialID.toString('base64'), credentialPublicKey.toString('base64'), user.id]
      );
      
      console.log('✅ Usuario registrado con biometría:', user.id);
      
      res.json({ 
        verified: true,
        message: '✅ Dispositivo registrado exitosamente' 
      });
    } else {
      // Si la verificación falla
      res.status(400).json({ 
        verified: false,
        error: 'Verificación fallida' 
      });
    }

  } catch (error) {
    console.error('Error en verifyRegistration:', error);
    res.status(500).json({ 
      error: 'Error al verificar registro biométrico' 
    });
  }
};

export { 
  registerOptions, 
  loginOptions, 
  verifyRegistration
};