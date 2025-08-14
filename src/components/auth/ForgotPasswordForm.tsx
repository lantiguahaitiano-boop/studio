'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2, Mail } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Por favor, introduce un correo válido." }),
});

export function ForgotPasswordForm() {
  const { forgotPassword } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!forgotPassword) return;
    setIsLoading(true);
    const success = await forgotPassword(values.email);
    if (success) {
        setSubmitted(true);
    }
    setIsLoading(false);
  }

  if (submitted) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Revisa tu Correo</CardTitle>
                <CardDescription>Si existe una cuenta con el correo proporcionado, hemos enviado un enlace para restablecer tu contraseña.</CardDescription>
            </CardHeader>
            <CardFooter>
                 <Link href="/login" className="w-full">
                    <Button variant="outline" className="w-full">Volver a Iniciar Sesión</Button>
                </Link>
            </CardFooter>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Restablecer Contraseña</CardTitle>
        <CardDescription>Introduce tu correo y te enviaremos un enlace para recuperar tu cuenta.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
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
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enviar enlace
            </Button>
             <Link href="/login" className="text-primary hover:underline text-sm">
                Volver a Iniciar Sesión
              </Link>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
