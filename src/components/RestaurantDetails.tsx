'use client';

import { useState, useEffect } from 'react';
import { Restaurant, Review } from '@/types';
import ClientReviewForm from './ClientReviewForm';
import { deleteReview, updateReview } from '@/lib/api';
import { useSession } from 'next-auth/react';

interface Props {
  restaurant: Restaurant;
}

export default function RestaurantDetails({ restaurant }: Props) {
  const [reviews, setReviews] = useState<Review[]>(restaurant.reviews);
  const [userReview, setUserReview] = useState<Review | undefined>(undefined);
  const data = useSession();
  const userId = Number(data?.data?.user?.id) || 0;

  useEffect(() => {
    if (userId) {
      const existingReview = reviews.find(review => review.user?.id === userId);
      setUserReview(existingReview || undefined);
    }
  }, [reviews, userId]);

  const handleReviewSubmit = (newReview: Review) => {
    setReviews([...reviews, newReview]);
    setUserReview(newReview);
  };

  const handleReviewUpdate = async (updatedReview: Review) => {
    try {
      await updateReview(restaurant.id, updatedReview.id, updatedReview, userId);
      setReviews(reviews.map(review => review.id === updatedReview.id ? updatedReview : review));
      setUserReview(updatedReview);
    } catch (error) {
      console.error('Failed to update review:', error);
    }
  };

  const handleReviewDelete = async (reviewId: number) => {
    try {
      await deleteReview(restaurant.id, reviewId, userId);
      setReviews(reviews.filter(review => review.id !== reviewId));
      setUserReview(undefined);
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{restaurant.name}</h1>
      <p className="text-xl mb-4">Average Rating: {restaurant.averageRating}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Reviews</h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border p-4 rounded-lg">
            <p className="font-medium">Rating: {review.rating} / 5</p>
            <p className="text-gray-600">Date: {new Date(review.createdAt).toLocaleDateString()}</p>
            <p className="mt-2">{review.comment}</p>
            {userId && review.user?.id === userId && (
              <div className="mt-2">
                <button onClick={() => handleReviewDelete(review.id)} className="text-red-500 mr-2">Delete</button>
                <button onClick={() => setUserReview(review)} className="text-blue-500">Edit</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {userId && !userReview && (
        <ClientReviewForm restaurantId={restaurant.id} onSubmit={handleReviewSubmit} />
      )}
      {userId && userReview && (
        <ClientReviewForm
          restaurantId={restaurant.id}
          onSubmit={handleReviewUpdate}
          initialReview={userReview}
        />
      )}
    </div>
  );
}