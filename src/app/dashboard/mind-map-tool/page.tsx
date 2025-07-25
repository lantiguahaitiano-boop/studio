'use client';

import { Card } from '@/components/ui/card';
import { Wrench } from 'lucide-react';

export default function MindMapToolPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl">Herramienta de Mapas Mentales</h1>
        <p className="text-muted-foreground">Organiza y visualiza información de manera efectiva.</p>
      </div>
      <Card className="flex min-h-[400px] flex-col items-center justify-center border-2 border-dashed">
        <div className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-muted p-3">
                <Wrench className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Herramienta en Mantenimiento</h2>
            <p className="text-muted-foreground">Estamos trabajando para mejorar el Generador de Mapas Mentales. ¡Vuelve pronto!</p>
        </div>
      </Card>
    </div>
  );
}
