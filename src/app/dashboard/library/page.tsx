'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { resourcesData, Resource } from '@/lib/resources';
import { useAuth } from '@/hooks/use-auth';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search, Star, X } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';


const categories = ['Todos', ...Array.from(new Set(resourcesData.map(r => r.category)))];
const educationLevels = ['Todos', ...Array.from(new Set(resourcesData.map(r => r.educationLevel)))];

export default function LibraryPage() {
  const { user, toggleFavoriteResource } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('Todos');
  const [level, setLevel] = useState('Todos');

  const filteredResources = useMemo(() => {
    return resourcesData.filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            resource.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === 'Todos' || resource.category === category;
      const matchesLevel = level === 'Todos' || resource.educationLevel === level;
      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [searchTerm, category, level]);

  const favoriteResources = useMemo(() => {
    if (!user?.favoriteResources) return [];
    return resourcesData.filter(resource => user.favoriteResources.includes(resource.id));
  }, [user?.favoriteResources]);

  const clearFilters = () => {
    setSearchTerm('');
    setCategory('Todos');
    setLevel('Todos');
  };

  const ResourceCard = ({ resource }: { resource: Resource }) => {
    const isFavorite = user?.favoriteResources?.includes(resource.id);

    const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (toggleFavoriteResource) {
            toggleFavoriteResource(resource.id);
        }
    }

    return (
      <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
        <CardHeader className="relative p-0">
          <Image
            src={resource.imageUrl}
            alt={resource.title}
            width={600}
            height={400}
            className="aspect-video w-full object-cover"
          />
        </CardHeader>
        <CardContent className="flex flex-1 flex-col p-4">
          <div className="mb-2 flex items-center justify-between">
            <Badge variant="secondary">{resource.type}</Badge>
            <div className="flex gap-2">
              <Badge>{resource.category}</Badge>
              <Badge variant="outline">{resource.educationLevel}</Badge>
            </div>
          </div>
          <CardTitle className="mb-2 font-headline text-lg">{resource.title}</CardTitle>
          <p className="flex-1 text-sm text-muted-foreground">{resource.description}</p>
        </CardContent>
        <CardFooter className="flex items-center justify-between p-4 pt-0">
          <Button asChild variant="outline" size="sm">
            <Link href={resource.url} target="_blank" rel="noopener noreferrer">
              <resource.icon className="mr-2 h-4 w-4" />
              Visitar
            </Link>
          </Button>
          <Button 
            size="sm" 
            variant={isFavorite ? 'default' : 'ghost'}
            onClick={handleFavoriteClick}
            className="flex items-center gap-2"
          >
            <Star className={cn("h-4 w-4", isFavorite && "fill-current text-yellow-400")} />
            <span>{isFavorite ? 'Favorito' : 'Guardar'}</span>
          </Button>
        </CardFooter>
      </Card>
    );
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl">Biblioteca de Recursos</h1>
        <p className="text-muted-foreground">Explora, busca y guarda materiales educativos para potenciar tu aprendizaje.</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative sm:col-span-2 lg:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Buscar por título o descripción..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue placeholder="Categoría" /></SelectTrigger>
              <SelectContent>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger><SelectValue placeholder="Nivel Educativo" /></SelectTrigger>
              <SelectContent>
                {educationLevels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
           {(searchTerm || category !== 'Todos' || level !== 'Todos') && (
            <div className="mt-4 flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="mr-2 h-4 w-4" />
                Limpiar filtros
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todos los Recursos</TabsTrigger>
          <TabsTrigger value="favorites">Mis Favoritos ({favoriteResources.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredResources.map(resource => <ResourceCard key={resource.id} resource={resource} />)}
          </div>
          {filteredResources.length === 0 && (
            <div className="mt-12 flex flex-col items-center justify-center text-center">
              <p className="text-lg font-semibold">No se encontraron recursos</p>
              <p className="text-muted-foreground">Intenta ajustar tus filtros de búsqueda.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="favorites">
           <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favoriteResources.map(resource => <ResourceCard key={resource.id} resource={resource} />)}
          </div>
          {favoriteResources.length === 0 && (
            <div className="mt-12 flex flex-col items-center justify-center text-center">
              <p className="text-lg font-semibold">No tienes favoritos guardados</p>
              <p className="text-muted-foreground">Explora los recursos y haz clic en 'Guardar' para añadirlos aquí.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
