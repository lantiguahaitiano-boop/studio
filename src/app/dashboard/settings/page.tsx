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
import { Moon, Sun, Send, Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";

const profileFormSchema = z.object({
  name: z.string().min(1, { message: "El nombre no puede estar vacío." }),
  educationLevel: z.string({ required_error: "Por favor, selecciona tu nivel educativo." }),
});

const suggestionFormSchema = z.object({
  suggestion: z.string().min(10, { message: "La sugerencia debe tener al menos 10 caracteres."}),
});

export default function SettingsPage() {
  const { user, updateUser, submitSuggestion } = useAuth();
  const { setTheme } = useTheme();
  const { toast } = useToast();
  const [isSubmittingSuggestion, setIsSubmittingSuggestion] = useState(false);

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      educationLevel: "",
    },
  });

  const suggestionForm = useForm<z.infer<typeof suggestionFormSchema>>({
    resolver: zodResolver(suggestionFormSchema),
    defaultValues: {
      suggestion: "",
    },
  });

  useEffect(() => {
      if (user) {
          profileForm.reset({
              name: user.name,
              educationLevel: user.educationLevel,
          });
      }
  }, [user, profileForm]);

  function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    if (updateUser) {
      updateUser(values);
      toast({
        title: "Perfil Actualizado",
        description: "Tus datos han sido guardados correctamente.",
      });
    }
  }
  
  async function onSuggestionSubmit(values: z.infer<typeof suggestionFormSchema>) {
    if (!submitSuggestion) return;
    setIsSubmittingSuggestion(true);
    try {
        await submitSuggestion(values.suggestion);
        toast({
            title: "Sugerencia Enviada",
            description: "¡Gracias por tu feedback! Lo revisaremos pronto.",
        });
        suggestionForm.reset();
    } catch (error) {
         toast({
            variant: "destructive",
            title: "Error al enviar",
            description: "No se pudo enviar tu sugerencia. Inténtalo de nuevo.",
        });
    } finally {
        setIsSubmittingSuggestion(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl">Configuración</h1>
        <p className="text-muted-foreground">Gestiona tu perfil y las preferencias de la aplicación.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Perfil de Usuario</CardTitle>
            <CardDescription>Actualiza tu información personal.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                <FormField
                  control={profileForm.control}
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
                  control={profileForm.control}
                  name="educationLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nivel educativo</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Selecciona tu nivel" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Bachillerato">Bachillerato</SelectItem>
                          <SelectItem value="Secundaria">Secundaria</SelectItem>
                          <SelectItem value="Universidad (Grado)">Universidad (Grado)</SelectItem>
                          <SelectItem value="Universidad (Postgrado)">Universidad (Postgrado)</SelectItem>
                          <SelectItem value="Técnico/FP">Técnico/FP</SelectItem>
                          <SelectItem value="No especificado">No especificado</SelectItem>
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
        
        <div className="space-y-6">
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
      
      <Card>
        <CardHeader>
            <CardTitle>Buzón de Sugerencias</CardTitle>
            <CardDescription>¿Tienes una idea para mejorar LearnPro? ¡Nos encantaría escucharla!</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...suggestionForm}>
                <form onSubmit={suggestionForm.handleSubmit(onSuggestionSubmit)} className="space-y-4">
                    <FormField
                      control={suggestionForm.control}
                      name="suggestion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tu sugerencia</FormLabel>
                          <FormControl>
                            <Textarea 
                                placeholder="Describe tu idea, una nueva función o cualquier mejora que se te ocurra..."
                                className="min-h-[100px]"
                                {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isSubmittingSuggestion}>
                        {isSubmittingSuggestion ? (
                            <> <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Enviando... </>
                        ) : (
                            <> <Send className="mr-2 h-4 w-4"/> Enviar Sugerencia </>
                        )}
                    </Button>
                </form>
            </Form>
        </CardContent>
      </Card>
    </div>
  );
}
