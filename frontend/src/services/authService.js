const API = "https://nil-bakery.onrender.com/api/auth";

export const registerUser = async (userData) => {
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error register");

  return data;
};

export const loginUser = async (userData) => {
  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Error login");

  return data;
};

export const getUsers = async () => {
  const res = await fetch(`${API}/users`);
  return res.json();
};