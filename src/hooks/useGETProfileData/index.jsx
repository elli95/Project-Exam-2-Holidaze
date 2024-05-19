import usePostApiKey from "../usePostApiKey";
import { API_PROFILES } from "../../shared/apis";
import { useEffect, useState } from "react";
import useLocalStorage from "../useLocalStorage";
import useApiCall from "../useApiCall";

function useGETProfileData() {
  const { apiKey } = usePostApiKey();
  const { accessToken, userInfo } = useLocalStorage();
  const [profileData, setProfileData] = useState({});
  const apiCall = useApiCall();

  useEffect(() => {
    if (apiKey.key !== undefined && accessToken.length > 0) {
      apiCall(API_PROFILES + "/" + userInfo.name + "/?_bookings=true&_venues=true", "GET", {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey.key,
      })
        .then((data) => setProfileData(data.data))
        .catch((error) => console.error("Error fetching data:", error));
      // Samme Kode!!
    }
  }, [userInfo.name, apiKey.key, accessToken]);

  return { profileData, setProfileData };
}

export default useGETProfileData;
