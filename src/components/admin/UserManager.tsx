'use client';

import { useState, useEffect, useCallback } from 'react';
import { getUsersAsAdmin, createUserAsAdmin, updateUserAsAdmin, deleteUserAsAdmin } from '@/lib/api';

export default function UserManager() {
  const [users, setUsers] = useState<{ id: number, username: string, role: string }[]>([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user' });
  const [editingUser, setEditingUser] = useState<{ id: number | null, username: string, role: string } | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(3);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await getUsersAsAdmin(currentPage, pageSize);
      setUsers(response.items);
      setTotalPages(response.pageCount);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
        await updateUserAsAdmin(editingUser.id, {
          username: editingUser.username,
          role: editingUser.role,
        });
      }
      setEditingUser(null);
      fetchUsers();
    }
  };

  const handleDeleteUser = async (id: number) => {
    await deleteUserAsAdmin(id);
    fetchUsers();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Users</h2>
      
      {/* Create User Form */}
      <form onSubmit={handleCreateUser} className="mb-6">
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            placeholder="Enter username"
            className="flex-1 p-2 border border-gray-300 rounded text-gray-900"
          />
          <input
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            placeholder="Enter password"
            className="flex-1 p-2 border border-gray-300 rounded text-gray-900"
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="p-2 border border-gray-300 rounded text-gray-900"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Add User</button>
        </div>
      </form>

      {/* User List */}
      <ul className="space-y-4">
        {users.map((user) => (
          <li key={user.id} className="border border-gray-300 rounded-lg p-4 flex items-center justify-between">
            {editingUser && editingUser.id === user.id ? (
              <form onSubmit={handleUpdateUser} className="flex flex-col space-y-2 w-full">
                <input
                  type="text"
                  value={editingUser.username}
                  onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                  placeholder="Edit username"
                  className="p-2 border border-gray-300 rounded text-gray-900"
                />
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="p-2 border border-gray-300 rounded text-gray-900"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <div className="flex space-x-2">
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
                  <button type="button" onClick={() => setEditingUser(null)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div>
                  <div className="text-lg font-semibold">{user.username}</div>
                  <div className="text-gray-600">{user.role}</div>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => setEditingUser(user)} className="bg-yellow-500 text-white px-4 py-2 rounded">Edit</button>
                  <button onClick={() => handleDeleteUser(user.id)} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <div>
          <label htmlFor="pageSize" className="mr-2">Users per page:</label>
          <select id="pageSize" value={pageSize} onChange={handlePageSizeChange} className="border border-gray-300 p-2 rounded text-gray-900">
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
        <div>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="mx-1 px-3 py-1 rounded bg-gray-300 text-gray-700 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="mx-2">{`Page ${currentPage} of ${totalPages}`}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="mx-1 px-3 py-1 rounded bg-gray-300 text-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
