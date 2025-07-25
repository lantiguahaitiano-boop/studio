'use client';

import { Card } from '@/components/ui/card';
import { Beaker, Wrench } from 'lucide-react';

export default function VirtualLabPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl">Laboratorio Virtual</h1>
        <p className="text-muted-foreground">Experimenta con simulaciones interactivas de ciencia.</p>
      </div>
      <Card className="flex min-h-[400px] flex-col items-center justify-center border-2 border-dashed">
        <div className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-muted p-3">
                <Wrench className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Función en Desarrollo</h2>
            <p className="text-muted-foreground">¡Muy pronto podrás realizar experimentos virtuales aquí! Estamos trabajando en ello.</p>
        </div>
      </Card>
    </div>
  );
}
