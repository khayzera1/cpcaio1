'use client';

import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const AuthProvider = dynamic(() => import('@/components/auth-provider'), {
  ssr: false,
  loading: () => (
     <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-16 w-16 text-primary animate-spin" />
      </div>
  )
});

const inter = Inter({ subsets: ['latin'] });

// Metadata cannot be exported from a client component, but since this is the root layout,
// we can manage the title in the <head> tag directly if needed, or keep it static here.
// For Vercel build, it's safer to remove the export.
// export const metadata: Metadata = {
//   title: 'Painel de Clientes',
//   description: 'Gerado pelo Firebase Studio',
// };

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
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster />
      </body>
    </html>
  );
}
