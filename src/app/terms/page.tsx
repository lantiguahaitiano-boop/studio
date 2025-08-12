
import { LearnProLogo } from '@/components/icons/LearnProLogo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function TermsOfServicePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <LearnProLogo className="h-8 w-8" />
             <div className="flex items-center gap-2">
                <span className="font-bold sm:inline-block font-headline text-2xl">LearnPro</span>
                <Badge variant="secondary">BETA</Badge>
            </div>
          </Link>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-1">
              <Link href="/login">
                <Button variant="ghost">Iniciar Sesión</Button>
              </Link>
              <Link href="/register">
                <Button>Registrarse</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-12 md:py-24 lg:py-32">
          <div className="prose prose-invert mx-auto max-w-4xl">
            <h1 className="font-headline text-4xl font-extrabold tracking-tighter md:text-5xl">Términos de Servicio</h1>
            <p className="text-muted-foreground">Última actualización: {new Date().toLocaleDateString()}</p>

            <h2>1. Aceptación de los Términos</h2>
            <p>Al acceder y utilizar LearnPro (el "Servicio"), usted acepta estar sujeto a estos Términos de Servicio ("Términos"). Si no está de acuerdo con alguna parte de los términos, no podrá acceder al Servicio.</p>

            <h2>2. Descripción del Servicio</h2>
            <p>LearnPro es una plataforma de asistencia educativa que utiliza inteligencia artificial para proporcionar diversas herramientas a los estudiantes. Las características incluyen, entre otras, asistente de tareas, resumen de textos, explicador de conceptos y más.</p>

            <h2>3. Cuentas de Usuario</h2>
            <p>Para acceder a la mayoría de las funciones del Servicio, debe registrarse para obtener una cuenta. Usted es responsable de salvaguardar la contraseña que utiliza para acceder al Servicio y de cualquier actividad o acción bajo su contraseña. Usted se compromete a no revelar su contraseña a ningún tercero.</p>

            <h2>4. Contenido Generado por el Usuario</h2>
            <p>Usted es el único responsable del contenido que carga, publica o muestra (en adelante, "publica") en o a través del Servicio. Usted declara y garantiza que tiene todos los derechos necesarios para publicar dicho contenido y que dicho contenido no infringe los derechos de terceros.</p>

            <h2>5. Uso Aceptable</h2>
            <p>Usted se compromete a no utilizar el Servicio para ningún propósito que sea ilegal o esté prohibido por estos Términos. No puede utilizar el Servicio de ninguna manera que pueda dañar, deshabilitar, sobrecargar o perjudicar el Servicio.</p>

            <h2>6. Terminación</h2>
            <p>Podemos rescindir o suspender su cuenta de inmediato, sin previo aviso ni responsabilidad, por cualquier motivo, incluido, entre otros, si incumple los Términos.</p>

            <h2>7. Cambios en los Términos</h2>
            <p>Nos reservamos el derecho, a nuestra entera discreción, de modificar o reemplazar estos Términos en cualquier momento. Si una revisión es importante, intentaremos proporcionar un aviso de al menos 30 días antes de que entren en vigor los nuevos términos.</p>
            
            <h2>8. Contáctenos</h2>
            <p>Si tiene alguna pregunta sobre estos Términos, contáctenos.</p>
          </div>
        </div>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
           <div className="flex flex-col items-center gap-2 md:flex-row">
                <div className="flex items-center gap-2">
                    <LearnProLogo className="h-6 w-6" />
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} LearnPro. Todos los derechos reservados.
                    </p>
                </div>
           </div>
        </div>
      </footer>
    </div>
  );
}
