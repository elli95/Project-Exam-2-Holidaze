import { useEffect, useState } from "react";

function useLocalStorage() {
  const [accessToken, setAccessToken] = useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      setAccessToken(accessToken);
    }
  }, []);

  const clearLocalStorage = () => {
    localStorage.clear();
  };

  return { accessToken, clearLocalStorage };
}

export default useLocalStorage;
