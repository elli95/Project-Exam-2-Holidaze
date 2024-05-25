// import useFetchApi from "../../hooks/useFetchApi";
// import { API_VENUES } from "../../shared/apis";
// import { useState } from "react";
import usePostApiKey from "../../hooks/usePostApiKey";
import useLocalStorage from "../../hooks/useLocalStorage";
import useApiCall from "../../hooks/useApiCall";
import { useEffect, useState } from "react";
// import useGETProfileData from "../../hooks/useGETProfileData";
// import useVenueApiCall from "../../hooks/useVenueApiCall";
// import { useParams } from "react-router-dom";
import { API_PROFILES } from "../../shared/apis";

function VenueBookings({ venueId, handleCloseBtn }) {
  // const { venues } = useFetchApi(API_VENUES + "/?_bookings=true");

  const [errorMessage, setErrorMessage] = useState("");
  const [booking, setBooking] = useState([]);
  const [venues, setVenues] = useState([]);
  // const [inputValue, setInputValue] = useState("");
  const { apiKey } = usePostApiKey();
  const { accessToken, userInfo } = useLocalStorage();
  const apiCall = useApiCall();
  // const { id } = useParams();
  // const [currentPage, setCurrentPage] = useState(1);
  // const [itemsPerPage] = useState(40);
  // const { errorMessageVenues, venues, meta } = useVenueApiCall(currentPage, itemsPerPage);
  console.log("profileData", venues);
  console.log("venueId", venueId);
  console.log("userInfo", userInfo.name);
  console.log("accessToken", accessToken);

  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const fetchProfileUserVenueBooking = async () => {
      try {
        const data = await apiCall(API_PROFILES + "/" + userInfo.name + "/venues?_bookings=true", "GET", {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": apiKey.key,
        });

        if (data) {
          console.log("fetchProfileUserVenueBooking", data);
          setVenues(data.data);
        } else {
          const errorData = await data.json();
          console.error("There was an error:", errorData.errors);
          setErrorMessage("Sorry, there was an error: " + errorData.errors[0].message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (userInfo.name && accessToken && apiKey.key && venueId && !hasFetched) {
      fetchProfileUserVenueBooking();
      setHasFetched(true); // Mark as fetched to prevent future fetches
    }
  }, [apiCall, userInfo.name, accessToken, apiKey.key, venueId, hasFetched]);

  // let venueBookingsFilter;

  useEffect(() => {
    if (venues) {
      console.log("profileData venuesvenuesvenues", venues);
      const venueBookingsFilter = venues.filter((venue) => venue.id === venueId);
      setBooking(venueBookingsFilter);
    }
  }, [venues, venueId]);

  console.log("profileData venuesvenuesvenues", booking);
  return (
    <div>
      <div className="flex justify-end mb-2.5">
        <button className="btnStyle" onClick={handleCloseBtn}>
          Close
        </button>
      </div>
      {!booking[0] ? (
        <div className="flex justify-center">
          <div className="loading flex justify-center"></div>
        </div>
      ) : (
        <>
          {booking[0]._count.bookings === 0 ? (
            <p className="flex justify-center text-2xl">No bookings found.</p>
          ) : (
            <div className="flex flex-col justify-center sm:flex-row sm:flex-wrap sm:items-center gap-2.5">
              {booking[0].bookings.map((booked) => {
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
        </>
      )}
      {errorMessage && <span className="error flex justify-center pt-2.5 text-xl">{errorMessage}</span>}
    </div>
  );
}

export default VenueBookings;
