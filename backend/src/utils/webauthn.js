import { randomBytes } from 'crypto';
import base64url from 'base64url';
import { saveChallenge, getChallenge } from './challengeStore.js';

// 🔹 REGISTRO
export function getRegistrationOptions(user) {
    const challenge = base64url(randomBytes(32));

    saveChallenge(user.id, challenge);

    return {
        challenge,
        rp: {
            name: 'NIL Bakery',
            id: 'nil-bakery-1.onrender.com/',
        },
        user: {
            id: base64url(Buffer.from(user.id.toString())),
            name: user.email,
            displayName: user.name,
        },
        pubKeyCredParams: [
            { type: 'public-key', alg: -7 },
            { type: 'public-key', alg: -257 }
        ],
        authenticatorSelection: {
            userVerification: 'required',
        },
        timeout: 60000,
        attestation: 'none',
    };
}

// 🔹 LOGIN
export function getAuthenticationOptions(user) {
    const challenge = base64url(randomBytes(32));

    saveChallenge(user.id, challenge);

    return {
        challenge,
        timeout: 60000,
        allowCredentials: user.credentials?.map(cred => ({
            id: cred.credentialID,
            type: 'public-key',
        })) || [],
        userVerification: 'required',
    };
}

// 🔹 Obtener challenge
export function getStoredChallenge(userId) {
    return getChallenge(userId);
}