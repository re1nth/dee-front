// authService.js

import makeApiCall from './apiService';

const loginUser = async (username, password) => {
  const url = 'http://localhost:9000/api/v1/auth';
  const method = 'POST';
  const headers = {
    'Content-Type': 'application/json',
  };
  
  const body = {
    username,
    password,
    type: 'normal', // Include the type field
  };

  try {
    const response = await makeApiCall(url, method, {}, headers, body);
    return response;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export default loginUser;