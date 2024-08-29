'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import RestaurantManager from '@/components/admin/RestaurantManager';
import UserManager from '@/components/admin/UserManager';
import ReviewManager from '@/components/admin/ReviewManager';

export default function AdminPanel() {
  const { isAuthenticated } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('restaurants');

  useEffect(() => {
    if (isAuthenticated) {
      const role = localStorage.getItem('role');
      setIsAdmin(role === 'admin');
      if (role !== 'admin') {
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAdmin) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <div className="mb-4">
        <button 
          onClick={() => setActiveTab('restaurants')} 
          className={`mr-2 px-4 py-2 ${activeTab === 'restaurants' ? 'bg-blue-500 text-white' : 'bg-gray-500'}`}
        >
          Restaurants
        </button>
        <button 
          onClick={() => setActiveTab('users')} 
          className={`mr-2 px-4 py-2 ${activeTab === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-500'}`}
        >
          Users
        </button>
        <button 
          onClick={() => setActiveTab('reviews')} 
          className={`px-4 py-2 ${activeTab === 'reviews' ? 'bg-blue-500 text-white' : 'bg-gray-500'}`}
        >
          Reviews
        </button>
      </div>
      {activeTab === 'restaurants' && <RestaurantManager />}
      {activeTab === 'users' && <UserManager />}
      {activeTab === 'reviews' && <ReviewManager />}
    </div>
  );
}