'use client';

import { useState, useEffect } from 'react';
import { getReviewsAsAdmin, createReviewAsAdmin, updateReviewAsAdmin, deleteReviewAsAdmin, getUsersAsAdmin, getRestaurants } from '@/lib/api';
import { Review } from '@/types';

export default function ReviewManager() {
  const [reviews, setReviews] = useState<{restaurant: any; user: any; id: number, rating: number, comment: string, userId: number, restaurantId: number}[]>([]);
  const [users, setUsers] = useState<{ id: number, username: string }[]>([]);
  const [restaurants, setRestaurants] = useState<{ id: number, name: string }[]>([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '', userId: 0, restaurantId: 0 });
  const [editingReview, setEditingReview] = useState<{ id: number | null, rating: number, comment: string, userId: number, restaurantId: number } | null>({ id: null, rating: 0, comment: '', userId: 0, restaurantId: 0 });

  useEffect(() => {
    fetchReviews();
    fetchUsers();
    fetchRestaurants();
  }, []);

  const fetchReviews = async () => {
    const data = await getReviewsAsAdmin();
    setReviews(data);
  };

  const fetchUsers = async () => {
    const data = await getUsersAsAdmin();
    setUsers(data);
  };

  const fetchRestaurants = async () => {
    const data = await getRestaurants();
    setRestaurants(data);
  };

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    await createReviewAsAdmin(newReview);
    setNewReview({ rating: 0, comment: '', userId: 0, restaurantId: 0 });
    fetchReviews();
  };

  const handleUpdateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingReview && editingReview.id !== null) {
      await updateReviewAsAdmin(editingReview.id, {
          ...editingReview,
      } as unknown as Review);
      setEditingReview(null);
      fetchReviews();
    }
  };

  const handleDeleteReview = async (id: number) => {
    await deleteReviewAsAdmin(id);
    fetchReviews();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Manage Reviews</h2>

      {/* Create Review Form */}
      <form onSubmit={handleCreateReview} className="mb-4">
        <input
          type="number"
          min="1"
          max="5"
          value={newReview.rating}
          onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
          placeholder="Enter rating (1-5)"
          className="mr-2 p-2 border w-16 text-gray-900"
        />
        <input
          value={newReview.comment}
          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
          placeholder="Enter comment"
          className="mr-2 p-2 border flex-grow text-gray-900"
        />
        <select
          value={newReview.userId}
          onChange={(e) => setNewReview({ ...newReview, userId: parseInt(e.target.value) })}
          className="mr-2 p-2 border text-gray-900"
        >
          <option value="0">Select User</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.username}</option>
          ))}
        </select>
        <select
          value={newReview.restaurantId}
          onChange={(e) => setNewReview({ ...newReview, restaurantId: parseInt(e.target.value) })}
          className="mr-2 p-2 border text-gray-900"
        >
          <option value="0">Select Restaurant</option>
          {restaurants.map(restaurant => (
            <option key={restaurant.id} value={restaurant.id}>{restaurant.name}</option>
          ))}
        </select>
        <button type="submit" className="bg-green-500 text-white px-4 py-2">Add Review</button>
      </form>

      {/* Review List */}
      <ul>
        {reviews.map((review) => (
          <li key={review.id} className="mb-2">
            {editingReview && editingReview.id === review.id ? (
              <form onSubmit={handleUpdateReview} className="flex">
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={editingReview.rating}
                  onChange={(e) => setEditingReview({ ...editingReview, rating: parseInt(e.target.value) })}
                  placeholder="Edit rating (1-5)"
                  className="mr-2 p-2 border w-16 text-gray-900"
                />
                <input
                  value={editingReview.comment}
                  onChange={(e) => setEditingReview({ ...editingReview, comment: e.target.value })}
                  placeholder="Edit comment"
                  className="mr-2 p-2 border flex-grow text-gray-900"
                />
                <select
                  value={editingReview.userId}
                  onChange={(e) => setEditingReview({ ...editingReview, userId: parseInt(e.target.value) })}
                  className="mr-2 p-2 border text-gray-900"
                >
                  <option value="0">Select User</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.username}</option>
                  ))}
                </select>
                <select
                  value={editingReview.restaurantId}
                  onChange={(e) => setEditingReview({ ...editingReview, restaurantId: parseInt(e.target.value) })}
                  className="mr-2 p-2 border text-gray-900"
                >
                  <option value="0">Select Restaurant</option>
                  {restaurants.map(restaurant => (
                    <option key={restaurant.id} value={restaurant.id}>{restaurant.name}</option>
                  ))}
                </select>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 mr-2">Save</button>
                <button onClick={() => setEditingReview(null)} className="bg-gray-500 text-white px-4 py-2">Cancel</button>
              </form>
            ) : (
              <div className="flex items-center">
                <span className="mr-2">Rating: {review.rating}, Comment: {review.comment}, User: {String(users.find(user => user.id === review.user.id)?.username)}, Restaurant: {String(restaurants.find(restaurant => restaurant.id === review.restaurant.id)?.name)}</span>
                <button onClick={() => setEditingReview(review)} className="bg-yellow-500 text-white px-4 py-2 mr-2">Edit</button>
                <button onClick={() => handleDeleteReview(review.id)} className="bg-red-500 text-white px-4 py-2">Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
