'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const RegisterPageClient = dynamic(
  () => import('@/components/register-page'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-16 w-16 text-primary animate-spin" />
      </div>
    ),
  }
);

export default function RegisterPage() {
  return <RegisterPageClient />;
}
