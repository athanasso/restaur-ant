'use client';

import Link from 'next/link'
import { getRestaurants } from '@/lib/api'
import { Restaurant } from '@/types'
import { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchRestaurants = async () => {
      const data = await getRestaurants()
      setRestaurants(data)
    }
    fetchRestaurants()
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Restaurants</h2>
      <ul className="space-y-4">
        {restaurants.map((restaurant: Restaurant) => (
          <li key={restaurant.id} className="border p-4 rounded-lg">
             {isAuthenticated ? (
              <Link href={`/restaurants/${restaurant.id}`}>
                <h3 className="text-xl font-medium">{restaurant.name}</h3>
                <p>Average Rating: {restaurant.averageRating}</p>
              </Link>
             ) : (
              <div>
                <h3 className="text-xl font-medium">{restaurant.name}</h3>
                <p>Average Rating: {restaurant.averageRating}</p>
                <p className="text-blue-500 mt-2">Login to view details and leave a review</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}