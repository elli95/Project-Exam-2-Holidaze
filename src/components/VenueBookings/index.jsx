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

  useEffect(() => {
    apiCall(API_VENUES + "/?_bookings=true", "GET", {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": apiKey.key,
    })
      .then((data) => {
        setVenue(data.data);
        console.log("data11", data);
      })
      .catch((error) => console.error("Error fetching data:", error));
    // Samme Kode!!
  }, []);

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
  // console.log("venueBookingsFilter", venueBookingsFilter, venueId);

  return (
    <div>
      <div className="flex justify-end">
        <button className="btnStyle" onClick={handleCloseBtn}>
          Close
        </button>
      </div>
      {!venueBookingsFilter[0] ? (
        <div className="loading"></div>
      ) : venueBookingsFilter[0]._count.bookings === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div>
          {venueBookingsFilter[0].bookings.map((booked) => {
            return (
              <div key={booked.id} className="border-2">
                <h2>
                  <strong>User:</strong>
                  {booked.customer.name}
                </h2>
                <p>
                  <strong>Email:</strong>
                  {booked.customer.email}
                </p>
                <p>
                  <strong>Guests:</strong>
                  {booked.guests}
                </p>
                <p>
                  <strong>Created:</strong>
                  {new Date(booked.created).toLocaleDateString()}
                </p>
                <p>
                  <strong>From:</strong>
                  {new Date(booked.dateFrom).toLocaleDateString()}
                </p>
                <p>
                  <strong>To:</strong>
                  {new Date(booked.dateTo).toLocaleDateString()}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default VenueBookings;
