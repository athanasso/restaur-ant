'use client';

import { useState } from 'react'
import { createReview } from '@/lib/api'

interface Props {
  restaurantId: string
}

export default function ClientReviewForm({ restaurantId }: Props) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createReview(restaurantId, { rating, comment })
    // Reset form and refresh reviews
    setRating(5)
    setComment('')
    // You might want to add some way to refresh the reviews after submission
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Leave a Review</h3>
      <div className="mb-4">
        <label htmlFor="rating" className="block mb-2">Rating:</label>
        <input
          type="number"
          id="rating"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border rounded p-2 text-gray-900"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="comment" className="block mb-2">Comment:</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border rounded p-2 w-full text-gray-900"
          rows={4}
        ></textarea>
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Submit Review
      </button>
    </form>
  )
}