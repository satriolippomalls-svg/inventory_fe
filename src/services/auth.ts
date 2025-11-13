import api from './api';
import { API_ENDPOINTS } from './endpoints';

export const login = async (email: string, password_hash: string) => {
  try {
    const response = await api.post(API_ENDPOINTS.login, { email, password_hash });

    console.log("response", response.data);
    
    if (response.status === 200 || response.status === 201) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error: ", error);
    return null;
  }
};
