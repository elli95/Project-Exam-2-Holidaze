import { useEffect, useState } from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import { API_KEY_URL } from "../../shared/apis";

function usePostApiKey() {
  const [apiKey, setApiKey] = useState([]);
  const accessToken = useLocalStorage();

  useEffect(() => {
    if (accessToken.accessToken.length > 0) {
      fetch(API_KEY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken.accessToken}`,
        },
        body: JSON.stringify({ name: "API Key" }),
      })
        .then((response) => {
          if (!response.ok) {
            console.log("error", response);
          }
          return response.json();
        })
        .then((data) => {
          // Handle the response (e.g., update state, show a success message, etc.)
          console.log("Response:", data);
          setApiKey(data.data);
        })
        .catch((error) => {
          // Handle errors (e.g., show an error message)
          console.error("Error:", error.message);
        });
    }
  }, [accessToken.accessToken]);

  return { apiKey };
}

export default usePostApiKey;

//   const [isLoading, setIsLoading] = useState(false);
//   const [isError, setIsError] = useState(false);
//   const accessToken = useLocalStorage(); // Use the custom hook to get the access token

//   const [apiKey, setApiKey] = useState([]);

//   useEffect(() => {
//     const apiKey = async () => {
//       try {
//         setIsLoading(true);
//         setIsError(false);
//         console.log("accessToken", accessToken);
//         const response = await fetch(API_KEY_URL, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             // Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicm9iaW5UZXN0IiwiZW1haWwiOiJyb2JpblRlc3RAc3R1ZC5ub3JvZmYubm8iLCJpYXQiOjE3MTQ0ODY2MjZ9.8PH2pzusEdlUUUh-_32skJFRdpbH6IkWQtpuhBilCOo`,
//             // Authorization: `Bearer ${[accessToken]}`,
//             Authorization: `Bearer ${accessToken}`,
//           },
//           body: JSON.stringify({ name: "My API Key name" }),
//         });
//         console.log("response", response);
//         const data = await response.json();
//         console.log("datadatadata", data);
//         setApiKey(data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setIsError(true);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     apiKey();
//   }, [accessToken]);

//   if (isLoading) {
//     return <div className="loading"></div>;
//   }

//   if (isError) {
//     return <div>Sorry, there was an error loading the product</div>;
//   }

//   //   return { apiKey };
// }

// export default usePostApiKey;

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
