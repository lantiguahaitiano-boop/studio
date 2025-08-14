
import { Badge } from "@/components/ui/badge";
import { SkillicoLogo } from "@/components/icons/SkillicoLogo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
            <SkillicoLogo className="h-16 w-16 mb-4" />
          <div className="flex items-center gap-2">
            <h1 className="font-headline text-4xl font-bold text-primary">Skillico</h1>
            <Badge variant="secondary">BETA</Badge>
          </div>
          <p className="text-muted-foreground">Tu asistente educativo inteligente.</p>
        </div>
        {children}
      </div>
    </div>
  );
}
