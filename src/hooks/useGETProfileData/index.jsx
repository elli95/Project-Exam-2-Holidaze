import usePostApiKey from "../usePostApiKey";
import { API_PROFILES } from "../../shared/apis";
import { useEffect, useState } from "react";
import useLocalStorage from "../useLocalStorage";

function useGETProfileData() {
  const { apiKey } = usePostApiKey();
  const { accessToken, userInfo } = useLocalStorage();
  const [profileData, setProfileData] = useState({});

  useEffect(() => {
    if (apiKey.key !== undefined && accessToken.length > 0) {
      //   console.log("apiKey--2", apiKey);
      //   console.log("accessToken--2", accessToken);
      // Fetch data from an API
      fetch(API_PROFILES + "/" + userInfo.name + "/?_bookings=true&_venues=true", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": apiKey.key,
        },
      })
        .then((response) => response.json())
        .then((data) => setProfileData(data.data))
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, [userInfo.name, apiKey.key, accessToken]);
  //   console.log("profileData", profileData);

  //   const isNotEmpty = Object.keys(profileData).length !== 0;
  //   const profileDataInfo = profileData !== null && profileData !== undefined && isNotEmpty;
  //   console.log("----profileDataInfo----22", profileDataInfo, isNotEmpty, profileData);

  //   console.log("----profileDataInfo----22", profileDataInfo, isEmpty, profileData);

  //   if (profileDataInfo) {
  return { profileData };
  //   }
}

export default useGETProfileData;
