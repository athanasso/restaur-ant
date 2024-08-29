'use client';

import { useState, useEffect } from 'react';
import { Review } from '@/types';
import { createReview, updateReview } from '@/lib/api';

interface Props {
  restaurantId: number;
  onSubmit: (review: Review) => void;
  initialReview?: Review;
}

export default function ClientReviewForm({ restaurantId, onSubmit, initialReview }: Props) {
  const [rating, setRating] = useState(initialReview?.rating || 5);
  const [comment, setComment] = useState(initialReview?.comment || '');
  const userId = parseInt(localStorage.getItem('userId') || '');

  useEffect(() => {
    if (initialReview) {
      setRating(initialReview.rating);
      setComment(initialReview.comment);
    }
  }, [initialReview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let review;
      if (initialReview) {
        review = await updateReview(restaurantId, initialReview.id, { rating, comment }, userId);
      } else {
        review = await createReview(restaurantId, { rating, comment, userId });
      }
      onSubmit(review);
      setRating(5);
      setComment('');
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <h3 className="text-xl font-semibold mb-4">
        {initialReview ? 'Edit Your Review' : 'Leave a Review'}
      </h3>
      <div className="mb-4">
        <label htmlFor="rating" className="block mb-1">Rating:</label>
        <input
          type="number"
          id="rating"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          required
          className="border rounded p-2 text-gray-900"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="comment" className="block mb-1">Comment:</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border rounded p-2 w-full text-gray-900"
          rows={4}
        ></textarea>
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        {initialReview ? 'Update Review' : 'Submit Review'}
      </button>
    </form>
  );
}