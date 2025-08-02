
import { LumenAILogo } from '@/components/icons/LumenAILogo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <LumenAILogo className="h-8 w-8" />
            <div className="flex items-center gap-2">
                <span className="font-bold sm:inline-block font-headline text-2xl">LumenAI</span>
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
            <h1 className="font-headline text-4xl font-extrabold tracking-tighter md:text-5xl">Política de Privacidad</h1>
            <p className="text-muted-foreground">Última actualización: {new Date().toLocaleDateString()}</p>

            <h2>1. Introducción</h2>
            <p>Esta Política de Privacidad describe cómo LumenAI ("nosotros", "nuestro" o "nos") recopila, utiliza y divulga su información personal cuando utiliza nuestro sitio web y nuestros servicios.</p>

            <h2>2. Información que Recopilamos</h2>
            <p>Recopilamos información que usted nos proporciona directamente, como cuando crea una cuenta a través de nuestro formulario de registro o mediante un proveedor de autenticación como Google. La información que podemos recopilar incluye:</p>
            <ul>
                <li>Nombre</li>
                <li>Dirección de correo electrónico</li>
                <li>Nivel educativo</li>
                <li>Contenido que proporciona a través de nuestras herramientas (textos para resumir, preguntas, etc.)</li>
            </ul>

            <h2>3. Cómo Utilizamos su Información</h2>
            <p>Utilizamos la información que recopilamos para diversos fines, que incluyen:</p>
            <ul>
                <li>Proporcionar, operar y mantener nuestros servicios.</li>
                <li>Mejorar, personalizar y ampliar nuestros servicios.</li>
                <li>Entender y analizar cómo utiliza nuestros servicios.</li>
                <li>Desarrollar nuevos productos, servicios, características y funcionalidades.</li>
                <li>Comunicarnos con usted, ya sea directamente o a través de uno de nuestros socios.</li>
            </ul>

            <h2>4. Almacenamiento de Datos</h2>
            <p>Su información de perfil, el historial de uso de las herramientas y otros datos se almacenan de forma segura en la base de datos de Google Firestore. Esto nos permite ofrecer una experiencia persistente y accesible desde cualquier dispositivo.</p>
            
            <h2>5. Seguridad de los Datos</h2>
            <p>Nos esforzamos por utilizar medios comercialmente aceptables para proteger su información personal, aprovechando las robustas medidas de seguridad proporcionadas por Google Firebase.</p>

            <h2>6. Cambios en esta Política de Privacidad</h2>
            <p>Podemos actualizar nuestra Política de Privacidad de vez en cuando. Le notificaremos cualquier cambio publicando la nueva Política de Privacidad en esta página.</p>

            <h2>7. Contáctenos</h2>
            <p>Si tiene alguna pregunta sobre esta Política de Privacidad, contáctenos.</p>
          </div>
        </div>
      </main>
       <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
           <div className="flex flex-col items-center gap-2 md:flex-row">
                <div className="flex items-center gap-2">
                    <LumenAILogo className="h-6 w-6" />
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} LumenAI. Todos los derechos reservados.
                    </p>
                </div>
           </div>
        </div>
      </footer>
    </div>
  );
}
