import usePostApiKey from "../usePostApiKey";
import { API_PROFILES } from "../../shared/apis";
import { useEffect, useState } from "react";
import useLocalStorage from "../useLocalStorage";

/**
 * Custom hook to fetch profile data based on user information.
 * @returns {{
 *  profileData: Object,
 *  setProfileData: Function
 * }} An object containing profile data and a function to update profile data.
 */
function useGETProfileData() {
  const { apiKey } = usePostApiKey();
  const { accessToken, userInfo } = useLocalStorage();
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    if (apiKey.key !== undefined && accessToken.length > 0) {
      async function fetchApiKey() {
        try {
          const response = await fetch(API_PROFILES + "/" + userInfo.name + "/?_bookings=true&_venues=true", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
              "X-Noroff-API-Key": apiKey.key,
            },
          });
          console.log("response:", response);
          if (!response.ok) {
            console.error("Error:", response.error[0].message);
          } else {
            const data = await response.json();
            setProfileData(data.data);
          }
        } catch (error) {
          console.error("Error fetching API key:", error);
        }
      }
      fetchApiKey();
    }
  }, [userInfo.name, apiKey.key, accessToken]);

  return { profileData, setProfileData };
}

export default useGETProfileData;
