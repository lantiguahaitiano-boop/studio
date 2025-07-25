import { LumenAILogo } from "@/components/icons/LumenAILogo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
            <LumenAILogo className="h-16 w-16 mb-4" />
          <h1 className="font-headline text-4xl font-bold text-primary">LumenAI</h1>
          <p className="text-muted-foreground">Tu asistente educativo inteligente.</p>
        </div>
        {children}
      </div>
    </div>
  );
}
