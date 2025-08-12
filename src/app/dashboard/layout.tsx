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
  Newspaper,
  MessageCircleQuestion,
  Settings,
  Library,
  BrainCircuit,
  FlaskConical,
  Shield,
} from 'lucide-react';
import { UserNav } from '@/components/layout/UserNav';
import { LearnProLogo } from '@/components/icons/LearnProLogo';
import { Badge } from '@/components/ui/badge';
import { AnimatePresence, motion } from 'framer-motion';
import { useLoading } from '@/hooks/use-loading';

const menuItems = [
    { href: '/dashboard/task-assistant', label: 'Asistente de Tareas IA', icon: BookOpenCheck },
    { href: '/dashboard/text-summarizer', label: 'Resumidor Automático', icon: Newspaper },
    { href: '/dashboard/study-organizer', label: 'Organizador de Estudio', icon: CalendarDays },
    { href: '/dashboard/concept-explainer', label: 'Explicador de Conceptos', icon: Lightbulb },
    { href: '/dashboard/essay-corrector', label: 'Corrector de Ensayos', icon: PenSquare },
    { href: '/dashboard/presentation-creator', label: 'Creador de Exposiciones', icon: Presentation },
    { href: '/dashboard/chatbot', label: 'Chat Privado con IA', icon: BotMessageSquare },
    { href: '/dashboard/interactive-assistant', label: 'Asistente Interactivo de Preguntas', icon: MessageCircleQuestion },
    { href: '/dashboard/exam-creator', label: 'Creador de Exámenes', icon: HelpCircle },
    { href: '/dashboard/quiz-generator', label: 'Generador de Cuestionarios', icon: HelpCircle },
    { href: '/dashboard/translator', label: 'Traductor Educativo', icon: Languages },
    { href: '/dashboard/project-planner', label: 'Planificador de Proyectos', icon: ListTodo },
    { href: '/dashboard/library', label: 'Biblioteca de Recursos', icon: Library },
    { href: '/dashboard/scientific-calculator', label: 'Calculadora Científica Explicada', icon: Calculator },
    { href: '/dashboard/mind-map-tool', label: 'Herramienta de Mapas Mentales', icon: BrainCircuit },
    { href: '/dashboard/virtual-lab', label: 'Laboratorio Virtual', icon: FlaskConical },
    { href: '/dashboard/progress-achievements', label: 'Progreso y Logros', icon: TrendingUp },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const { setIsLoading } = useLoading();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
    }
  }, [user, loading, router]);
  
  const handleLogout = () => {
    if(logout) {
      logout();
    }
  }

  if (loading || !user) {
    // This now shows the global loading screen handled by the provider
    return null;
  }

  const handleNavigation = (e: React.MouseEvent<HTMLButtonElement>, href: string) => {
    e.preventDefault();
    if (pathname !== href) {
        if(setIsLoading) setIsLoading(true);
        router.push(href);
    }
  }
  
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/dashboard" className="flex items-center gap-2" onClick={(e) => { e.preventDefault(); if (pathname !== '/dashboard') { setIsLoading?.(true); router.push('/dashboard');}}}>
            <LearnProLogo className="size-8" />
            <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
                <h1 className="font-headline text-2xl font-bold text-primary">
                LearnPro
                </h1>
                <Badge variant="secondary" className="text-xs">BETA</Badge>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarContent>
            <SidebarMenu>
                {menuItems.map((item) => 
                    <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                            onClick={(e) => handleNavigation(e, item.href)}
                            href={item.href}
                            isActive={pathname === item.href}
                            tooltip={{children: item.label}}
                        >
                            <item.icon />
                            <span>{item.label}</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                )}
            </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    onClick={(e) => handleNavigation(e, '/dashboard/settings')}
                    href="/dashboard/settings"
                    isActive={pathname === '/dashboard/settings'}
                    tooltip={{children: "Configuración"}}
                    className="text-blue-500 hover:bg-blue-500/10 hover:text-blue-500 data-[active=true]:bg-blue-500/10 data-[active=true]:text-blue-500"
                >
                    <Settings />
                    <span>Configuración</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                tooltip={{ children: 'Cerrar Sesión' }}
                className="text-red-500 hover:bg-red-500/10 hover:text-red-500 data-[active=true]:bg-red-500/10 data-[active=true]:text-red-500"
              >
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
            <AnimatePresence mode="wait">
                 <motion.div
                    key={pathname}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.2 }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
