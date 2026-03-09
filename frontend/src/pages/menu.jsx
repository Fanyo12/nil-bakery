import { useState } from 'react';
import '../styles/menu.css';

const productos = [
  {
    id: 1, categoria: 'panes',
    nombre: 'Pan Artesanal de Centeno',
    desc: 'Fermentación lenta de 24h, corteza crujiente y miga suave.',
    precio: 85, img: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 2, categoria: 'panes',
    nombre: 'Baguette Francesa',
    desc: 'Clásica baguette con harina importada y masa madre.',
    precio: 45, img: 'https://images.unsplash.com/photo-1568471173242-461f0a730452?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 3, categoria: 'postres',
    nombre: 'Croissant de Mantequilla',
    desc: 'Hojaldrado con mantequilla francesa, dorado perfecto.',
    precio: 55, img: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 4, categoria: 'postres',
    nombre: 'Tarta de Manzana',
    desc: 'Manzanas caramelizadas sobre base de mantequilla casera.',
    precio: 120, img: 'https://images.unsplash.com/photo-1567171466295-4afa63d45416?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 5, categoria: 'bebidas',
    nombre: 'Café de Especialidad',
    desc: 'Granos de origen único, extracción en V60.',
    precio: 65, img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 6, categoria: 'postres',
    nombre: 'Brownie de Chocolate',
    desc: 'Chocolate belga 70%, húmedo por dentro y crujiente por fuera.',
    precio: 75, img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 7, categoria: 'panes',
    nombre: 'Pan de Nuez y Miel',
    desc: 'Nueces tostadas y miel de abeja local en cada rebanada.',
    precio: 95, img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 8, categoria: 'bebidas',
    nombre: 'Chocolate Caliente',
    desc: 'Cacao puro con leche entera y una pizca de canela.',
    precio: 60, img: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?q=80&w=600&auto=format&fit=crop'
  },
];

const categorias = ['todos', 'panes', 'postres', 'bebidas'];

export default function Menu({ agregarAlCarrito }) {
  const [categoriaActiva, setCategoriaActiva] = useState('todos');

  const productosFiltrados = categoriaActiva === 'todos'
    ? productos
    : productos.filter(p => p.categoria === categoriaActiva);

  return (
    <div>
      {/* Hero */}
      <div className="menu-hero">
        <div className="menu-hero__tag">Nil Bakery</div>
        <h1 className="menu-hero__title">Nuestro Menú</h1>
      </div>

      {/* Contenido */}
      <div className="menu-section">
        <h2 className="menu-section__title">Elaborado con amor cada día</h2>
        <hr className="menu-section__divider" />

        {/* Filtros */}
        <div className="menu-categories">
          {categorias.map(cat => (
            <button
              key={cat}
              className={`menu-cat-btn ${categoriaActiva === cat ? 'active' : ''}`}
              onClick={() => setCategoriaActiva(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Grid de productos */}
        <div className="menu-grid">
          {productosFiltrados.map(producto => (
            <div className="menu-card" key={producto.id}>
              <img className="menu-card__img" src={producto.img} alt={producto.nombre} />
              <div className="menu-card__body">
                <h3 className="menu-card__name">{producto.nombre}</h3>
                <p className="menu-card__desc">{producto.desc}</p>
                <div className="menu-card__footer">
                  <span className="menu-card__price">${producto.precio}</span>
                  <button
                    className="menu-card__btn"
                    onClick={() => agregarAlCarrito && agregarAlCarrito(producto)}
                  >
                    + Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}