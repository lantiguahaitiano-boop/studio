import { BookOpenCheck, BotMessageSquare, Calculator, HelpCircle, Languages, Lightbulb, ListTodo, PenSquare, Presentation, Newspaper } from "lucide-react";
import type { User } from '@/types/auth';

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  check: (user: User) => boolean;
};

export const achievementsList: Achievement[] = [
  {
    id: 'first-step',
    name: 'Primer Paso',
    description: 'Usa cualquier herramienta por primera vez.',
    icon: Lightbulb,
    check: (user) => (Object.keys(user.toolUsage || {}).length > 0),
  },
  {
    id: 'corrector-starter',
    name: 'Ensayo Pulido',
    description: 'Usa el Corrector de Ensayos 1 vez.',
    icon: PenSquare,
    check: (user) => (user.toolUsage?.['essay-corrector'] || 0) >= 1,
  },
  {
    id: 'summarizer-adept',
    name: 'Ratón de Biblioteca',
    description: 'Usa el Resumidor de Texto 5 veces.',
    icon: Newspaper,
    check: (user) => (user.toolUsage?.['text-summarizer'] || 0) >= 5,
  },
  {
    id: 'chatbot-friend',
    name: 'Amigo de la IA',
    description: 'Chatea con la IA 10 veces.',
    icon: BotMessageSquare,
    check: (user) => (user.toolUsage?.['chatbot'] || 0) >= 10,
  },
  {
    id: 'polyglot-novice',
    name: 'Políglota Principiante',
    description: 'Usa el Traductor 3 veces.',
    icon: Languages,
    check: (user) => (user.toolUsage?.['translator'] || 0) >= 3,
  },
  {
    id: 'presenter-pro',
    name: 'Orador Nato',
    description: 'Crea 3 presentaciones.',
    icon: Presentation,
    check: (user) => (user.toolUsage?.['presentation-creator'] || 0) >= 3,
  },
  {
    id: 'planner-extraordinaire',
    name: 'Planificador Experto',
    description: 'Planifica 2 proyectos de investigación.',
    icon: ListTodo,
    check: (user) => (user.toolUsage?.['project-planner'] || 0) >= 2,
  },
  {
    id: 'exam-master',
    name: 'Maestro de Exámenes',
    description: 'Crea 5 exámenes diferentes.',
    icon: HelpCircle,
    check: (user) => (user.toolUsage?.['exam-creator'] || 0) >= 5,
  },
   {
    id: 'math-wizard',
    name: 'Mago de las Mates',
    description: 'Usa la calculadora con explicación 5 veces.',
    icon: Calculator,
    check: (user) => (user.toolUsage?.['scientific-calculator'] || 0) >= 5,
  },
   {
    id: 'task-crusher',
    name: 'Triturador de Tareas',
    description: 'Resuelve 10 problemas con el asistente.',
    icon: BookOpenCheck,
    check: (user) => (user.toolUsage?.['task-assistant'] || 0) >= 10,
  },
];

export function checkAchievements(user: User): string[] {
  const newlyUnlocked: string[] = [];
  const currentAchievements = new Set(user.achievements || []);

  achievementsList.forEach(achievement => {
    if (!currentAchievements.has(achievement.id)) {
      if (achievement.check(user)) {
        newlyUnlocked.push(achievement.id);
      }
    }
  });

  return newlyUnlocked;
}
