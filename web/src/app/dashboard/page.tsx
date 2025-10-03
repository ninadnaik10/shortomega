'use client';

import Dashboard from '@/components/dashboard/Dashboard';
import AppTheme from '@/shared-theme/AppTheme';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
    const router = useRouter();

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('token');

        if (!isAuthenticated) {
            router.push('/sign-in');
        }
    }, [router]);

    return (
        <>
            <AppTheme>
                <Dashboard />
            </AppTheme>
        </>
    );
}
