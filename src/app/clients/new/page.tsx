'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const NewClientPageClient = dynamic(() => import('@/components/clients/new-client-page'), {
    ssr: false,
    loading: () => (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
        </div>
    ),
});

export default function NewClientPage() {
    return <NewClientPageClient />;
}
