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
    // console.log("Full URL: ", fullUrl);
    // console.log('Request Options:', options);

    try {
      const response = await fetch(fullUrl, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.log('Error making API call:', error);
      console.error('Error making API call:', error);
      throw error;
    }
  };
  
  export default makeApiCall;