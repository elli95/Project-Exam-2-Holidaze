import { useEffect, useState } from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import { API_KEY_URL } from "../../shared/apis";
import useApiCall from "../useApiCall";

function usePostApiKey() {
  const [apiKey, setApiKey] = useState([]);
  const accessToken = useLocalStorage();
  const apiCall = useApiCall();

  useEffect(() => {
    if (accessToken.accessToken.length > 0) {
      apiCall(
        API_KEY_URL,
        "POST",
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken.accessToken}`,
        },
        { name: "API Key" }
      )
        .then((data) => {
          setApiKey(data.data);
        })
        .catch((error) => {
          console.error("Error:", error.message);
        });

      // fetch(API_KEY_URL, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${accessToken.accessToken}`,
      //   },
      //   body: JSON.stringify({ name: "API Key" }),
      // })
      //   .then((response) => {
      //     if (!response.ok) {
      //       console.log("error", response);
      //     }
      //     return response.json();
      //   })
      //   .then((data) => {
      //     // Handle the response (e.g., update state, show a success message, etc.)
      //     console.log("Response:", data);
      //     setApiKey(data.data);
      //   })
      //   .catch((error) => {
      //     // Handle errors (e.g., show an error message)
      //     console.error("Error:", error.message);
      //   });
    }
  }, [accessToken.accessToken, apiCall]);

  return { apiKey };
}

export default usePostApiKey;
