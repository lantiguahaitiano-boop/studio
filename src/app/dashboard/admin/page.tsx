
'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types/auth';
import { Users, Award, Trophy, Star } from 'lucide-react';

export default function AdminPage() {
  const { user, loading, getAllUsers } = useAuth();
  const router = useRouter();
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.replace('/dashboard');
      return;
    }
    if (user?.role === 'admin' && getAllUsers) {
      setAllUsers(getAllUsers());
    }
  }, [user, loading, router, getAllUsers]);

  const stats = useMemo(() => {
    if (allUsers.length === 0) {
      return { totalUsers: 0, averageLevel: 0, totalAchievements: 0 };
    }
    const totalUsers = allUsers.length;
    const totalLevel = allUsers.reduce((acc, u) => acc + (u.level || 1), 0);
    const averageLevel = totalLevel / totalUsers;
    const totalAchievements = allUsers.reduce((acc, u) => acc + (u.achievements?.length || 0), 0);
    
    return {
      totalUsers,
      averageLevel: parseFloat(averageLevel.toFixed(1)),
      totalAchievements,
    };
  }, [allUsers]);

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
        <p className="text-muted-foreground">Visión general del sistema y estadísticas de la plataforma.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios Totales</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Cuentas registradas en la plataforma.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nivel Promedio</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageLevel}</div>
            <p className="text-xs text-muted-foreground">Nivel promedio de todos los usuarios.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Logros Totales</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAchievements}</div>
            <p className="text-xs text-muted-foreground">Insignias desbloqueadas por los usuarios.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestión de Usuarios</CardTitle>
          <CardDescription>Lista de todos los usuarios registrados en LumenAI.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-center">Nivel</TableHead>
                <TableHead className="text-center">XP</TableHead>
                <TableHead className="text-right">Rol</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allUsers.map((u) => (
                <TableRow key={u.email}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell className="text-center">{u.level || 1}</TableCell>
                  <TableCell className="text-center">{u.xp || 0}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={u.role === 'admin' ? 'default' : 'secondary'}>
                      {u.role}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
