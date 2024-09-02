'use client';

import { useState } from 'react';
import RestaurantManager from '@/components/admin/RestaurantManager';
import UserManager from '@/components/admin/UserManager';
import ReviewManager from '@/components/admin/ReviewManager';
import { useSession } from 'next-auth/react';

export default function AdminPanel() {
  const { data } = useSession();
  const [activeTab, setActiveTab] = useState('restaurants');

  if (data?.user.role !== 'admin') {
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