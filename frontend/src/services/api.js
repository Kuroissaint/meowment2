import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 5000,
});

// ✅ SEARCH API - EKSPORT FUNGSI INI
export const searchKucing = async (filters = {}) => {
    try {
      console.log('🔍 Searching kucing with filters:', filters);
      const response = await API.get('/kucing/search', { params: filters });
      console.log('✅ Search response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Search error:', error);
      throw error;
    }
  };
  
// Test function
export const testConnection = async () => {
  try {
    const response = await API.get('/test');
    return response.data;
  } catch (error) {
    console.error('Connection error:', error);
    throw error;
  }
};

export default API;