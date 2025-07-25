'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  SidebarGroup,
} from '@/components/ui/sidebar';
import {
  BookOpenCheck,
  Presentation,
  BotMessageSquare,
  Languages,
  LogOut,
  FileText,
  HelpCircle,
  Lightbulb,
  PenSquare,
  CalendarDays,
  ListTodo,
  TrendingUp,
  Calculator,
  Newspaper
} from 'lucide-react';
import { UserNav } from '@/components/layout/UserNav';
import { LumenAILogo } from '@/components/icons/LumenAILogo';

const menuItems = [
    { href: '/dashboard/task-assistant', label: 'Asistente de Tareas IA', icon: BookOpenCheck },
    { href: '/dashboard/text-summarizer', label: 'Resumidor Automático', icon: Newspaper },
    { href: '/dashboard/study-organizer', label: 'Organizador de Estudio', icon: CalendarDays },
    { href: '/dashboard/concept-explainer', label: 'Explicador de Conceptos', icon: Lightbulb },
    { href: '/dashboard/essay-corrector', label: 'Corrector de Ensayos', icon: PenSquare },
    { href: '/dashboard/presentation-creator', label: 'Creador de Exposiciones', icon: Presentation },
    { href: '/dashboard/chatbot', label: 'Chat Privado con IA', icon: BotMessageSquare },
    { href: '/dashboard/exam-creator', label: 'Creador de Exámenes', icon: HelpCircle },
    { href: '/dashboard/quiz-generator', label: 'Generador de Cuestionarios', icon: HelpCircle },
    { href: '/dashboard/translator', label: 'Traductor Educativo', icon: Languages },
    { href: '/dashboard/project-planner', label: 'Planificador de Proyectos', icon: ListTodo },
    { href: '/dashboard/scientific-calculator', label: 'Calculadora Científica Explicada', icon: Calculator },
    { href: '/dashboard/progress-achievements', label: 'Progreso y Logros', icon: TrendingUp },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);
  
  useEffect(() => {
    setIsNavigating(false);
  }, [pathname]);

  if (loading || !user) {
    return (
        <div className="flex h-screen w-screen items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
                <p className="text-muted-foreground">Cargando panel de control...</p>
            </div>
      </div>
    );
  }
  
  const handleNavigation = (href: string) => {
    if (pathname !== href) {
        setIsNavigating(true);
    }
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <LumenAILogo className="size-8" />
            <h1 className="font-headline text-2xl font-bold text-primary group-data-[collapsible=icon]:hidden">
              LumenAI
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
            <SidebarMenu>
                {menuItems.map((item) => 
                    <SidebarMenuItem key={item.href}>
                        <Link href={item.href} legacyBehavior passHref onClick={() => handleNavigation(item.href)}>
                            <SidebarMenuButton
                                asChild
                                isActive={pathname === item.href}
                                tooltip={{children: item.label}}
                            >
                                <a>
                                    <item.icon />
                                    <span>{item.label}</span>
                                </a>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                )}
            </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={logout} tooltip={{children: "Cerrar Sesión"}}>
                <LogOut />
                <span>Cerrar Sesión</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:justify-end">
            <SidebarTrigger className="sm:hidden" />
            <UserNav />
        </header>
        <main className="relative flex-1 overflow-auto p-4 md:p-6">
            {isNavigating && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
                    <p className="text-muted-foreground">Cargando herramienta...</p>
                </div>
              </div>
            )}
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
