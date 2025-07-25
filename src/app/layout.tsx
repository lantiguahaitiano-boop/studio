import type { Metadata } from 'next';
import './globals.css';
import { cn } from "@/lib/utils";
import { AuthProvider } from '@/context/AuthProvider';
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: 'LumenAI',
  description: 'Tu asistente educativo inteligente.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased")}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
