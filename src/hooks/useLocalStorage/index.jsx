import { useEffect, useState } from "react";

function useLocalStorage() {
  const [accessToken, setAccessToken] = useState([]);
  const [userInfo, setUserInfo] = useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      setAccessToken(accessToken);
    }
  }, []);

  useEffect(() => {
    const userProfile = localStorage.getItem("profile");
    const userInfo = JSON.parse(userProfile);
    if (userInfo) {
      setUserInfo(userInfo);
    }
  }, []);

  const clearLocalStorage = () => {
    localStorage.clear();
  };

  return { accessToken, userInfo, clearLocalStorage };
}

export default useLocalStorage;
