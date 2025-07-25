'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { Progress } from '@/components/ui/progress';
import { Award, Star, CheckCircle } from 'lucide-react';

const tasks = [
    { description: 'Usa el Asistente de Tareas para resolver un problema.', xp: 10 },
    { description: 'Genera un resumen de un texto largo.', xp: 10 },
    { description: 'Simplifica un concepto complejo.', xp: 10 },
    { description: 'Corrige un ensayo o texto.', xp: 10 },
    { description: 'Crea el contenido para una exposición.', xp: 10 },
    { description: 'Haz una pregunta a nuestro tutor IA.', xp: 10 },
    { description: 'Genera un examen sobre cualquier tema.', xp: 10 },
    { description: 'Crea un cuestionario a partir de un texto.', xp: 10 },
    { description: 'Traduce un texto académico.', xp: 10 },
    { description: 'Planifica la estructura de un proyecto.', xp: 10 },
    { description: 'Resuelve y explica una operación matemática.', xp: 10 },
];

export default function ProgressAchievementsPage() {
  const { user } = useAuth();
  
  if (!user) return null;

  const level = user.level || 1;
  const xp = user.xp || 0;
  const xpToNextLevel = level * 100;
  const progressPercentage = (xp / xpToNextLevel) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl">Progreso y Logros</h1>
        <p className="text-muted-foreground">¡Sigue así! Mira cuánto has avanzado y qué puedes hacer para seguir mejorando.</p>
      </div>
      
      <Card className="bg-gradient-to-br from-primary/80 to-primary">
          <CardHeader className="flex flex-row items-center justify-between text-primary-foreground">
              <div className="space-y-1">
                  <CardTitle className="font-headline text-3xl">Nivel {level}</CardTitle>
                  <CardDescription className="text-primary-foreground/80">{user.name}</CardDescription>
              </div>
              <div className="rounded-full bg-primary-foreground/20 p-4">
                <Award className="h-8 w-8 text-primary-foreground" />
              </div>
          </CardHeader>
          <CardContent>
              <div className="space-y-2 text-primary-foreground">
                  <p className="text-sm">Progreso de Experiencia (XP)</p>
                  <Progress value={progressPercentage} className="h-3 bg-primary-foreground/20" />
                  <p className="text-right text-sm font-medium">{xp} / {xpToNextLevel} XP</p>
              </div>
          </CardContent>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tareas para ganar XP</CardTitle>
            <CardDescription>Completa estas tareas para subir de nivel.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
                {tasks.map((task, index) => (
                    <li key={index} className="flex items-start gap-4">
                        <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                            <Star className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <p className="font-medium">{task.description}</p>
                            <p className="text-sm text-primary">+{task.xp} XP</p>
                        </div>
                    </li>
                ))}
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Logros Desbloqueados</CardTitle>
            <CardDescription>Próximamente: ¡Colecciona insignias únicas por tus hitos!</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center text-center">
            <div className="flex h-48 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 p-8">
                <Award className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 font-semibold">Sistema de Logros en desarrollo</h3>
                <p className="mt-1 text-sm text-muted-foreground">Estamos creando insignias especiales para recompensar tu esfuerzo.</p>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
