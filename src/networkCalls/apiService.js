// apiService.js

const makeApiCall = async (url, method = 'GET', params = {}, headers = {}, body = null) => {
    // Construct query parameters
    const queryParams = new URLSearchParams(params).toString();
    const fullUrl = queryParams ? `${url}?${queryParams}` : url;
  
    // Set up request options
    const options = {
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : null,
    };

    // Log the options
    console.log("Full URL: ", fullUrl);
    console.log('Request Options:', options);

    try {
      const response = await fetch(fullUrl, options);
      
      console.log("Response:", response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if responseBody is empty
      const responseBody = await response.text();
      
      if (!responseBody) {
        return {}; // or return null, depending on your use case
      }

      return JSON.parse(responseBody);
    } catch (error) {
      console.error('Error making API call:', error);
      throw error;
    }
  };

export { makeApiCall };