import { useEffect, useState } from "react";
import { API_VENUES } from "../../shared/apis";

/**
 * Custom hook to fetch venue data from the API.
 * @param {number} currentPage - The current page number for pagination.
 * @param {number} itemsPerPage - The number of items per page.
 * @returns {{
 *   errorMessageVenues: string,
 *   venues: Array,
 *   meta: Object
 * }} An object containing error message, venues data, and metadata.
 */
function useVenueApiCall(currentPage, itemsPerPage) {
  const [errorMessageVenues, setErrorMessageVenuese] = useState("");
  const [venues, setVenue] = useState([]);
  const [meta, setMeta] = useState({});

  useEffect(() => {
    async function fetchVenueData() {
      try {
        const response = await fetch(`${API_VENUES}?sort=created&_bookings=true&_owner=true&page=${currentPage}&limit=${itemsPerPage}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          const data = await response.json();
          console.error("There was an error:", data.errors);
          setErrorMessageVenuese("Sorry, there was an error: " + data.errors[0].message);
        } else {
          const data = await response.json();
          setVenue(data.data);
          setMeta(data.meta);
        }
      } catch (error) {
        console.error("Error fetching Venues:", error);
      }
    }
    fetchVenueData();
  }, [currentPage, itemsPerPage]);

  return { errorMessageVenues, venues, meta };
}

export default useVenueApiCall;
