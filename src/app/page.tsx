
import Link from 'next/link';
import { SkillicoLogo } from '@/components/icons/SkillicoLogo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpenCheck, BotMessageSquare, Lightbulb, Presentation, PenSquare, Languages } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { AnimatedDiv } from '@/components/ui/animated-div';

const features = [
  { icon: BookOpenCheck, title: 'Asistente de Tareas', description: 'Soluciones paso a paso para cualquier problema académico.' },
  { icon: Lightbulb, title: 'Explicador de Conceptos', description: 'Entiende temas complejos con explicaciones sencillas.' },
  { icon: PenSquare, title: 'Corrector de Ensayos', description: 'Mejora tu escritura con correcciones de estilo y gramática.' },
  { icon: Presentation, title: 'Creador de Exposiciones', description: 'Genera contenido de calidad para tus diapositivas al instante.' },
  { icon: BotMessageSquare, title: 'Chat con IA', description: 'Tu tutor personal disponible 24/7 para responder tus preguntas.' },
  { icon: Languages, title: 'Traductor Educativo', description: 'Traduce textos académicos con precisión y contexto.' },
];

export default function LandingPage() {
  return (
    <AnimatedDiv className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="#" className="mr-6 flex items-center space-x-2">
            <SkillicoLogo className="h-8 w-8" />
            <div className="flex items-center gap-2">
                <span className="font-bold sm:inline-block font-headline text-2xl">Skillico</span>
                <Badge variant="secondary">BETA</Badge>
            </div>
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
            <AnimatedDiv 
                className="mx-auto flex max-w-4xl flex-col items-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
             <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium animate-fade-in">
                ✨ ¡Tu Futuro Académico Empieza Aquí!
            </div>
            <h1 className="font-headline text-4xl font-extrabold tracking-tighter md:text-6xl lg:text-7xl animate-slide-up">
              Potencia tu aprendizaje con <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Inteligencia Artificial</span>
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground animate-slide-up animation-delay-200">
              Skillico es tu asistente educativo todo en uno. Desde resolver problemas complejos hasta preparar exposiciones, tenemos las herramientas que necesitas para brillar.
            </p>
          </AnimatedDiv>
          <AnimatedDiv 
            className="flex justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            >
            <Link href="/register">
                <Button size="lg">Comenzar Gratis</Button>
            </Link>
            <Link href="#features">
                <Button size="lg" variant="outline">Ver Herramientas</Button>
            </Link>
          </AnimatedDiv>
        </section>

        {/* Features Section */}
        <section id="features" className="container space-y-8 py-12 md:py-24 lg:py-32">
          <AnimatedDiv className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <h2 className="font-headline text-3xl font-bold md:text-4xl">Un Ecosistema de Herramientas Inteligentes</h2>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Todo lo que necesitas para tus estudios, en un solo lugar. Diseñado por y para estudiantes.
            </p>
          </AnimatedDiv>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <AnimatedDiv 
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
                viewport={{ once: true }}
              >
              <Card className="flex h-full flex-col items-center p-6 text-center transition-all hover:scale-105 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-headline text-xl font-semibold">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground">{feature.description}</p>
              </Card>
              </AnimatedDiv>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
           <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-center md:justify-start">
                <div className="flex items-center gap-2">
                    <SkillicoLogo className="h-6 w-6" />
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Skillico. Todos los derechos reservados.
                    </p>
                </div>
                <p className="text-sm text-muted-foreground">
                    Hecho por Lantigua company
                </p>
           </div>
           <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Link href="/terms" className="hover:text-primary">Términos de Servicio</Link>
                <Link href="/privacy" className="hover:text-primary">Política de Privacidad</Link>
           </div>
        </div>
      </footer>
    </AnimatedDiv>
  );
}
