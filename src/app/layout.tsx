import type { Metadata } from 'next';
import './globals.css';
import { cn } from "@/lib/utils";
import { AuthProvider } from '@/context/AuthProvider';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/context/ThemeProvider';
import { AnimatePresence } from 'framer-motion';

export const metadata: Metadata = {
  title: 'LearnPro',
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
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
