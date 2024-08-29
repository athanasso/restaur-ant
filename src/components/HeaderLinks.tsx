'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { useEffect, useState } from 'react';

export default function HeaderLinks() {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const adminStatus = localStorage.getItem('role') === 'admin';
    if (adminStatus) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [isAuthenticated, setIsAdmin]);

  if (isAuthenticated) {
    return (
      <div className="flex items-center">
        {isAdmin && (
          <Link href="/admin" className="mr-4 text-white">
            Admin Panel
          </Link>
        )}
        <button onClick={logout} className="text-white">
          Logout
        </button>
      </div>
    );
  }

  return (
    <div>
      {pathname !== '/login' && (
        <Link href="/login" className="mr-4 text-white">
          Login
        </Link>
      )}
      {pathname !== '/register' && (
        <Link href="/register" className="mr-4 text-white">
          Register
        </Link>
      )}
    </div>
  );
}