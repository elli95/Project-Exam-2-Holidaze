import { useEffect, useState } from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import { API_KEY_URL } from "../../shared/apis";

function usePostApiKey() {
  const [apiKey, setApiKey] = useState([]);
  const accessToken = useLocalStorage();

  console.log("accessToken.accessToken", accessToken.accessToken);
  useEffect(() => {
    if (accessToken.accessToken.length > 0) {
      async function fetchApiKey() {
        try {
          const response = await fetch(API_KEY_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken.accessToken}`,
            },
            body: JSON.stringify({ name: "API Key" }),
          });
          console.log("response:", response);
          if (!response.ok) {
            console.error("Error:", response.error[0].message);
          } else {
            const data = await response.json();
            setApiKey(data.data);
          }
        } catch (error) {
          console.error("Error fetching API key:", error);
        }
      }
      fetchApiKey();
    }
  }, [accessToken.accessToken]);

  return { apiKey };
}

export default usePostApiKey;
