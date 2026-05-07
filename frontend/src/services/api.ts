import axios from 'axios';

// Update with your production URL if needed
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface TravelRequestPayload {
  destination: string;
  days: number;
  budget: string;
  preferences: string[];
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: string[];
}

export interface HotelRecommendation {
  name: string;
  category: string;
  price_range: string;
  highlights: string[];
}

export interface TravelResponse {
  destination: string;
  itinerary: ItineraryDay[];
  hotels: HotelRecommendation[];
  budget_estimate: string;
  experience_description: string;
  images: string[];
  tips: string[];
}

export const generateExperience = async (payload: TravelRequestPayload): Promise<TravelResponse> => {
  const response = await apiClient.post<TravelResponse>('/generate-experience', payload);
  return response.data;
};
