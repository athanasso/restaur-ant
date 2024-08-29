import { Restaurant, Review } from '@/types';
import axios from './axios';

const API_URL = process.env.HOST || 'http://localhost:3000';

export const getRestaurants = async (page: number, take: number) => {
  try {
    const response = await axios.get(`${API_URL}/restaurants`, {
      params: { page, take },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch restaurants', error);
    throw new Error('Failed to fetch restaurants');
  }
};

export const _getRestaurants = async () => {
  const response = await axios.get(`${API_URL}/restaurants`);
  return response.data;
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

// Restaurant management
export const createRestaurantAsAdmin = async (restaurantData: { name: string; phoneNumber: string; address: string }) => {
  const response = await axios.post(`${API_URL}/restaurants`, restaurantData);
  return response.data;
};

export const updateRestaurantAsAdmin = async (id: number, restaurantData: { name: string; phoneNumber: string; address: string;}) => {
  const response = await axios.put(`${API_URL}/restaurants/${id}`, restaurantData);
  return response.data;
};

export const deleteRestaurantAsAdmin = async (id: number) => {
  const response = await axios.delete(`${API_URL}/restaurants/${id}`);
  return response.data;
};

// User management
export const getUsersAsAdmin = async (page: number, take: number) => {
  const response = await axios.get(`${API_URL}/users`, {
    params: { page, take },
  });
  return response.data;
};

export const _getUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

export const updateUserAsAdmin = async (id: number, userData: { username: string, role: string}) => {
  const response = await axios.put(`${API_URL}/users/${id}`, userData);
  return response.data;
};

export const deleteUserAsAdmin = async (id: number) => {
  const response = await axios.delete(`${API_URL}/users/${id}`);
  return response.data;
};

export const createUserAsAdmin = async (userData: { username: string, role: string }) => {
  const response = await axios.post(`${API_URL}/users`, userData);
  return response.data;
};

// Review management
export const getReviewsAsAdmin = async (page: number, take: number) => {
  const response = await axios.get(`${API_URL}/reviews`, {
    params: { page, take },
  });
  return response.data;
};

export const updateReviewAsAdmin = async (id: number, reviewData: Review) => {
  console.log('reviewData', reviewData);
  const response = await axios.put(`${API_URL}/reviews/${id}`, reviewData);
  return response.data;
};

export const deleteReviewAsAdmin = async (id: number) => {
  const response = await axios.delete(`${API_URL}/reviews/${id}`);
  return response.data;
};

export const createReviewAsAdmin = async (reviewData: { rating: number, comment: string, userId: number }) => {
  const response = await axios.post(`${API_URL}/reviews`, reviewData);
  return response.data;
};