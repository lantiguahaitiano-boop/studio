'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles, BrainCircuit } from 'lucide-react';
import { explainMath } from '@/ai/flows/math-explainer';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

export default function ScientificCalculatorPage() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const { addXP } = useAuth();
  const { toast } = useToast();

  const handleButtonClick = (value: string) => {
    setExpression((prev) => prev + value);
  };

  const calculateResult = () => {
    setError(null);
    setResult(null);
    setExplanation(null);
    try {
      // Avoid using eval in production. This is a simplified example.
      // A safer approach would be to use a math parsing library.
      if (!expression.trim()) return;
      const calculatedResult = new Function('return ' + expression)();
      setResult(String(calculatedResult));
    } catch (e) {
      setError('Expresión inválida');
    }
  };

  const handleExplain = async () => {
    if (!result || !expression) return;
    setIsExplaining(true);
    setExplanation(null);
    try {
      const res = await explainMath({ operation: expression, result });
      setExplanation(res.explanation);
      addXP(10);
      toast({
        title: "✨ +10 XP",
        description: "¡Has ganado experiencia por usar la Calculadora!",
      });
    } catch (error) {
      console.error(error);
      setExplanation('No se pudo generar una explicación en este momento.');
    } finally {
      setIsExplaining(false);
    }
  };

  const clearAll = () => {
    setExpression('');
    setResult(null);
    setError(null);
    setExplanation(null);
  };

  const calculatorButtons = [
    '(', ')', '%', 'C',
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+',
  ];

  const handleButtonAction = (value: string) => {
    if (value === 'C') {
      clearAll();
    } else if (value === '=') {
      calculateResult();
    } else {
      handleButtonClick(value);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl">Calculadora Científica Explicada</h1>
        <p className="text-muted-foreground">Resuelve operaciones y entiende los resultados paso a paso.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Calculadora</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                <Input
                    type="text"
                    readOnly
                    value={expression}
                    placeholder="0"
                    className="h-16 text-right text-3xl font-mono"
                />
                {error && <div className="text-destructive text-sm h-5">{error}</div>}
                {result && !error && <div className="text-primary text-2xl h-5 text-right font-bold">{result}</div>}
                {!result && !error && <div className="h-5"></div>}
                
                <div className="grid grid-cols-4 gap-2">
                    {calculatorButtons.map((btn) => (
                        <Button
                            key={btn}
                            variant={
                                ['/', '*', '-', '+', '='].includes(btn) ? 'default' : 
                                btn === 'C' ? 'destructive' : 'secondary'
                            }
                            className="h-14 text-xl"
                            onClick={() => handleButtonAction(btn)}
                        >
                            {btn}
                        </Button>
                    ))}
                </div>
                 <Button onClick={handleExplain} disabled={!result || isExplaining} className="w-full">
                    {isExplaining ? (
                        <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Explicando... </>
                    ) : (
                        <> <BrainCircuit className="mr-2 h-4 w-4" /> Explicar con IA </>
                    )}
                </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Explicación Paso a Paso</CardTitle>
            </CardHeader>
            <CardContent>
              {isExplaining && (
                  <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                          <p>La IA está analizando la operación...</p>
                      </div>
                      <div className="space-y-2 mt-4">
                          <div className="h-4 w-full animate-pulse rounded-md bg-muted"></div>
                          <div className="h-4 w-5/6 animate-pulse rounded-md bg-muted"></div>
                      </div>
                  </div>
              )}
              {explanation && !isExplaining && (
                  <div className="prose prose-invert max-w-none whitespace-pre-wrap rounded-md bg-muted/50 p-4 font-mono text-sm">
                      {explanation}
                  </div>
              )}
              {!explanation && !isExplaining && (
                <div className="flex h-[300px] items-center justify-center rounded-md border-2 border-dashed bg-muted/50">
                    <p className="text-center text-muted-foreground">La explicación de la IA aparecerá aquí.</p>
                </div>
              )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
