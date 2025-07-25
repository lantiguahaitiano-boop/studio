'use client'
import { useAuth } from "@/hooks/use-auth";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { BookOpenCheck, Presentation, BotMessageSquare, Languages, Newspaper, Lightbulb, PenSquare, HelpCircle, ListTodo, Calculator, TrendingUp, CalendarDays, MessageCircleQuestion } from "lucide-react";

const tools = [
    { href: '/dashboard/task-assistant', title: 'Asistente de Tareas IA', description: 'Ayuda paso a paso con problemas.', icon: BookOpenCheck },
    { href: '/dashboard/text-summarizer', title: 'Resumen de Texto', description: 'Genera resúmenes concisos.', icon: Newspaper },
    { href: '/dashboard/study-organizer', title: 'Organizador de Estudio', description: 'Crea y gestiona tus horarios.', icon: CalendarDays },
    { href: '/dashboard/concept-explainer', title: 'Explicador de Conceptos', description: 'Simplifica temas complejos.', icon: Lightbulb },
    { href: '/dashboard/essay-corrector', title: 'Corrector de Ensayos', description: 'Revisa gramática y estilo.', icon: PenSquare },
    { href: '/dashboard/presentation-creator', title: 'Creador de Exposiciones', description: 'Genera contenido para diapositivas.', icon: Presentation },
    { href: '/dashboard/chatbot', title: 'Chat Privado con IA', description: 'Responde preguntas académicas.', icon: BotMessageSquare },
    { href: '/dashboard/interactive-assistant', title: 'Asistente Interactivo', description: 'Chatea para obtener respuestas.', icon: MessageCircleQuestion },
    { href: '/dashboard/exam-creator', title: 'Creador de Exámenes', description: 'Crea exámenes personalizados.', icon: HelpCircle },
    { href: '/dashboard/quiz-generator', title: 'Generador de Cuestionarios', description: 'Crea preguntas desde un texto.', icon: HelpCircle },
    { href: '/dashboard/translator', title: 'Traductor Educativo', description: 'Traduce textos con contexto.', icon: Languages },
    { href: '/dashboard/project-planner', title: 'Planificador de Proyectos', description: 'Estructura trabajos de investigación.', icon: ListTodo },
    { href: '/dashboard/scientific-calculator', title: 'Calculadora Científica', description: 'Resuelve y explica operaciones.', icon: Calculator },
    { href: '/dashboard/progress-achievements', title: 'Progreso y Logros', description: 'Muestra tu avance y logros.', icon: TrendingUp },
]

export default function DashboardPage() {
    const { user } = useAuth();
    
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl">
                    Bienvenido de nuevo, {user?.name.split(' ')[0]}
                </h1>
                <p className="text-muted-foreground">Aquí tienes tus herramientas inteligentes. ¿Qué quieres hacer hoy?</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {tools.map((tool) => (
                    <Link href={tool.href} key={tool.href} className="flex">
                    <Card className="flex w-full flex-col justify-between transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/20">
                        <CardHeader>
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                <tool.icon className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle className="font-headline text-xl">{tool.title}</CardTitle>
                            <CardDescription>{tool.description}</CardDescription>
                        </CardHeader>
                    </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
