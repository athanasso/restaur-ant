'use client';

import { useState, useEffect } from 'react';
import { getReviewsAsAdmin, createReviewAsAdmin, updateReviewAsAdmin, deleteReviewAsAdmin, _getRestaurants, _getUsers } from '@/lib/api';
import { Review } from '@/types';
import Pagination from '../Pagination';

export default function ReviewManager() {
  const [reviews, setReviews] = useState<{restaurant: any; user: any; id: number, rating: number, comment: string, userId: number, restaurantId: number}[]>([]);
  const [users, setUsers] = useState<{ id: number, username: string }[]>([]);
  const [restaurants, setRestaurants] = useState<{ id: number, name: string }[]>([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '', userId: 0, restaurantId: 0 });
  const [editingReview, setEditingReview] = useState<{ id: number | null, rating: number, comment: string, userId: number, restaurantId: number } | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(3);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchReviews = async () => {
      const data = await getReviewsAsAdmin(currentPage, pageSize);
      setReviews(data.items);
      setTotalPages(Math.ceil(data.totalCount / pageSize));
    };

    fetchReviews();
    fetchUsers();
    fetchRestaurants();
  }, [currentPage, pageSize]);

  const fetchReviews = async () => {
    try {
      const response = await getReviewsAsAdmin(currentPage, pageSize);
      setReviews(response.items);
      setTotalPages(response.pageCount);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await _getUsers();
      setUsers(data.items);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const data = await _getRestaurants();
      setRestaurants(data.items);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
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
       <ul className="space-y-4">
        {reviews.map((review) => (
          <li key={review.id} className="border border-gray-300 rounded-lg p-4 flex items-center justify-between">
            {editingReview && editingReview.id === review.id ? (
              <form onSubmit={handleUpdateReview} className="flex flex-col space-y-2 w-full">
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={editingReview.rating}
                  onChange={(e) => setEditingReview({ ...editingReview, rating: parseInt(e.target.value) })}
                  placeholder="Edit rating (1-5)"
                  className="w-16 p-2 border border-gray-300 rounded text-gray-900"
                />
                <input
                  value={editingReview.comment}
                  onChange={(e) => setEditingReview({ ...editingReview, comment: e.target.value })}
                  placeholder="Edit comment"
                  className="flex-grow p-2 border border-gray-300 rounded text-gray-900"
                />
                <select
                  value={editingReview.userId}
                  onChange={(e) => setEditingReview({ ...editingReview, userId: parseInt(e.target.value) })}
                  className="p-2 border border-gray-300 rounded text-gray-900"
                >
                  <option value="0">Select User</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.username}</option>
                  ))}
                </select>
                <select
                  value={editingReview.restaurantId}
                  onChange={(e) => setEditingReview({ ...editingReview, restaurantId: parseInt(e.target.value) })}
                  className="p-2 border border-gray-300 rounded text-gray-900"
                >
                  <option value="0">Select Restaurant</option>
                  {restaurants.map(restaurant => (
                    <option key={restaurant.id} value={restaurant.id}>{restaurant.name}</option>
                  ))}
                </select>
                <div className="flex space-x-2">
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
                  <button type="button" onClick={() => setEditingReview(null)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                </div>
              </form>
            ) : (
              <div className="flex items-center justify-between w-full">
                <span className="flex-grow">Rating: {review.rating}, Comment: {review.comment}, User: {String(users.find(user => user.id === review.user.id)?.username)}, Restaurant: {String(restaurants.find(restaurant => restaurant.id === review.restaurant.id)?.name)}</span>
                <div className="flex space-x-2">
                  <button onClick={() => setEditingReview(review)} className="bg-yellow-500 text-white px-4 py-2 rounded">Edit</button>
                  <button onClick={() => handleDeleteReview(review.id)} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
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
