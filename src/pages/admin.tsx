'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';

export default function AdminPanel() {
  const { isAuthenticated } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {

        const role = localStorage.getItem('role');
        setIsAdmin(role === 'admin');
        if (role !== 'admin') {
          router.push('/');
        }
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAdmin) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      {/* Add components for managing restaurants, users, and reviews */}
    </div>
  );
}