import { useEffect, useState } from "react";
// import useLocalStorage from "../../hooks/useLocalStorage";
import { API_VENUES } from "../../shared/apis";
// import usePostApiKey from "../usePostApiKey";

function useAllVenuesApiCall() {
  //   const { apiKey } = usePostApiKey();
  //   const accessToken = useLocalStorage();
  const [allVenues, setAllVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // if (accessToken.accessToken && apiKey.key) {
    async function fetchAllPages() {
      setIsLoading(true);
      try {
        let currentPage = 1;
        let allData = [];
        let isLastPage = false;

        while (!isLastPage) {
          const response = await fetch(`${API_VENUES}?sort=created&_bookings=true&_owner=true&page=${currentPage}&limit=10`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              // Authorization: `Bearer ${accessToken.accessToken}`,
              // "X-Noroff-API-Key": apiKey.key,
            },
          });

          if (!response.ok) {
            throw new Error("Failed to fetch venue data");
          }

          const data = await response.json();
          allData = [...allData, ...data.data];
          isLastPage = data.meta.isLastPage;
          currentPage += 1;
        }

        setAllVenues(allData);
      } catch (error) {
        console.error("Error fetching venue data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAllPages();
    // }
  }, []);
  // }, [accessToken.accessToken, apiKey.key]);

  return { allVenues, isLoading };
}

export default useAllVenuesApiCall;
