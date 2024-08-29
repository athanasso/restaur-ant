'use client';

import { useState, useEffect } from 'react';
import { getUsersAsAdmin, createUserAsAdmin, updateUserAsAdmin, deleteUserAsAdmin } from '@/lib/api';

export default function UserManager() {
  const [users, setUsers] = useState<{ id: number, username: string, role: string }[]>([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user' });
  const [editingUser, setEditingUser] = useState<{ id: number | null, username: string, role: string } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const data = await getUsersAsAdmin();
    setUsers(data);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    await createUserAsAdmin(newUser);
    setNewUser({ username: '', password: '', role: 'user' });
    fetchUsers();
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      if (editingUser.id !== null) {
        await updateUserAsAdmin(editingUser.id, { username: editingUser.username, role: editingUser.role });
      }
      setEditingUser(null);
      fetchUsers();
    }
  };

  const handleDeleteUser = async (id: number) => {
    await deleteUserAsAdmin(id);
    fetchUsers();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Manage Users</h2>
      
      {/* Create User Form */}
      <form onSubmit={handleCreateUser} className="mb-4">
        <input
          type="text"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          placeholder="Enter username"
          className="mr-2 p-2 border text-gray-900"
        />
        <input
          type="password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          placeholder="Enter password"
          className="mr-2 p-2 border text-gray-900"
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          className="mr-2 p-2 border text-gray-900"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="bg-green-500 text-white px-4 py-2">Add User</button>
      </form>

      {/* User List */}
      <ul>
        {users.map((user) => (
          <li key={user.id} className="mb-2">
            {editingUser && editingUser.id === user.id ? (
              <form onSubmit={handleUpdateUser} className="flex">
                <input
                  type="text"
                  value={editingUser.username}
                  onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                  placeholder="Edit username"
                  className="mr-2 p-2 border text-gray-900"
                />
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="mr-2 p-2 border text-gray-900"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 mr-2">Save</button>
                <button onClick={() => setEditingUser(null)} className="bg-gray-500 text-white px-4 py-2">Cancel</button>
              </form>
            ) : (
              <div className="flex items-center">
                <span className="mr-2">{user.username} - {user.role}</span>
                <button onClick={() => setEditingUser(user)} className="bg-yellow-500 text-white px-4 py-2 mr-2">Edit</button>
                <button onClick={() => handleDeleteUser(user.id)} className="bg-red-500 text-white px-4 py-2">Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
