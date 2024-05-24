// import useFetchApi from "../../hooks/useFetchApi";
import { API_VENUES } from "../../shared/apis";
import { useEffect, useState } from "react";
import usePostApiKey from "../../hooks/usePostApiKey";
import useLocalStorage from "../../hooks/useLocalStorage";
import useApiCall from "../../hooks/useApiCall";

function VenueBookings({ venueId, handleCloseBtn }) {
  // const { venues } = useFetchApi(API_VENUES + "/?_bookings=true");

  const [venues, setVenue] = useState([]);
  // const [inputValue, setInputValue] = useState("");
  const { apiKey } = usePostApiKey();
  const { accessToken } = useLocalStorage();
  const apiCall = useApiCall();

  // useEffect(() => {
  //   apiCall(API_VENUES + "/?_bookings=true", "GET", {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${accessToken}`,
  //     "X-Noroff-API-Key": apiKey.key,
  //   })
  //     .then((data) => {
  //       setVenue(data.data);
  //       console.log("data11", data);
  //     })
  //     .catch((error) => console.error("Error fetching data:", error));
  //   // Samme Kode!!
  // }, []);

  useEffect(() => {
    const fetchAllPages = async (url) => {
      try {
        const data = await apiCall(url, "GET", {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": apiKey.key,
        });

        setVenue((prevVenues) => [...prevVenues, ...data.data]);

        if (!data.meta.isLastPage) {
          await fetchAllPages(`${API_VENUES}?page=${data.meta.nextPage}`);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAllPages(`${API_VENUES}/?_bookings=true&page=1`);
  }, [apiCall, accessToken, apiKey.key]);

  let venueBookingsFilter;
  if (venues) {
    venueBookingsFilter = venues.filter((venue) => venue.id === venueId);
  }

  // let venueBookingsFilter2;
  // if (venues) {
  //   venueBookingsFilter2 = venues.filter((venue) => venue.id === "7d32f7c1-d6b6-4a9b-a7a0-17a73c97c076");
  // }
  // console.log("venueBookingsFilter2venueBookingsFilter2", venueBookingsFilter2);
  // console.log("venueBookingsFilterVenues", venues);
  console.log("venueBookingsFilter", venueBookingsFilter);

  return (
    <div>
      <div className="flex justify-end mb-2.5">
        <button className="btnStyle" onClick={handleCloseBtn}>
          Close
        </button>
      </div>
      {!venueBookingsFilter[0] ? (
        <div className="loading flex justify-center"></div>
      ) : venueBookingsFilter[0]._count.bookings === 0 || !venueBookingsFilter[0].bookings ? (
        <p className="flex justify-center text-2xl">No bookings found.</p>
      ) : (
        <div className="flex flex-col justify-center sm:flex-row sm:flex-wrap sm:items-center gap-2.5">
          {venueBookingsFilter[0].bookings.map((booked) => {
            return (
              <div key={booked.id} className="border-2 textBreakStyle  text-lg sm:w-box340">
                <div className="flex justify-between  bg-greyBlur px-1 flex-wrap">
                  <h2>User:</h2>
                  <p>{booked.customer.name}</p>
                </div>
                <div className="flex justify-between px-1 flex-wrap">
                  <h2>Email:</h2>
                  <p>{booked.customer.email}</p>
                </div>
                <div className="flex justify-between bg-greyBlur px-1 flex-wrap">
                  <h2>Guests:</h2>
                  <p>{booked.guests}</p>
                </div>
                <div className="flex justify-between px-1 flex-wrap">
                  <h2>Created:</h2>
                  <p>{new Date(booked.created).toLocaleDateString()}</p>
                </div>
                <div className="flex justify-between px-1 flex-wrap">
                  <h2>From:</h2>
                  <p>{new Date(booked.dateFrom).toLocaleDateString()}</p>
                </div>
                <div className="flex justify-between bg-greyBlur px-1 flex-wrap">
                  <h2>To:</h2>
                  <p>{new Date(booked.dateTo).toLocaleDateString()}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default VenueBookings;
