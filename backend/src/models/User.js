const db = require('../config/db');

class User {

    static async crearUsuario(nombre, email, password) {
        const query = `
            INSERT INTO usuarios (nombre, email, password)
            VALUES (?, ?, ?)
        `;
        const [result] = await db.execute(query, [nombre, email, password]);
        return result;
    }

    static async buscarPorEmail(email) {
        const query = `
            SELECT * FROM usuarios WHERE email = ?
        `;
        const [rows] = await db.execute(query, [email]);
        return rows[0];
    }

    static async obtenerUsuarios() {
        const query = `SELECT id, nombre, email FROM usuarios`;
        const [rows] = await db.execute(query);
        return rows;
    }
}

export default User;