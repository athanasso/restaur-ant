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

export const createReview = async (restaurantId: number, review: { rating: number; comment: string, userId: number }) => {
  try {
    const response = await axios.post(`${API_URL}/restaurants/${restaurantId}/reviews`, review);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create review');
  }
};

export const updateReview = async (restaurantId: number, reviewId: number, review: { rating: number; comment: string }, userId: number) => {
  try {
    const response = await axios.put(`${API_URL}/restaurants/${restaurantId}/reviews/${reviewId}/${userId}`, review);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update review');
  }
};

export const deleteReview = async (restaurantId: number, reviewId: number, userId: number) => {
  try {
    await axios.delete(`${API_URL}/restaurants/${restaurantId}/reviews/${reviewId}/${userId}`);
  } catch (error) {
    throw new Error('Failed to delete review');
  }
};

export const getUserReview = async (restaurantId: number, userId: number) => {
  try {
    const response = await axios.get(`${API_URL}/restaurants/${restaurantId}/reviews/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user review');
  }
};