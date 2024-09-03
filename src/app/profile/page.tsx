'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { getUser, updateUser } from '@/lib/api';
import { useSession } from 'next-auth/react';

export default function ProfilePage() {
  const { isAuthenticated } = useAuth();
  const { data } = useSession();
  const [user, setUser] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [isEditing, setIsEditing] = useState(false);
  const userId = data?.user?.id as unknown as number;
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const fetchUserData = useCallback(async () => {
    setError('');
    try {
      const userData = await getUser(userId);
      setUser(userData);
    } catch (error) {
      setError('Failed to fetch user data. Please try again later.');
      console.error('Failed to fetch user data:', error);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prevUser => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (user.password && user.password !== user.confirmPassword) {
        setPasswordError('Passwords do not match.');
        return;
    }

    const updateData: any = { username: user.username, email: user.email };
    if (user.password) {
      updateData.password = user.password;
    }

    try {
      await updateUser(userId, updateData);
      setIsEditing(false);
      fetchUserData();
    } catch (error) {
      console.error('Failed to update user data:', error);
      setError('Failed to update user data. Please try again later.');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">User Profile</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block mb-1">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={user.username}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded text-gray-900"
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded text-gray-900"
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={user.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded text-gray-900"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block mb-1">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={user.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded text-gray-900"
            />
          </div>
          {passwordError && (
            <div className="text-red-500 mt-2">{passwordError}</div>
          )}
          <div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
              Save
            </button>
            <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-300 px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <button onClick={() => setIsEditing(true)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
}
