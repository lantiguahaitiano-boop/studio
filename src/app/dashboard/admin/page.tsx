

'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { User, Suggestion, SuggestionStatus } from '@/types/auth';
import { Users, Award, Trophy, ShieldCheck, AlertTriangle, MessageSquareQuote, Check, Clock, X, Eye } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Pie, PieChart, Cell } from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const ADMIN_SECURITY_KEY = process.env.NEXT_PUBLIC_ADMIN_SECURITY_KEY || 'lumenadmin_supersecret_key_123!';

export default function AdminPage() {
  const { user, loading, getAllUsers, getAllSuggestions, updateSuggestionStatus } = useAuth();
  const router = useRouter();
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isVerified, setIsVerified] = useState(false);
  const [securityKey, setSecurityKey] = useState('');
  const [error, setError] = useState('');
  
  // This state is just to force re-renders when a suggestion status changes.
  const [_, setForceUpdate] = useState(0);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.replace('/dashboard');
      return;
    }
    if (user?.role === 'admin' && getAllUsers && getAllSuggestions) {
      setAllUsers(getAllUsers());
      setSuggestions(getAllSuggestions());
    }
  }, [user, loading, router, getAllUsers, getAllSuggestions]);

  const { stats, toolUsageData, educationLevelData } = useMemo(() => {
    if (allUsers.length === 0) {
      return { stats: { totalUsers: 0, averageLevel: 0, totalAchievements: 0 }, toolUsageData: [], educationLevelData: [] };
    }

    const totalUsers = allUsers.length;
    const totalLevel = allUsers.reduce((acc, u) => acc + (u.level || 1), 0);
    const averageLevel = totalLevel / totalUsers;
    const totalAchievements = allUsers.reduce((acc, u) => acc + (u.achievements?.length || 0), 0);

    const toolUsageCounter: { [key: string]: number } = {};
    allUsers.forEach(u => {
        if (u.toolUsage) {
            Object.entries(u.toolUsage).forEach(([tool, count]) => {
                toolUsageCounter[tool] = (toolUsageCounter[tool] || 0) + count;
            });
        }
    });

    const toolUsageData = Object.entries(toolUsageCounter)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

    const educationLevelCounter: { [key: string]: number } = {};
    allUsers.forEach(u => {
        const level = u.educationLevel || 'No especificado';
        educationLevelCounter[level] = (educationLevelCounter[level] || 0) + 1;
    });

    const educationLevelData = Object.entries(educationLevelCounter)
        .map(([name, value]) => ({ name, value }));

    return {
      stats: {
        totalUsers,
        averageLevel: parseFloat(averageLevel.toFixed(1)),
        totalAchievements,
      },
      toolUsageData,
      educationLevelData
    };
  }, [allUsers]);

  const handleVerification = () => {
    if (securityKey === ADMIN_SECURITY_KEY) {
      setIsVerified(true);
      setError('');
    } else {
      setError('Clave de seguridad incorrecta.');
    }
  };
  
  const handleStatusChange = (id: string, status: SuggestionStatus) => {
    if(updateSuggestionStatus) {
        updateSuggestionStatus(id, status);
        // This is a workaround to force a re-render of the suggestions list
        setSuggestions(getAllSuggestions ? getAllSuggestions() : []);
    }
  };

  const statusStyles: { [key in SuggestionStatus]: string } = {
    'Pendiente': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    'En Revisión': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Aceptada': 'bg-green-500/10 text-green-400 border-green-500/20',
    'Rechazada': 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }
  
  if (!isVerified) {
    return (
        <Dialog open={!isVerified} onOpenChange={() => {}}>
            <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><ShieldCheck/> Acceso Restringido</DialogTitle>
                    <DialogDescription>
                        Para acceder al panel de administración, por favor, introduce la clave de seguridad.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <Input 
                        type="password"
                        placeholder="Clave de seguridad"
                        value={securityKey}
                        onChange={(e) => setSecurityKey(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleVerification()}
                    />
                    {error && (
                        <p className="text-sm text-destructive flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4"/> {error}
                        </p>
                    )}
                </div>
                <DialogFooter>
                    <Button onClick={() => router.push('/dashboard')} variant="outline">Cancelar</Button>
                    <Button onClick={handleVerification}>Verificar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
  }
  
  const COLORS = ['#B2A4D4', '#A4C8D4', '#A4D4B2', '#D4C8A4', '#D4B2A4', '#C0A4B2'];

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

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Popularidad de Herramientas</CardTitle>
            <CardDescription>Uso total de cada herramienta en la plataforma.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={toolUsageData} layout="vertical" margin={{ right: 20, left: 40 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={80} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} contentStyle={{backgroundColor: 'hsl(var(--background))'}} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {toolUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Distribución de Usuarios</CardTitle>
            <CardDescription>Por nivel educativo.</CardDescription>
          </CardHeader>
          <CardContent>
             <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie data={educationLevelData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                         {educationLevelData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{backgroundColor: 'hsl(var(--background))'}}/>
                </PieChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><MessageSquareQuote /> Buzón de Sugerencias</CardTitle>
          <CardDescription>Feedback enviado por los usuarios para mejorar la plataforma.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {suggestions.length > 0 ? (
                suggestions.map((suggestion) => (
                    <Card key={suggestion.id}>
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                                <p className="text-card-foreground flex-1 pr-4">{suggestion.text}</p>
                                <Badge className={cn(statusStyles[suggestion.status])}>{suggestion.status}</Badge>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 pt-0 gap-4">
                             <div>
                                <p className="text-xs text-muted-foreground font-medium">{suggestion.userName}</p>
                                <p className="text-xs text-muted-foreground">({suggestion.userEmail})</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {formatDistanceToNow(new Date(suggestion.timestamp), { addSuffix: true, locale: es })}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleStatusChange(suggestion.id, 'En Revisión')}><Eye className="h-4 w-4 mr-2"/>En Revisión</Button>
                                <Button variant="outline" size="sm" className="hover:bg-green-500/10" onClick={() => handleStatusChange(suggestion.id, 'Aceptada')}><Check className="h-4 w-4 mr-2"/>Aceptar</Button>
                                <Button variant="outline" size="sm" className="hover:bg-red-500/10" onClick={() => handleStatusChange(suggestion.id, 'Rechazada')}><X className="h-4 w-4 mr-2"/>Rechazar</Button>
                            </div>
                        </CardFooter>
                    </Card>
                ))
            ) : (
                <p className="text-muted-foreground text-center py-4">No hay sugerencias por el momento.</p>
            )}
          </div>
        </CardContent>
      </Card>


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
