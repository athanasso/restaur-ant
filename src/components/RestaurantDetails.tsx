import { Restaurant } from '@/types'
import ClientReviewForm from './ClientReviewForm'

interface Props {
  restaurant: Restaurant
}

export default function RestaurantDetails({ restaurant }: Props) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{restaurant.name}</h1>
      <p className="text-xl mb-4">Average Rating: {restaurant.averageRating}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Reviews</h2>
      <div className="space-y-4">
        {restaurant.reviews.map((review) => (
          <div key={review.id} className="border p-4 rounded-lg">
            <p className="font-medium">Rating: {review.rating} / 5</p>
            <p className="text-gray-600">Date: {new Date(review.visitDate).toLocaleDateString()}</p>
            <p className="mt-2">{review.comment}</p>
          </div>
        ))}
      </div>

      <ClientReviewForm restaurantId={restaurant.id} />
    </div>
  )
}