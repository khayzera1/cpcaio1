// src/app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from '@/components/auth-provider';

const inter = Inter({ subsets: ['latin'] });

// Metadados são seguros em um componente de servidor
export const metadata: Metadata = {
  title: 'Painel de Clientes',
  description: 'Gerado pelo Firebase Studio',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.className}>
      <body className="antialiased">
        {/* AuthProvider irá gerenciar a lógica do cliente */}
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
