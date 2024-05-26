import { useEffect, useState } from "react";

/**
 * Custom hook to interact with local storage for storing access token and user info.
 * @returns {{
 *  accessToken: string | null,
 *  userInfo: Object | null,
 *  clearLocalStorage: Function
 * }} An object containing access token, user info, and a function to clear local storage.
 */
function useLocalStorage() {
  const [accessToken, setAccessToken] = useState([]);
  const [userInfo, setUserInfo] = useState([]);

  // Effect to retrieve access token from local storage
  useEffect(() => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      setAccessToken(accessToken);
    }
  }, []);

  // Effect to retrieve user info from local storage
  useEffect(() => {
    const userProfile = localStorage.getItem("profile");
    const userInfo = JSON.parse(userProfile);
    if (userInfo) {
      setUserInfo(userInfo);
    }
  }, []);

  // Function to clear local storage
  const clearLocalStorage = () => {
    localStorage.clear();
  };

  return { accessToken, userInfo, clearLocalStorage };
}

export default useLocalStorage;
