'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { askQuestion } from '@/ai/flows/ai-chatbot';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, User, Bot, Loader2, MessageCircleQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  question: z.string().min(1),
});

type Message = {
  text: string;
  sender: 'user' | 'ai';
  isLoading?: boolean;
};

const LOCAL_STORAGE_KEY = 'lumenai_interactive_assistant_history';

export default function InteractiveAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { addXP } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
    },
  });

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedHistory) {
        setMessages(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Failed to load chat history from localStorage', error);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
    }
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const userMessage: Message = { text: values.question, sender: 'user' };
    const loadingMessage: Message = { text: '', sender: 'ai', isLoading: true };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    form.reset();

    try {
      const result = await askQuestion({ question: values.question });
      const aiMessage: Message = { text: result.answer, sender: 'ai' };
      setMessages((prev) => [...prev.slice(0, -1), aiMessage]);
      addXP(10);
      toast({
        title: "✨ +10 XP",
        description: "¡Has ganado experiencia por usar el Asistente Interactivo!",
      });
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        text: 'Lo siento, no pude procesar tu pregunta. Inténtalo de nuevo.',
        sender: 'ai',
      };
      setMessages((prev) => [...prev.slice(0, -1), errorMessage]);
    }
  }
  
  return (
    <div className="flex h-[calc(100vh-theme(spacing.24))] flex-col">
      <div className="mb-4">
        <h1 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl">Asistente Interactivo de Preguntas</h1>
        <p className="text-muted-foreground">Chatea en tiempo real para obtener respuestas a tus dudas académicas.</p>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden rounded-lg border">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                    <MessageCircleQuestion className="w-16 h-16 mb-4" />
                    <h2 className="text-xl font-semibold">¿Cómo puedo ayudarte?</h2>
                    <p>Escribe tu pregunta académica abajo para comenzar.</p>
                </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-3',
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.sender === 'ai' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-md rounded-lg p-3 text-sm md:max-w-xl lg:max-w-2xl',
                    message.sender === 'user'
                      ? 'rounded-br-none bg-accent text-accent-foreground'
                      : 'rounded-bl-none bg-muted'
                  )}
                >
                  {message.isLoading ? (
                    <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Pensando...</span>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{message.text}</p>
                  )}
                </div>
                {message.sender === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="border-t p-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex items-center gap-2"
            >
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        placeholder="Escribe tu pregunta aquí..."
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" size="icon" disabled={form.formState.isSubmitting}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
