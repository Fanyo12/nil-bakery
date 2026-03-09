import { Link } from 'react-router-dom';
import '../styles/historia.css';

const timeline = [
  {
    year: '2018',
    title: 'El Inicio',
    text: 'Nil Bakery nació en una pequeña cocina familiar con una sola receta de pan de masa madre y el sueño de compartir el verdadero sabor artesanal con nuestra comunidad.'
  },
  {
    year: '2019',
    title: 'Primer Local',
    text: 'Abrimos nuestras puertas en el corazón de la ciudad. La respuesta fue increíble — las filas llegaban a la calle desde el primer día.'
  },
  {
    year: '2021',
    title: 'Expansión del Menú',
    text: 'Incorporamos repostería fina, cafés de especialidad y temporadas especiales. Cada producto siguió siendo elaborado a mano, sin excepción.'
  },
  {
    year: '2023',
    title: 'Comunidad & Talleres',
    text: 'Lanzamos talleres de panadería para la comunidad. Más de 300 personas han aprendido el arte del pan artesanal con nosotros.'
  },
  {
    year: '2024',
    title: 'Nil Bakery en Línea',
    text: 'Para llevar nuestros productos a más hogares, lanzamos nuestra tienda en línea. El mismo amor de siempre, ahora a tu puerta.'
  },
];

const valores = [
  { icon: '🌾', title: 'Ingredientes Naturales', text: 'Solo usamos harinas sin aditivos, mantequillas reales y endulzantes naturales.' },
  { icon: '⏱️', title: 'Sin Prisa', text: 'Nuestras masas fermentan entre 12 y 48 horas. El tiempo es nuestro ingrediente secreto.' },
  { icon: '🤝', title: 'Comunidad Local', text: 'Compramos a productores locales y participamos activamente en nuestra comunidad.' },
  { icon: '💛', title: 'Hecho con Amor', text: 'Cada pieza pasa por nuestras manos. Nunca delegamos la calidad a una máquina.' },
];

export default function NuestraHistoria() {
  return (
    <div>
      {/* Hero */}
      <div className="historia-hero">
        <div className="historia-hero__tag">Nil Bakery</div>
        <h1 className="historia-hero__title">Nuestra Historia</h1>
      </div>

      <div className="historia-container">
        {/* Intro */}
        <div className="historia-intro">
          <h2 className="historia-intro__title">Más que una panadería</h2>
          <hr className="historia-intro__divider" />
          <p className="historia-intro__text">
            Somos una familia que encontró en el pan artesanal una forma de conectar personas.
            Cada hogaza, cada croissant, cada taza de café que sale de nuestra cocina
            lleva consigo horas de dedicación, ingredientes cuidadosamente seleccionados
            y el deseo genuino de hacerte el día un poco mejor.
          </p>
        </div>

        {/* Timeline */}
        <div className="historia-timeline">
          {timeline.map((item, i) => (
            <div className="historia-item" key={i}>
              <div className="historia-item__year">{item.year}</div>
              <h3 className="historia-item__title">{item.title}</h3>
              <p className="historia-item__text">{item.text}</p>
            </div>
          ))}
        </div>

        {/* Valores */}
        <div className="historia-valores">
          {valores.map((v, i) => (
            <div className="historia-valor" key={i}>
              <div className="historia-valor__icon">{v.icon}</div>
              <h4 className="historia-valor__title">{v.title}</h4>
              <p className="historia-valor__text">{v.text}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="historia-cta">
          <h3 className="historia-cta__title">¿Lista para probarnos?</h3>
          <p className="historia-cta__text">Descubre todos nuestros productos horneados hoy.</p>
          <Link to="/menu" className="historia-cta__btn">Ver Menú</Link>
        </div>
      </div>
    </div>
  );
}