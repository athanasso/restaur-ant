import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { useSession } from 'next-auth/react';

export default function HeaderLinks() {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();
  const { data } = useSession();

  if (isAuthenticated) {
    return (
      <div className="flex items-center">
        <Link href="/profile" className="mr-4 text-white">
          Profile
        </Link>
        {data?.user.role === 'admin' && (
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