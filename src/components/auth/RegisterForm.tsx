'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Separator } from "../ui/separator";

const formSchema = z.object({
  name: z.string().min(1, { message: "El nombre no puede estar vacío." }),
  email: z.string().email({ message: "Por favor, introduce un correo válido." }),
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres." }),
  educationLevel: z.string({ required_error: "Por favor, selecciona tu nivel educativo." }),
});

export function RegisterForm() {
  const { register, signInWithGoogle } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!register) return;
    setIsLoading(true);
    try {
        const success = await register(values);
        if (success) {
          toast({
            title: "¡Revisa tu correo!",
            description: "Te hemos enviado un enlace para verificar tu cuenta.",
          });
          router.push("/login");
        }
    } finally {
        setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    if (!signInWithGoogle) return;
    setIsGoogleLoading(true);
    try {
        await signInWithGoogle();
    } catch (error) {
         toast({
            variant: "destructive",
            title: "Error de inicio de sesión",
            description: "No se pudo iniciar sesión con Google. Inténtalo de nuevo.",
          });
    } finally {
        setIsGoogleLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Crear Cuenta</CardTitle>
        <CardDescription>Únete a Skillico y potencia tu aprendizaje.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
             <div className="space-y-2">
                 <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading || isLoading}
                  type="button"
                >
                  {isGoogleLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 173.8 58.2L373.2 121.8C337.9 86.6 295.6 70 248 70c-104.6 0-190 84.8-190 186.2s85.4 186.2 190 186.2c53.3 0 96.2-22.3 128.3-54.2 28.5-28.2 43.2-66.6 46.8-103.5H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                  )}
                  Continuar con Google
                </Button>
            </div>
             <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  O regístrate con tu correo
                </span>
              </div>
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Tu nombre" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input placeholder="tu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Mínimo 8 caracteres" {...field} />
                  </FormControl>
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
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu nivel" />
                      </SelectTrigger>
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
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Registrarse
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Inicia sesión
              </Link>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
