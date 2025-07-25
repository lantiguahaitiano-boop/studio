'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench } from 'lucide-react';

export default function ScientificCalculatorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl">Calculadora Científica Explicada</h1>
        <p className="text-muted-foreground">Resuelve operaciones y entiende los resultados paso a paso.</p>
      </div>
      <Card className="flex min-h-[400px] flex-col items-center justify-center border-2 border-dashed">
        <div className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-muted p-3">
                <Wrench className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Herramienta en Construcción</h2>
            <p className="text-muted-foreground">Estamos trabajando para traerte la Calculadora Científica. ¡Vuelve pronto!</p>
        </div>
      </Card>
    </div>
  );
}
