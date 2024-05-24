// import { useEffect, useState } from "react";
// import useLocalStorage from "../../hooks/useLocalStorage";
// import { API_VENUES } from "../../shared/apis";
// import usePostApiKey from "../usePostApiKey";

// function useVenueApiCall() {
//   // function useVenueApiCall(currentPage, itemsPerPage) {
//   const { apiKey } = usePostApiKey();
//   const accessToken = useLocalStorage();
//   const [venues, setVenue] = useState([]);
//   const [meta, setMeta] = useState({});

//   console.log("accessToken.accessToken", accessToken.accessToken);
//   useEffect(() => {
//     if (accessToken.accessToken.length > 0 && apiKey.key > 0) {
//       async function fetchVenueData() {
//         try {
//           const response = await fetch(`${API_VENUES}`, {
//             //   const response = await fetch(`${API_VENUES}?sort=created&page=${currentPage}&limit=${itemsPerPage}`, {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${accessToken}`,
//               "X-Noroff-API-Key": apiKey.key,
//             },
//           });
//           console.log("response123:", response);
//           if (!response.ok) {
//             console.error("Error:", response.error[0].message);
//           } else {
//             console.log("venues data");
//             const data = await response.json();
//             console.log("venues data", data);
//             setVenue(data.data);
//             setMeta(data.meta);
//           }
//         } catch (error) {
//           console.error("Error fetching API key:", error);
//         }
//       }
//       fetchVenueData();
//     }
//   }, [accessToken.accessToken, apiKey.key]);
//   // }, [accessToken.accessToken, apiKey.key, currentPage, itemsPerPage]);

//   return { venues, meta };
// }

// export default useVenueApiCall;

import { useEffect, useState } from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import { API_VENUES } from "../../shared/apis";
import usePostApiKey from "../usePostApiKey";

function useVenueApiCall(currentPage, itemsPerPage) {
  const { apiKey } = usePostApiKey();
  const accessToken = useLocalStorage();
  const [venues, setVenue] = useState([]);
  const [meta, setMeta] = useState({});

  useEffect(() => {
    if (accessToken.accessToken.length > 0 && apiKey.key) {
      async function fetchVenueData() {
        try {
          const response = await fetch(`${API_VENUES}?sort=created&page=${currentPage}&limit=${itemsPerPage}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken.accessToken}`,
              "X-Noroff-API-Key": apiKey.key,
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch venue data");
          } else {
            const data = await response.json();
            setVenue(data.data);
            setMeta(data.meta);
          }
        } catch (error) {
          console.error("Error fetching API key:", error);
        }
      }
      fetchVenueData();
    }
  }, [accessToken.accessToken, apiKey.key, currentPage, itemsPerPage]);

  return { venues, meta };
}

export default useVenueApiCall;

// import { useEffect, useState } from "react";
// import useLocalStorage from "../../hooks/useLocalStorage";
// import { API_VENUES } from "../../shared/apis";
// import usePostApiKey from "../usePostApiKey";

// function useVenueApiCall() {
//   // function useVenueApiCall(currentPage, itemsPerPage) {
//   const { apiKey } = usePostApiKey();
//   const accessToken = useLocalStorage();
//   const [venues, setVenue] = useState([]);
//   const [meta, setMeta] = useState({});

//   console.log("accessToken.accessToken", accessToken.accessToken);
//   useEffect(() => {
//     if (accessToken.accessToken.length > 0 && apiKey.key > 0) {
//       async function fetchVenueData() {
//         try {
//           const response = await fetch(`${API_VENUES}`, {
//             //   const response = await fetch(`${API_VENUES}?sort=created&page=${currentPage}&limit=${itemsPerPage}`, {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${accessToken}`,
//               "X-Noroff-API-Key": apiKey.key,
//             },
//           });
//           console.log("response123:", response);
//           if (!response.ok) {
//             console.error("Error:", response.error[0].message);
//           } else {
//             console.log("venues data");
//             const data = await response.json();
//             console.log("venues data", data);
//             setVenue(data.data);
//             setMeta(data.meta);
//           }
//         } catch (error) {
//           console.error("Error fetching API key:", error);
//         }
//       }
//       fetchVenueData();
//     }
//   }, [accessToken.accessToken, apiKey.key]);
//   // }, [accessToken.accessToken, apiKey.key, currentPage, itemsPerPage]);

//   return { venues, meta };
// }

// export default useVenueApiCall;

// import { useEffect, useState } from "react";
// import useLocalStorage from "../../hooks/useLocalStorage";
// import { API_VENUES } from "../../shared/apis";
// import usePostApiKey from "../usePostApiKey";

// function useVenueApiCall() {
//   const { apiKey } = usePostApiKey();
//   const accessToken = useLocalStorage();
//   const [venues, setVenue] = useState([]);
//   const [meta, setMeta] = useState({});

//   useEffect(() => {
//     if (accessToken.accessToken.length > 0 && apiKey.key) {
//       async function fetchVenueData() {
//         try {
//           const response = await fetch(`${API_VENUES}`, {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${accessToken.accessToken}`,
//               "X-Noroff-API-Key": apiKey.key,
//             },
//           });
//           if (!response.ok) {
//             throw new Error("Failed to fetch venue data");
//           } else {
//             const data = await response.json();
//             setVenue(data.data);
//             setMeta(data.meta);
//           }
//         } catch (error) {
//           console.error("Error fetching API key:", error);
//         }
//       }
//       fetchVenueData();
//     }
//   }, [accessToken.accessToken, apiKey.key]);

//   return { venues, meta };
// }

// export default useVenueApiCall;
