import { useEffect, useState } from "react";
import { API_VENUES } from "../../shared/apis";

/**
 * Custom hook for fetching all venues from the API.
 * @returns {Object} An object containing all venues and loading state.
 * @property {Array} allVenues - An array of all venues fetched from the API.
 * @property {boolean} isLoading - A boolean indicating whether the data is currently being loaded.
 * @throws {Error} Throws an error if there is a problem fetching venue data.
 */
function useAllVenuesApiCall() {
  const [allVenues, setAllVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
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
  }, []);

  return { allVenues, isLoading };
}

export default useAllVenuesApiCall;
