'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { Progress } from '@/components/ui/progress';
import { Award, Star, CheckCircle, Lock } from 'lucide-react';
import { achievementsList, Achievement } from '@/lib/achievements';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"


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
  
  const unlockedAchievements = new Set(user.achievements || []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl">Progreso y Logros</h1>
        <p className="text-muted-foreground">¡Sigue así! Mira cuánto has avanzado y qué puedes hacer para seguir mejorando.</p>
      </div>
      
      <Card className="bg-gradient-to-br from-primary/80 to-accent">
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
            <CardTitle>Logros Desbloqueados</CardTitle>
            <CardDescription>Completa hitos para ganar insignias y XP extra.</CardDescription>
          </CardHeader>
          <CardContent>
            <TooltipProvider>
              <div className="grid grid-cols-4 gap-4 md:grid-cols-5 lg:grid-cols-6">
                {achievementsList.map((ach) => {
                  const isUnlocked = unlockedAchievements.has(ach.id);
                  const Icon = ach.icon;
                  return (
                    <Tooltip key={ach.id}>
                      <TooltipTrigger>
                        <div
                          className={cn(
                            "flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 p-2 text-center",
                            isUnlocked
                              ? "border-primary/50 bg-primary/10 text-primary"
                              : "border-dashed bg-muted/50 text-muted-foreground"
                          )}
                        >
                          <Icon className="h-8 w-8" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-bold">{ach.name}</p>
                        <p className="text-sm text-muted-foreground">{ach.description}</p>
                         {!isUnlocked && <p className="text-xs text-primary">¡Bloqueado!</p>}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </TooltipProvider>
          </CardContent>
        </Card>

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
      </div>
    </div>
  );
}
