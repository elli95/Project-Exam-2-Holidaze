import { Link } from "react-router-dom";
import useBtnDividerEventHandlers from "../../hooks/useBtnDividerEventHandlers";
import usePostApiKey from "../../hooks/usePostApiKey";
import { API_PROFILES } from "../../shared/apis";
import { useEffect, useRef, useState } from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import VenueEdit from "../VenueEdit";
import BookingEdit from "../BookingEdit";
import VenueBookings from "../VenueBookings";
import useApiCall from "../../hooks/useApiCall";

function ProfileBookingVenuesInfo() {
  const { apiKey } = usePostApiKey();
  const { accessToken, userInfo } = useLocalStorage();
  const [venueBookingData, setVenueBookingData] = useState([]);
  const [validBookings, setValidBookings] = useState([]);
  const [isVenueEditFormShown, setIsVenueEditFormShown] = useState(false);
  const [isVenueBookingsShown, setIsVenueBookingsShown] = useState(false);
  const [venueIdToShow, setVenueIdToShow] = useState(null);

  const divRef = useRef(null);
  const apiCall = useApiCall();

  function fetchVenueBookingData() {
    if (apiKey.key !== undefined && accessToken.length > 0) {
      apiCall(API_PROFILES + "/" + userInfo.name + "/?_bookings=true&_venues=true", "GET", {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey.key,
      })
        .then((data) => setVenueBookingData(data.data))
        .catch((error) => console.error("Error fetching data:", error));
    }
  }

  useEffect(() => {
    fetchVenueBookingData();
  }, [apiKey.key, accessToken]);

  useEffect(() => {
    if (venueBookingData && venueBookingData.bookings) {
      let currentDate = new Date();
      let filteredBookings = venueBookingData.bookings.filter((booking) => {
        let bookingDate = new Date(booking.dateFrom);
        return bookingDate >= currentDate;
      });
      setValidBookings(filteredBookings);
      console.log("--------filteredBookings", filteredBookings);
    }
  }, [venueBookingData]);

  useEffect(() => {
    if (validBookings) {
      console.log("--------validBookings", validBookings);
    }
  }, [validBookings.dateFrom]);
  // console.log("venueBookingData.venues", venueBookingData.venues);
  console.log("venueBookingData", venueBookingData);

  const {
    isTravelersShown,
    isVenueManagersShown,
    isTravelersButtonDisabled,
    isVenueManagersButtonDisabled,
    handleTravelersClick,
    handleVenueManagersClick,
  } = useBtnDividerEventHandlers();

  const handleCreateVenueForm = (id) => {
    if (venueIdToShow === id) {
      setVenueIdToShow(null);
      setIsVenueEditFormShown(false);
    } else {
      setVenueIdToShow(id);
      setIsVenueEditFormShown(true);
    }
  };

  const handleSeeVenueBookings = (id) => {
    if (venueIdToShow === id) {
      setVenueIdToShow(null);
      setIsVenueBookingsShown(false);
    } else {
      setVenueIdToShow(id);
      setIsVenueBookingsShown(true);
    }
  };

  const handleClickOutside = (event) => {
    setTimeout(() => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setIsVenueEditFormShown(false);
        setIsVenueBookingsShown(false);
        setVenueIdToShow(null);
      }
    }, 0);
  };

  console.log("isVenueBookingsShown", isVenueBookingsShown);
  console.log("venueIdToShow", venueIdToShow);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="max-w-3xl flex justify-center">
        <button
          className={`${isVenueManagersButtonDisabled ? "bg-tahiti" : "bg-bermuda"} px-5 py-2 w-40 h-16 text-wrap rounded-l-lg border-2 sm:w-60`}
          onClick={handleTravelersClick}
          disabled={isTravelersButtonDisabled}
        >
          My Bookings
        </button>
        <button
          className={`${isTravelersButtonDisabled ? "bg-tahiti" : "bg-bermuda"} px-5 py-2 w-40 h-16 text-wrap rounded-r-lg border-2 sm:w-60`}
          onClick={handleVenueManagersClick}
          disabled={isVenueManagersButtonDisabled}
        >
          My Venues
        </button>
      </div>

      <div className="flex justify-center">
        <div className={`${isTravelersShown ? "hidden" : "flex"} flex-col`}>
          <p className="text-center">Current Active Bookings</p>
          {/* {venueBookingData.bookings ? (
            venueBookingData.bookings.length === 0 ? ( */}
          {validBookings ? (
            validBookings.length === 0 ? (
              <p>No bookings found.</p>
            ) : (
              <div
                className={`flex flex-1 flex-col flex-wrap gap-7 md:flex-row md:gap-5 md:w-box700 lg:w-box820 xl:w-box1240 xxl:w-box1660 ${
                  venueBookingData.bookings.length < 2 ? "md:justify-center" : "md:justify-normal"
                } ${venueBookingData.bookings.length < 3 ? "xl:justify-center" : "xl:justify-normal"} ${
                  venueBookingData.bookings.length < 4 ? "xxl:justify-center" : "xxl:justify-normal"
                }`}
              >
                {console.log("venueBookingData.bookings.length", venueBookingData.bookings.length)}
                {/* {venueBookingData.bookings.map((booked) => ( */}
                {validBookings.map((booked) => (
                  <div key={booked.id} className="self-center w-box300 sm:w-box490 md:w-box340 lg:w-box400">
                    <Link to={`/venue/${booked.venue.id}`} className="bg-redish rounded-lg">
                      <div className="imgBox">{booked.venue.media[0] && <img src={booked.venue.media[0].url} alt={booked.venue.media[0].alt} />}</div>
                      <div className="h-40 p-3">
                        <div className="flex justify-between">
                          <h2>{booked.venue.name}</h2>
                          <p>⭐{booked.venue.rating}</p>
                        </div>
                        <div className="flex justify-between">
                          <h3>Country: {booked.venue.location.country}</h3>
                        </div>
                        <div className="flex flex-col">
                          <div className="flex flex-row justify-between">
                            <p>Date From:</p>
                            <p>{booked.dateFrom}</p>
                          </div>
                          <div className="flex flex-row justify-between">
                            <p>Date To:</p>
                            <p>{booked.dateTo}</p>
                          </div>
                          <div className="flex flex-row justify-between">
                            <p>Guests:</p>
                            <p>{booked.guests}</p>
                          </div>
                          <div className="flex flex-row justify-between">
                            <p>Total Price:</p>
                            <p>{booked.venue.price}</p>
                          </div>
                        </div>
                      </div>
                    </Link>

                    <button
                      className="btnStyle alternativeBtnStyle w-box300 sm:w-box490 md:w-box340 lg:w-box400"
                      onClick={() => handleCreateVenueForm(booked.id)}
                    >
                      Edit Booking
                    </button>

                    {venueIdToShow === booked.id && isVenueEditFormShown && (
                      <div className="overlay">
                        <div ref={divRef} className="modulePosition w-box340  rounded-lg border-2 border-greyBlur md:w-box610 lg:w-box900">
                          <BookingEdit
                            setVenueIdToShow={setVenueIdToShow}
                            setIsVenueBookingsShown={setIsVenueBookingsShown}
                            setVenueBookingData={setVenueBookingData}
                            fetchVenueBookingData={fetchVenueBookingData}
                            venueId={booked.id}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="loading"></div>
          )}
        </div>
      </div>
      <div className={`${isVenueManagersShown ? "flex" : "hidden"} flex-col`}>
        <p className="text-center">My Current Venues!</p>
        {/* <div className="flex flex-1 flex-col flex-wrap justify-center gap-7   md:flex-row md:gap-5 md:justify-normal md:w-box700 lg:w-box820 xl:w-box1240 xxl:w-box1660"> */}
        {venueBookingData.bookings ? (
          venueBookingData.venues.length === 0 ? (
            <p>No venues found.</p>
          ) : (
            <div
              className={`flex flex-1 flex-col flex-wrap gap-7 md:flex-row md:gap-5 md:w-box700 lg:w-box820 xl:w-box1240 xxl:w-box1660 ${
                venueBookingData.venues.length < 2 ? "md:justify-center" : "md:justify-normal"
              } ${venueBookingData.venues.length < 3 ? "xl:justify-center" : "xl:justify-normal"} ${
                venueBookingData.venues.length < 4 ? "xxl:justify-center" : "xxl:justify-normal"
              }`}
            >
              {venueBookingData.venues.map((venue) => (
                <div key={venue.id} className="self-center w-box300 sm:w-box490 md:w-box340 lg:w-box400">
                  <Link to={`/venue/${venue.id}`} className="bg-redish rounded-lg">
                    <div className="imgBox">{venue.media[0] && <img src={venue.media[0].url} alt={venue.media[0].alt} />}</div>
                    <div className="h-24 p-3">
                      <div className="flex justify-between">
                        <h2>{venue.name}</h2>
                        <p>⭐{venue.rating}</p>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <h3>{venue.location.country}</h3>
                          <p>{venue.location.city}</p>
                        </div>
                        <p className="self-end">{venue.price}</p>
                      </div>
                    </div>
                  </Link>
                  <button
                    className="btnStyle alternativeBtnStyle viewVenBtn w-box150 sm:w-box245 md:w-40 lg:w-box200"
                    onClick={() => handleCreateVenueForm(venue.id)}
                  >
                    Edit Venue
                  </button>
                  {venueIdToShow === venue.id && isVenueEditFormShown && (
                    <div className="overlay">
                      <div ref={divRef} className="modulePosition">
                        <VenueEdit setVenueBookingData={setVenueBookingData} fetchVenueBookingData={fetchVenueBookingData} venueId={venue.id} />
                      </div>
                    </div>
                  )}
                  <button
                    className="btnStyle alternativeBtnStyle viewBokBtn border-r w-box150 sm:w-box245 md:w-40 lg:w-box200"
                    onClick={() => handleSeeVenueBookings(venue.id)}
                  >
                    View Bookings
                  </button>
                  {venueIdToShow === venue.id && isVenueBookingsShown && (
                    <div className="overlay">
                      <div ref={divRef} className="modulePosition w-box340 rounded-lg border-2 border-greyBlur">
                        <VenueBookings venueId={venue.id} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="loading"></div>
        )}
      </div>
    </div>
  );
}

export default ProfileBookingVenuesInfo;
