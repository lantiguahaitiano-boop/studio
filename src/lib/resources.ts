import { Book, Youtube, Newspaper, Film } from 'lucide-react';

export type Resource = {
  id: string;
  title: string;
  description: string;
  type: 'Libro' | 'Artículo' | 'Video' | 'Curso';
  category: 'Ciencia' | 'Matemáticas' | 'Historia' | 'Programación' | 'Arte';
  educationLevel: 'Bachillerato' | 'Universidad (Grado)' | 'Universidad (Postgrado)' | 'Todos';
  url: string;
  imageUrl: string;
  icon: React.ElementType;
};

export const resourcesData: Resource[] = [
  {
    id: 'prog-101',
    title: 'Eloquent JavaScript',
    description: 'Una guía moderna para aprender a programar en JavaScript.',
    type: 'Libro',
    category: 'Programación',
    educationLevel: 'Todos',
    url: 'https://eloquentjavascript.net/',
    imageUrl: 'https://placehold.co/600x400.png',
    icon: Book,
  },
  {
    id: 'math-101',
    title: 'Khan Academy: Cálculo',
    description: 'Curso completo de cálculo, desde límites hasta integrales.',
    type: 'Curso',
    category: 'Matemáticas',
    educationLevel: 'Universidad (Grado)',
    url: 'https://www.khanacademy.org/math/calculus-1',
    imageUrl: 'https://placehold.co/600x400.png',
    icon: Youtube,
  },
  {
    id: 'hist-101',
    title: 'Crash Course World History',
    description: 'Videos cortos y entretenidos que cubren la historia mundial.',
    type: 'Video',
    category: 'Historia',
    educationLevel: 'Bachillerato',
    url: 'https://www.youtube.com/playlist?list=PLBDA2E52FB1EF80C9',
    imageUrl: 'https://placehold.co/600x400.png',
    icon: Film,
  },
  {
    id: 'science-101',
    title: 'Nature: International Journal of Science',
    description: 'Acceso a los últimos artículos y descubrimientos científicos.',
    type: 'Artículo',
    category: 'Ciencia',
    educationLevel: 'Universidad (Postgrado)',
    url: 'https://www.nature.com/',
    imageUrl: 'https://placehold.co/600x400.png',
    icon: Newspaper,
  },
  {
    id: 'art-101',
    title: 'Google Arts & Culture',
    description: 'Explora colecciones de arte y artefactos de museos de todo el mundo.',
    type: 'Curso',
    category: 'Arte',
    educationLevel: 'Todos',
    url: 'https://artsandculture.google.com/',
    imageUrl: 'https://placehold.co/600x400.png',
    icon: Youtube,
  },
  {
    id: 'prog-102',
    title: 'freeCodeCamp',
    description: 'Aprende a programar gratis. Construye proyectos. Obtén certificaciones.',
    type: 'Curso',
    category: 'Programación',
    educationLevel: 'Todos',
    url: 'https://www.freecodecamp.org/',
    imageUrl: 'https://placehold.co/600x400.png',
    icon: Youtube,
  },
  {
    id: 'math-102',
    title: '3Blue1Brown',
    description: 'Explicaciones matemáticas visuales e intuitivas.',
    type: 'Video',
    category: 'Matemáticas',
    educationLevel: 'Todos',
    url: 'https://www.youtube.com/c/3blue1brown',
    imageUrl: 'https://placehold.co/600x400.png',
    icon: Film,
  },
  {
    id: 'hist-102',
    title: 'Historia National Geographic',
    description: 'Artículos detallados sobre eventos y personajes históricos.',
    type: 'Artículo',
    category: 'Historia',
    educationLevel: 'Bachillerato',
    url: 'https://historia.nationalgeographic.com.es/',
    imageUrl: 'https://placehold.co/600x400.png',
    icon: Newspaper,
  },
];
