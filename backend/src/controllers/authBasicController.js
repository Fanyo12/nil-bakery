import User from '../models/User.js';

// REGISTRO
export const register = async (req, res) => {
  try {

    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const usuarioExistente = await User.buscarPorEmail(email);

    if (usuarioExistente) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    await User.crearUsuario(nombre, email, password);

    res.status(201).json({ message: "Usuario registrado correctamente" });

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });

  }
};

// LOGIN
export const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña requeridos" });
    }

    const usuario = await User.buscarPorEmail(email);

    if (!usuario) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    if (usuario.password !== password) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    res.status(200).json({
      message: "Login exitoso",
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });

  }
};

// LISTAR USUARIOS
export const getUsers = async (req, res) => {
  try {

    const usuarios = await User.obtenerUsuarios();
    res.status(200).json(usuarios);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });

  }
};