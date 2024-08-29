'use client';

import { useState, useEffect } from 'react';
import { getRestaurants, createRestaurantAsAdmin, updateRestaurantAsAdmin, deleteRestaurantAsAdmin } from '@/lib/api';

export default function RestaurantManager() {
  const [restaurants, setRestaurants] = useState<{ id: number, name: string, phoneNumber: string, address: string }[]>([]);
  const [newRestaurant, setNewRestaurant] = useState({ name: '', phoneNumber: '', address: '' });
  const [editingRestaurant, setEditingRestaurant] = useState<{ id: number, name: string, phoneNumber: string, address: string } | null>(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    const data = await getRestaurants();
    setRestaurants(data);
  };

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

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Manage Restaurants</h2>
      
      {/* Create Restaurant Form */}
      <form onSubmit={handleCreateRestaurant} className="mb-4">
        <input
          type="text"
          value={newRestaurant.name}
          onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
          placeholder="Enter restaurant name"
          className="mr-2 p-2 border text-gray-900"
        />
        <input
          type="text"
          value={newRestaurant.phoneNumber}
          onChange={(e) => setNewRestaurant({ ...newRestaurant, phoneNumber: e.target.value })}
          placeholder="Enter phone number"
          className="mr-2 p-2 border text-gray-900"
        />
        <input
          type="text"
          value={newRestaurant.address}
          onChange={(e) => setNewRestaurant({ ...newRestaurant, address: e.target.value })}
          placeholder="Enter address"
          className="mr-2 p-2 border text-gray-900"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2">Add Restaurant</button>
      </form>

      {/* Restaurant List */}
      <ul>
        {restaurants.map((restaurant) => (
          <li key={restaurant.id} className="mb-2">
            {editingRestaurant && editingRestaurant.id === restaurant.id ? (
              <form onSubmit={handleUpdateRestaurant} className="flex flex-col">
                <input
                  type="text"
                  value={editingRestaurant.name}
                  onChange={(e) => setEditingRestaurant({ ...editingRestaurant, name: e.target.value })}
                  placeholder="Edit restaurant name"
                  className="mb-2 p-2 border text-gray-900"
                />
                <input
                  type="text"
                  value={editingRestaurant.phoneNumber}
                  onChange={(e) => setEditingRestaurant({ ...editingRestaurant, phoneNumber: e.target.value })}
                  placeholder="Edit phone number"
                  className="mb-2 p-2 border text-gray-900"
                />
                <input
                  type="text"
                  value={editingRestaurant.address}
                  onChange={(e) => setEditingRestaurant({ ...editingRestaurant, address: e.target.value })}
                  placeholder="Edit address"
                  className="mb-2 p-2 border text-gray-900"
                />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 mr-2">Save</button>
                <button onClick={() => setEditingRestaurant(null)} className="bg-gray-500 text-white px-4 py-2">Cancel</button>
              </form>
            ) : (
              <div className="flex items-center">
                <span className="mr-2">{restaurant.name}</span>
                <button onClick={() => setEditingRestaurant(restaurant)} className="bg-yellow-500 text-white px-4 py-2 mr-2">Edit</button>
                <button onClick={() => handleDeleteRestaurant(restaurant.id)} className="bg-red-500 text-white px-4 py-2">Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
