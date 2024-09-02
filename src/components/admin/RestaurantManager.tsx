'use client';

import { useState, useEffect, useCallback } from 'react';
import { getRestaurants, createRestaurantAsAdmin, updateRestaurantAsAdmin, deleteRestaurantAsAdmin } from '@/lib/api';
import Pagination from '../Pagination';

export default function RestaurantManager() {
  const [restaurants, setRestaurants] = useState<{ id: number, name: string, phoneNumber: string, address: string }[]>([]);
  const [newRestaurant, setNewRestaurant] = useState({ name: '', phoneNumber: '', address: '' });
  const [editingRestaurant, setEditingRestaurant] = useState<{ id: number, name: string, phoneNumber: string, address: string } | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(3);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchRestaurants = useCallback(async () => {
    try {
      const response = await getRestaurants(currentPage, pageSize);
      setRestaurants(response.items);
      setTotalPages(response.pageCount);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const handleCreateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();

    await createRestaurantAsAdmin(newRestaurant);
    setNewRestaurant({ name: '', phoneNumber: '', address: '' });
    fetchRestaurants();
  };

  const handleUpdateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingRestaurant) {
      await updateRestaurantAsAdmin(editingRestaurant.id, {
        ...editingRestaurant
      });
      setEditingRestaurant(null);
      fetchRestaurants();
    }
  };

  const handleDeleteRestaurant = async (id: number) => {
    await deleteRestaurantAsAdmin(id);
    fetchRestaurants();
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
      <h2 className="text-xl font-bold mb-4">Manage Restaurants</h2>
      
      {/* Create Restaurant Form */}
      <form onSubmit={handleCreateRestaurant} className="mb-6">
        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            value={newRestaurant.name}
            onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
            placeholder="Enter restaurant name"
            className="flex-1 p-2 border border-gray-300 rounded text-gray-900"
          />
          <input
            type="text"
            value={newRestaurant.phoneNumber}
            onChange={(e) => setNewRestaurant({ ...newRestaurant, phoneNumber: e.target.value })}
            placeholder="Enter phone number"
            className="flex-1 p-2 border border-gray-300 rounded text-gray-900"
          />
          <input
            type="text"
            value={newRestaurant.address}
            onChange={(e) => setNewRestaurant({ ...newRestaurant, address: e.target.value })}
            placeholder="Enter address"
            className="flex-1 p-2 border border-gray-300 rounded text-gray-900"
          />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Add Restaurant</button>
        </div>
      </form>

      {/* Restaurant List */}
      <ul className="space-y-4">
        {restaurants.map((restaurant) => (
          <li key={restaurant.id} className="border border-gray-300 rounded-lg p-4 flex items-center justify-between">
            {editingRestaurant && editingRestaurant.id === restaurant.id ? (
              <form onSubmit={handleUpdateRestaurant} className="flex flex-col space-y-2 w-full">
                <input
                  type="text"
                  value={editingRestaurant.name}
                  onChange={(e) => setEditingRestaurant({ ...editingRestaurant, name: e.target.value })}
                  placeholder="Edit restaurant name"
                  className="p-2 border border-gray-300 rounded text-gray-900"
                />
                <input
                  type="text"
                  value={editingRestaurant.phoneNumber}
                  onChange={(e) => setEditingRestaurant({ ...editingRestaurant, phoneNumber: e.target.value })}
                  placeholder="Edit phone number"
                  className="p-2 border border-gray-300 rounded text-gray-900"
                />
                <input
                  type="text"
                  value={editingRestaurant.address}
                  onChange={(e) => setEditingRestaurant({ ...editingRestaurant, address: e.target.value })}
                  placeholder="Edit address"
                  className="p-2 border border-gray-300 rounded text-gray-900"
                />
                <div className="flex space-x-2">
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
                  <button type="button" onClick={() => setEditingRestaurant(null)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between w-full">
                <div>
                  <div className="text-lg font-semibold">{restaurant.name}</div>
                  <div className="text-gray-600">{restaurant.phoneNumber}</div>
                  <div className="text-gray-600">{restaurant.address}</div>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => setEditingRestaurant(restaurant)} className="bg-yellow-500 text-white px-4 py-2 rounded">Edit</button>
                  <button onClick={() => handleDeleteRestaurant(restaurant.id)} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
