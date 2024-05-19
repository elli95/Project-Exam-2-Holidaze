// import { useState } from "react";

function useApiCall() {
  // const [errorMessage, setErrorMessage] = useState("");
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

      // const data = await response.json();

      if (response.ok) {
        if (response.status !== 204) {
          const text = await response.text();
          if (text.length) {
            const data = JSON.parse(text);
            console.log("Api call was successful!", data);
            return data;
          }
        } else {
          console.log("Api call was successful!");
        }
      } else {
        const text = await response.text();
        if (text.length) {
          const data = JSON.parse(text);
          console.log("Error:", data.errors[0].message);
          // setErrorMessage("There was an error: " + data.errors[0].message);
          return data;
        }
      }
    } catch (error) {
      console.error("An error has occurred:", error);
    }
  };
}

export default useApiCall;
