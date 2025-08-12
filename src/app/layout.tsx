import type { Metadata } from 'next';
import './globals.css';
import { cn } from "@/lib/utils";
import { AuthProvider } from '@/context/AuthProvider';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/context/ThemeProvider';
import { LoadingProvider } from '@/context/LoadingProvider';
import { NavigationLoader } from '@/components/layout/NavigationLoader';

export const metadata: Metadata = {
  title: 'Skillico',
  description: 'Tu asistente educativo inteligente.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LoadingProvider>
            <AuthProvider>
              <NavigationLoader />
              {children}
              <Toaster />
            </AuthProvider>
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
