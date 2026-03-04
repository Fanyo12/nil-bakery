import pool from '../config/db.js';

// Obtener todos los productos
export const getProducts = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM productos ORDER BY created_at DESC');
    res.json({ 
      message: 'Productos obtenidos', 
      data: rows 
    });
  } catch (error) {
    console.error('Error en getProducts:', error);
    res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
};

// Obtener un producto por ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    res.json({ 
      message: 'Producto encontrado', 
      data: rows[0] 
    });
  } catch (error) {
    console.error('Error en getProductById:', error);
    res.status(500).json({ message: 'Error al obtener producto', error: error.message });
  }
};

// Crear un producto (admin)
export const createProduct = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock } = req.body;
    
    // Validar campos obligatorios
    if (!nombre || !precio) {
      return res.status(400).json({ message: 'Nombre y precio son obligatorios' });
    }
    
    const [result] = await pool.query(
      'INSERT INTO productos (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)',
      [nombre, descripcion || '', precio, stock || 0]
    );
    
    const [newProduct] = await pool.query('SELECT * FROM productos WHERE id = ?', [result.insertId]);
    
    res.status(201).json({ 
      message: 'Producto creado exitosamente', 
      data: newProduct[0] 
    });
  } catch (error) {
    console.error('Error en createProduct:', error);
    res.status(500).json({ message: 'Error al crear producto', error: error.message });
  }
};

// Actualizar un producto (admin)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock } = req.body;
    
    const [result] = await pool.query(
      'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ? WHERE id = ?',
      [nombre, descripcion, precio, stock, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    const [updatedProduct] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
    
    res.json({ 
      message: 'Producto actualizado', 
      data: updatedProduct[0] 
    });
  } catch (error) {
    console.error('Error en updateProduct:', error);
    res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
  }
};

// Eliminar un producto (admin)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.query('DELETE FROM productos WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    console.error('Error en deleteProduct:', error);
    res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
  }
};