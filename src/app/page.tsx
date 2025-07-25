
import Link from 'next/link';
import { LumenAILogo } from '@/components/icons/LumenAILogo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpenCheck, BotMessageSquare, Lightbulb, Presentation, PenSquare, Languages } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const features = [
  { icon: BookOpenCheck, title: 'Asistente de Tareas', description: 'Soluciones paso a paso para cualquier problema académico.' },
  { icon: Lightbulb, title: 'Explicador de Conceptos', description: 'Entiende temas complejos con explicaciones sencillas.' },
  { icon: PenSquare, title: 'Corrector de Ensayos', description: 'Mejora tu escritura con correcciones de estilo y gramática.' },
  { icon: Presentation, title: 'Creador de Exposiciones', description: 'Genera contenido de calidad para tus diapositivas al instante.' },
  { icon: BotMessageSquare, title: 'Chat con IA', description: 'Tu tutor personal disponible 24/7 para responder tus preguntas.' },
  { icon: Languages, title: 'Traductor Educativo', description: 'Traduce textos académicos con precisión y contexto.' },
];

const testimonials = [
  {
    name: 'Ana García',
    role: 'Estudiante de Bachillerato',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    text: 'LumenAI ha cambiado mi forma de estudiar. El Explicador de Conceptos me salvó en mi examen de física. ¡Totalmente recomendado!',
  },
  {
    name: 'Carlos Rodríguez',
    role: 'Estudiante Universitario',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704e',
    text: 'Como estudiante de ingeniería, la Calculadora Científica Explicada es una joya. No solo me da el resultado, sino que me enseña el proceso.',
  },
  {
    name: 'Sofía Martínez',
    role: 'Estudiante de Máster',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704f',
    text: 'El Planificador de Proyectos me ayudó a estructurar mi TFM de una manera increíblemente organizada. Ahorré semanas de trabajo.',
  },
];

const faqs = [
  {
    question: '¿Qué es LumenAI?',
    answer: 'LumenAI es una plataforma educativa todo en uno que utiliza inteligencia artificial para ofrecerte herramientas que potencian tu aprendizaje. Desde resolver problemas complejos hasta organizar tus proyectos, LumenAI es tu asistente académico personal.',
  },
  {
    question: '¿Es LumenAI gratuito?',
    answer: 'Actualmente, LumenAI se encuentra en una fase beta y es completamente gratuito. Queremos que la mayor cantidad de estudiantes prueben nuestras herramientas y nos den su feedback para seguir mejorando.',
  },
  {
    question: '¿Cómo protege LumenAI mi información?',
    answer: 'Tu privacidad es nuestra máxima prioridad. Todas las interacciones se gestionan de forma segura y tus datos de usuario se almacenan localmente en tu navegador, lo que significa que solo tú tienes acceso a ellos.',
  },
   {
    question: '¿En qué se diferencia LumenAI de otros chatbots de IA?',
    answer: 'A diferencia de los chatbots genéricos, LumenAI es un ecosistema de herramientas especializadas y diseñadas específicamente para el ámbito educativo. Cada función está pensada para resolver una necesidad concreta del estudiante, desde la escritura de un ensayo hasta la preparación de un examen.',
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="#" className="mr-6 flex items-center space-x-2">
            <LumenAILogo className="h-8 w-8" />
            <span className="font-bold sm:inline-block font-headline text-2xl">LumenAI</span>
          </Link>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-1">
              <Link href="/login">
                <Button variant="ghost">Iniciar Sesión</Button>
              </Link>
              <Link href="/register">
                <Button>Registrarse</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container grid items-center gap-6 pb-8 pt-6 text-center md:py-24">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-4">
             <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium">
                ✨ ¡Tu Futuro Académico Empieza Aquí!
            </div>
            <h1 className="font-headline text-4xl font-extrabold tracking-tighter md:text-6xl lg:text-7xl">
              Potencia tu aprendizaje con <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Inteligencia Artificial</span>
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              LumenAI es tu asistente educativo todo en uno. Desde resolver problemas complejos hasta preparar exposiciones, tenemos las herramientas que necesitas para brillar.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <Link href="/register">
                <Button size="lg">Comenzar Gratis</Button>
            </Link>
            <Link href="#features">
                <Button size="lg" variant="outline">Ver Herramientas</Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container space-y-8 py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <h2 className="font-headline text-3xl font-bold md:text-4xl">Un Ecosistema de Herramientas Inteligentes</h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Todo lo que necesitas para tus estudios, en un solo lugar. Diseñado por y para estudiantes.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="flex flex-col items-center p-6 text-center transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-headline text-xl font-semibold">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-muted/50 py-12 md:py-24 lg:py-32">
            <div className="container">
                <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
                    <h2 className="font-headline text-3xl font-bold md:text-4xl">Lo que dicen nuestros usuarios</h2>
                    <p className="mt-4 max-w-2xl text-muted-foreground">
                        Miles de estudiantes ya están transformando su manera de aprender con LumenAI.
                    </p>
                </div>
                <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
                    {testimonials.map((testimonial) => (
                        <Card key={testimonial.name}>
                            <CardContent className="pt-6">
                                <p className="italic">"{testimonial.text}"</p>
                            </CardContent>
                             <CardHeader className="flex-row items-center gap-4">
                                <Avatar>
                                    <AvatarImage src={testimonial.avatar} alt={testimonial.name}/>
                                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-base font-bold">{testimonial.name}</CardTitle>
                                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        {/* FAQ Section */}
        <section className="container py-12 md:py-24 lg:py-32">
            <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
                <h2 className="font-headline text-3xl font-bold md:text-4xl">Preguntas Frecuentes</h2>
                <p className="mt-4 max-w-2xl text-muted-foreground">
                    ¿Tienes dudas? Aquí resolvemos las más comunes.
                </p>
            </div>
            <div className="mx-auto mt-12 max-w-3xl">
                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className="text-left font-semibold">{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
           <div className="flex items-center gap-2">
                <LumenAILogo className="h-6 w-6" />
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    © {new Date().getFullYear()} LumenAI. Todos los derechos reservados.
                </p>
           </div>
           <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Link href="#" className="hover:text-primary">Términos de Servicio</Link>
                <Link href="#" className="hover:text-primary">Política de Privacidad</Link>
           </div>
        </div>
      </footer>
    </div>
  );
}

    