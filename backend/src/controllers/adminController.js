import pool from '../config/db.js';

// ── PEDIDOS ──────────────────────────────
export const getAllPedidos = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.id, p.total, p.estado, p.created_at AS fecha,
             u.nombre AS cliente, u.email
      FROM pedidos p
      JOIN usuarios u ON p.usuario_id = u.id
      ORDER BY p.created_at DESC
    `);

    // Aseguramos que 'total' sea numérico para evitar problemas en el reduce de React
    const dataFormatted = rows.map(p => ({
      ...p,
      total: parseFloat(p.total) || 0
    }));

    res.json({ data: dataFormatted });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener pedidos',
      error: error.message
    });
  }
};

export const updatePedidoEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    await pool.query(
      'UPDATE pedidos SET estado = ? WHERE id = ?',
      [estado, id]
    );

    res.json({ message: 'Estado del pedido actualizado correctamente' });
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar el estado del pedido',
      error: error.message
    });
  }
};

// ── USUARIOS ──────────────────────────────
export const getAllUsuarios = async (req, res) => {
  try {
    // ✅ CORRECCIÓN: Agregamos LEFT JOIN y COUNT para obtener total_pedidos
    const [rows] = await pool.query(`
      SELECT 
        u.id, 
        u.nombre, 
        u.email, 
        u.rol,
        u.created_at,
        COUNT(p.id) AS total_pedidos
      FROM usuarios u
      LEFT JOIN pedidos p ON u.id = p.usuario_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);

    res.json({ data: rows });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
};