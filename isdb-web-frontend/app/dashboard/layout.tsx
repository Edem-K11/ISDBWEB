'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth/useAuth';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/dashboard/sidebar';
import { ENDPOINTS } from '@/lib/api/endpoints';
import PageLoader from '@/components/ui/loader';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(ENDPOINTS.LOGIN);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
