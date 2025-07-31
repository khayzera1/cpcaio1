'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';

const publicRoutes = ['/login', '/register'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (isLoading) {
            return; // Do nothing while loading
        }

        const isPublicRoute = publicRoutes.includes(pathname);

        if (user && isPublicRoute) {
            router.push('/');
        } else if (!user && !isPublicRoute) {
            router.push('/login');
        }
    }, [user, isLoading, router, pathname]);
    
    // While loading, or if the routes are being handled, don't render children
    if (isLoading || (user && publicRoutes.includes(pathname)) || (!user && !publicRoutes.includes(pathname))) {
        return null; // Or a global loader
    }
    
    return <>{children}</>;
};
