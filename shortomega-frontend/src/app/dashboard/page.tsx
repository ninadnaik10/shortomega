'use client';

import Dashboard from "@/components/dashboard/Dashboard";
import AppTheme from "@/shared-theme/AppTheme";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Replace this check with your actual authentication check
    const isAuthenticated = localStorage.getItem('token'); // or any other auth check

    if (!isAuthenticated) {
      router.push('/signin'); // Replace with your sign-in route
    }
  }, [router]);

  return <>
  <AppTheme>
  <Dashboard />
  </AppTheme></>;
}
