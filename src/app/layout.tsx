'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { AuthProviderContent } from '@/hooks/use-auth';

const AuthGuard = dynamic(() => import('@/components/auth-guard'), {
  ssr: false,
   loading: () => (
     <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-16 w-16 text-primary animate-spin" />
      </div>
  )
});


const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
       <head>
        <title>Painel de Clientes</title>
        <meta name="description" content="Gerado pelo Firebase Studio" />
      </head>
      <body className="antialiased">
          <AuthProviderContent>
            <AuthGuard>
              {children}
            </AuthGuard>
          </AuthProviderContent>
          <Toaster />
      </body>
    </html>
  );
}
