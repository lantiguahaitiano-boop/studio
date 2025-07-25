'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/context/ThemeProvider";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Moon, Sun } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const profileFormSchema = z.object({
  name: z.string().min(1, { message: "El nombre no puede estar vacío." }),
  educationLevel: z.string({ required_error: "Por favor, selecciona tu nivel educativo." }),
});

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const { setTheme } = useTheme();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      educationLevel: user?.educationLevel || "",
    },
  });

  function onSubmit(values: z.infer<typeof profileFormSchema>) {
    if (updateUser) {
      updateUser(values);
      toast({
        title: "Perfil Actualizado",
        description: "Tus datos han sido guardados correctamente.",
      });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl">Configuración</h1>
        <p className="text-muted-foreground">Gestiona tu perfil y las preferencias de la aplicación.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Perfil de Usuario</CardTitle>
            <CardDescription>Actualiza tu información personal.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre completo</FormLabel>
                      <FormControl><Input placeholder="Tu nombre" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="educationLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nivel educativo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Selecciona tu nivel" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Bachillerato">Bachillerato</SelectItem>
                          <SelectItem value="Secundaria">Secundaria</SelectItem>
                          <SelectItem value="Universidad (Grado)">Universidad (Grado)</SelectItem>
                          <SelectItem value="Universidad (Postgrado)">Universidad (Postgrado)</SelectItem>
                          <SelectItem value="Técnico/FP">Técnico/FP</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Guardar Cambios</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Apariencia</CardTitle>
            <CardDescription>Personaliza el aspecto de la aplicación.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
                <Label>Tema</Label>
                <RadioGroup
                  defaultValue="dark"
                  className="grid grid-cols-2 gap-4"
                  onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}
                >
                  <Label className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                    <RadioGroupItem value="light" className="sr-only" />
                    <Sun className="h-6 w-6" />
                    <span className="mt-2 font-normal">Claro</span>
                  </Label>
                  <Label className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary">
                    <RadioGroupItem value="dark" className="sr-only" />
                    <Moon className="h-6 w-6" />
                    <span className="mt-2 font-normal">Oscuro</span>
                  </Label>
                </RadioGroup>
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
