'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateQuiz } from '@/ai/flows/quiz-generator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, HelpCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { AnimatedDiv } from '@/components/ui/animated-div';

const formSchema = z.object({
  text: z.string().min(100, {
    message: 'El texto debe tener al menos 100 caracteres para generar un cuestionario.',
  }),
});

type Quiz = {
    question: string;
    options: string[];
    answer: string;
}

export default function QuizGeneratorPage() {
  const [quiz, setQuiz] = useState<Quiz[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addXP } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setQuiz(null);
    try {
      const result = await generateQuiz(values);
      setQuiz(result.questions);
      addXP(10, 'quiz-generator');
      toast({
        title: "✨ +10 XP",
        description: "¡Has ganado experiencia por usar el Generador de Cuestionarios!",
      });
    } catch (error) {
      console.error(error);
      // Handle error display
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AnimatedDiv className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl">Generador de Cuestionarios</h1>
        <p className="text-muted-foreground">Pega un texto y crearemos un cuestionario para ayudarte a estudiar.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contenido para el Cuestionario</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Texto de Origen</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Pega aquí el contenido de tu lección, un artículo o cualquier texto..."
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creando...</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" /> Generar Cuestionario</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Cuestionario Generado</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-12">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <p>Generando preguntas...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {quiz && !isLoading && (
        <AnimatedDiv>
        <Card>
          <CardHeader>
            <CardTitle>Cuestionario Generado</CardTitle>
            <CardDescription>Revisa las preguntas y expande para ver las respuestas correctas.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {quiz.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>
                    <div className="flex items-start gap-3 text-left">
                        <HelpCircle className="mt-1 h-5 w-5 shrink-0 text-primary" />
                        <span>{index + 1}. {item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pl-8">
                        {item.options.map((option, optionIndex) => (
                            <div key={optionIndex} className={`p-2 rounded-md text-sm ${option === item.answer ? 'bg-green-500/20 text-green-200' : 'bg-muted/50'}`}>
                                {option}
                            </div>
                        ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
        </AnimatedDiv>
      )}
    </AnimatedDiv>
  );
}
