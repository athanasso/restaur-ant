import axios from './axios';

const API_URL = process.env.HOST || 'http://localhost:3000';

export const getRestaurants = async () => {
  try {
    const response = await axios.get(`${API_URL}/restaurants`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch restaurants', error);
    throw new Error('Failed to fetch restaurants');
  }
};

export const getRestaurantDetails = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/restaurants/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch restaurant details');
  }
};

export const createReview = async (restaurantId: string, review: { rating: number; comment: string }) => {
  try {
    const response = await axios.post(`${API_URL}/restaurants/${restaurantId}/reviews`, review);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create review');
  }
};