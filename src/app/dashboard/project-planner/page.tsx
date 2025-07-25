'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { planProject, PlanProjectOutput } from '@/ai/flows/project-planner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Sparkles, BookCheck, ClipboardList } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  topic: z.string().min(10, {
    message: 'El tema debe tener al menos 10 caracteres.',
  }),
});

export default function ProjectPlannerPage() {
  const [plan, setPlan] = useState<PlanProjectOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addXP } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setPlan(null);
    try {
      const result = await planProject(values);
      setPlan(result);
      addXP(10, 'project-planner');
      toast({
        title: "✨ +10 XP",
        description: "¡Has ganado experiencia por usar el Planificador de Proyectos!",
      });
    } catch (error) {
      console.error(error);
      // Handle error display
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl">Planificador de Proyectos</h1>
        <p className="text-muted-foreground">Estructura y planifica tus trabajos de investigación con ayuda de la IA.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tema de Investigación</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>¿Sobre qué trata tu proyecto?</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: El impacto de la inteligencia artificial en la educación superior"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Planificando...</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" /> Generar Plan</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
         <Card>
            <CardHeader>
                <CardTitle>Plan de Proyecto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <p>La IA está estructurando tu proyecto...</p>
                </div>
                <div className="space-y-2 pt-4">
                    <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted"></div>
                    <div className="h-4 w-full animate-pulse rounded-md bg-muted"></div>
                    <div className="h-4 w-5/6 animate-pulse rounded-md bg-muted"></div>
                    <div className="h-4 w-full animate-pulse rounded-md bg-muted"></div>
                </div>
            </CardContent>
        </Card>
      )}

      {plan && !isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>{plan.title}</CardTitle>
            <CardDescription>Aquí tienes una estructura sugerida para tu proyecto.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
                <AccordionItem value="item-0">
                    <AccordionTrigger><div className="flex items-center gap-2"><ClipboardList className="h-5 w-5"/>Introducción</div></AccordionTrigger>
                    <AccordionContent className="whitespace-pre-wrap pl-8 text-muted-foreground">{plan.introduction}</AccordionContent>
                </AccordionItem>
                {plan.sections.map((section, index) => (
                    <AccordionItem value={`item-${index + 1}`} key={index}>
                        <AccordionTrigger><div className="flex items-center gap-2"><ClipboardList className="h-5 w-5"/>{section.title}</div></AccordionTrigger>
                        <AccordionContent className="whitespace-pre-wrap pl-8 text-muted-foreground">{section.content}</AccordionContent>
                    </AccordionItem>
                ))}
                 <AccordionItem value="item-conclusion">
                    <AccordionTrigger><div className="flex items-center gap-2"><ClipboardList className="h-5 w-5"/>Conclusión</div></AccordionTrigger>
                    <AccordionContent className="whitespace-pre-wrap pl-8 text-muted-foreground">{plan.conclusion}</AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-bibliography">
                    <AccordionTrigger><div className="flex items-center gap-2"><BookCheck className="h-5 w-5"/>Bibliografía Sugerida</div></AccordionTrigger>
                    <AccordionContent className="pl-8">
                        <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                            {plan.bibliography.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
