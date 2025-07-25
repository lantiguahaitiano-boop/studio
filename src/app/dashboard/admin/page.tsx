
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl">Panel de Administrador</h1>
        <p className="text-muted-foreground">Herramientas y estadísticas exclusivas para la gestión de LumenAI.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Bienvenido, Admin</CardTitle>
          <CardDescription>Esta es tu zona de control.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-[200px] flex-col items-center justify-center rounded-md border-2 border-dashed bg-muted/50 p-8 text-center">
            <div className="mb-4 rounded-full bg-primary/10 p-3">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <p className="text-lg font-semibold">El sistema de logs y otras herramientas de administrador aparecerán aquí.</p>
            <p className="text-muted-foreground">¡Estamos preparando cosas increíbles para ti!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
