/**
 * Custom hook for making API calls.
 * @returns {Function} An asynchronous function that makes an API call.
 * @param {string} url - The URL of the API endpoint.
 * @param {string} method - The HTTP method for the request (e.g., "GET", "POST", "PUT", "DELETE").
 * @param {Object} headers - The headers for the request.
 * @param {Object} [body=null] - The request body data (optional).
 * @throws {Error} Throws an error if the API call encounters an error.
 * @returns {Object} The response data from the API call.
 */
function useApiCall() {
  return async function (url, method, headers, body = null) {
    try {
      const options = {
        method: method,
        headers: headers,
      };

      if (body !== null) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(url, options);

      if (response.ok) {
        if (response.status !== 204) {
          const text = await response.text();
          if (text.length) {
            const data = JSON.parse(text);
            return data;
          }
        } else {
          //console.log("Api call was successful!");
        }
      } else {
        const text = await response.text();
        if (text.length) {
          const data = JSON.parse(text);
          console.log("Error:", data.errors[0].message);
          return data;
        }
      }
    } catch (error) {
      console.error("An error has occurred:", error);
    }
  };
}

export default useApiCall;
