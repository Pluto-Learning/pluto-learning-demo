// api/auth.js
import { routes } from "@/utils/route"; // Ensure you have the routes set correctly
import apiClient from "./axiosInstancs";

// Function to handle user login
export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post(routes.login + '/Login', credentials); // Use your routes for the endpoint
    return response.data; // Return the response data
  } catch (error) {
    throw error; // Rethrow the error for handling in the calling component
  }
};

// Other authentication-related API functions can be added here
