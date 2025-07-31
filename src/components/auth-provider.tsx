'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth, AuthProviderContent } from '@/hooks/use-auth';
import { useEffect } from 'react';

const publicRoutes = ['/login', '/register'];

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (isLoading) {
            return; // Do nothing while loading
        }

        const isPublicRoute = publicRoutes.includes(pathname);

        if (user && isPublicRoute) {
            // If user is logged in and tries to access a public route, redirect to home
            router.push('/');
        } else if (!user && !isPublicRoute) {
            // If user is not logged in and tries to access a private route, redirect to login
            router.push('/login');
        }
    }, [user, isLoading, router, pathname]);
    
    const isPublicRoute = publicRoutes.includes(pathname);
    // Render children if loading, or if the user is authenticated, or if it's a public route
    // This prevents a flash of unstyled/incorrect content
    if (isLoading || isPublicRoute || (!isLoading && user)) {
        return <>{children}</>;
    }

    // While redirecting for non-auth users on private routes, we can return null or a loader
    return null;
};


export default function AuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <AuthProviderContent>
            <AuthGuard>
                {children}
            </AuthGuard>
        </AuthProviderContent>
    )
}
