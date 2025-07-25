
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
      </main>

      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
           <div className="flex flex-col items-center gap-2 md:flex-row">
                <div className="flex items-center gap-2">
                    <LumenAILogo className="h-6 w-6" />
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} LumenAI. Todos los derechos reservados.
                    </p>
                </div>
                <p className="text-sm text-muted-foreground">
                    Hecho por Lantigua Productions.
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
