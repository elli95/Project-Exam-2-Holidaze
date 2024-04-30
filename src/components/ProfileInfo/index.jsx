// import { useEffect, useState } from "react";
// import useLocalStorage from "../../hooks/useLocalStorage";
// import { API_KEY_URL, API_PROFILES } from "../../shared/apis";

function ProfileInfo() {
  // const [isLoading, setIsLoading] = useState(false);
  // const [isError, setIsError] = useState(false);
  // const accessToken = useLocalStorage(); // Use the custom hook to get the access token

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       setIsLoading(true);
  //       setIsError(false);
  //       console.log("accessToken", accessToken);
  //       // const response = await fetch(API_KEY_URL, {
  //       //   method: "POST",
  //       //   headers: {
  //       //     "Content-Type": "application/json",
  //       //     // Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicm9iaW5UZXN0IiwiZW1haWwiOiJyb2JpblRlc3RAc3R1ZC5ub3JvZmYubm8iLCJpYXQiOjE3MTQ0ODY2MjZ9.8PH2pzusEdlUUUh-_32skJFRdpbH6IkWQtpuhBilCOo`,
  //       //     // Authorization: `Bearer ${[accessToken]}`,
  //       //     Authorization: `Bearer ${accessToken}`,
  //       //   },
  //       //   body: JSON.stringify({ name: "My API Key name" }),
  //       // });
  //       // console.log("response", response);
  //       // const data = await response.json();
  //       // console.log("datadatadata", data);

  //       // Fetch profile data
  //       // const profileResponse = await fetch(API_PROFILES, {
  //       //   headers: {
  //       //     Authorization: `Bearer ${accessToken}`,
  //       //   },
  //       // });
  //       // const profileData = await profileResponse.json();
  //       // console.log("profile", profileData);

  //       // Fetch additional data from another API
  //       // const NOROFF_API_URL = "https://api.noroff.no";
  //       // const apiKey = { data: { key: "your-api-key" } }; // Replace with your actual API key
  //       // const options = {
  //       //   headers: {
  //       //     Authorization: `Bearer ${accessToken}`,
  //       //     "X-Noroff-API-Key": apiKey.data.key,
  //       //   },
  //       // };
  //       // const socialPostsResponse = await fetch(API_PROFILES, options);
  //       // const socialPostsData = await socialPostsResponse.json();
  //       // console.log("social posts", socialPostsData);

  //       // Handle your data as needed
  //       // ...
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       setIsError(true);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchProfile();
  // }, [accessToken]);

  // if (isLoading) {
  //   return <div className="loading"></div>;
  // }

  // if (isError) {
  //   return <div>Sorry, there was an error loading the product</div>;
  // }

  return <div>Your profile and social posts data will be displayed here.</div>;
}

export default ProfileInfo;

// import { useEffect, useState } from "react";
// import useLocalStorage from "../../hooks/useLocalStorage";
// import { API_PROFILES } from "../../shared/apis";

// // const localStorageData = localStorage.getItem("token");
// // // const accessToken = localStorageData.access_token;
// // console.log("accessToken", localStorageData);

// function ProfileInfo() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [isError, setIsError] = useState(false);
//   const accessToken = useLocalStorage(); // Use the custom hook to get the access token
//   console.log("accessToken", accessToken);
//   useEffect(() => {
//     const fetchProfile = async () => {
//       console.log("accessToken2", accessToken);
//       try {
//         setIsLoading(true);
//         setIsError(false);
//         const response = await fetch(API_PROFILES, {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             // Authorization: `Bearer[accessToken]`,
//             // Authorization: `Bearer`[accessToken],
//             // Authorization: "Bearer " + accessToken,
//             // Authorization: `Bearer[${accessToken}]`,
//           },
//         });
//         console.log("response", response);
//         const data = await response.json();
//         console.log("profile", data);
//       } catch (error) {
//         console.error("Error fetching profiles:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [accessToken]);

//   if (isLoading) {
//     return <div className="loading"></div>;
//   }

//   if (isError) {
//     return <div>Sorry, there was an error loading the product</div>;
//   }
//   //   const accessToken = useLocalStorage();
//   //   console.log("accessToken", accessToken);
//   //   const [profiles, setProfiles] = useState([]);

//   //   useEffect(() => {
//   //     const fetchData = async () => {
//   //       try {
//   //         const response = await fetch(API_PROFILES, {
//   //           headers: {
//   //             Authorization: `Bearer ${accessToken}`,
//   //           },
//   //         });
//   //         const data = await response.json();
//   //         setProfiles(data);
//   //         console.log("profile", data);
//   //       } catch (error) {
//   //         console.error("Error fetching profiles:", error);
//   //       }
//   //     };

//   //     fetchData();
//   //   }, [accessToken]);

//   return <div></div>;
// }
// export default ProfileInfo;
