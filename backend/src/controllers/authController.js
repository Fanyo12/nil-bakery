import { getRegistrationOptions, getAuthenticationOptions } from '../services/webauthn.service.js';
import { saveChallenge } from '../utils/challengeStore.js';

// MOCK USER (luego vendrá de MySQL)
const mockUser = {
  id: "user123",
  email: "test@nil.com"
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

    const options = await getAuthenticationOptions();

    saveChallenge(mockUser.id, options.challenge);

    console.log("Challenge Login:", options.challenge);

    res.json(options);

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Error generating login options" });

  }

};
