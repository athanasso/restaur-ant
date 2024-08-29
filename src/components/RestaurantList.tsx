'use client';

import Link from 'next/link';
import { getRestaurants } from '@/lib/api';
import { Restaurant } from '@/types';
import { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(3);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await getRestaurants(currentPage, pageSize);
        setRestaurants(response.items);
        setTotalPages(response.pageCount);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };
    fetchRestaurants();
  }, [currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Restaurants</h2>

      {/* Page Size Selector */}
      <div className="mb-4">
        <label htmlFor="pageSize" className="mr-2">Restaurants per page:</label>
        <select id="pageSize" value={pageSize} onChange={handlePageSizeChange} className="border p-2 rounded text-gray-900">
          <option value={3}>3</option>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (page: number) => void }) {
  const handleClick = (page: number) => {
    onPageChange(page);
  };

  return (
    <div className="flex justify-center mt-4">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => handleClick(i + 1)}
          className={`mx-1 px-3 py-1 rounded ${i + 1 === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-400'}`}
          disabled={i + 1 === currentPage}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
