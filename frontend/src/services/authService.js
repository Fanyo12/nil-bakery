const API_URL = 'https://nil-bakery.onrender.com/api';  

// Login
export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials)
  });
  
  if (!response.ok) {
    throw new Error('Error en el login');
  }
  
  return response.json();
};

// Register - ¡NECESITAS ESTA!
export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData)
  });
  
  if (!response.ok) {
    throw new Error('Error en el registro');
  }
  
  return response.json();
};