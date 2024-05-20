import { Link } from "react-router-dom";
import useBtnDividerEventHandlers from "../../hooks/useBtnDividerEventHandlers";
import usePostApiKey from "../../hooks/usePostApiKey";
import { API_PROFILES } from "../../shared/apis";
import { useEffect, useState } from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import VenueEdit from "../VenueEdit";
import BookingEdit from "../BookingEdit";
import VenueBookings from "../VenueBookings";
import useApiCall from "../../hooks/useApiCall";

function ProfileBookingVenuesInfo() {
  const { apiKey } = usePostApiKey();
  const { accessToken, userInfo } = useLocalStorage();
  const [venueBookingData, setVenueBookingData] = useState([]);
  const [isVenueEditFormShown, setIsVenueEditFormShown] = useState(false);
  const [isVenueBookingsShown, setIsVenueBookingsShown] = useState(false);
  const [venueIdToShow, setVenueIdToShow] = useState(null);

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

  console.log("venueBookingData.venues", venueBookingData.venues);
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
      // setIsVenueEditFormShown(!isVenueEditFormShown);
    } else {
      setVenueIdToShow(id);
      setIsVenueEditFormShown(true);
    }
  };

  const handleSeeVenueBookings = (id) => {
    if (venueIdToShow === id) {
      setVenueIdToShow(null);
      setIsVenueBookingsShown(false);
      // setIsVenueEditFormShown(!isVenueEditFormShown);
    } else {
      setVenueIdToShow(id);
      setIsVenueBookingsShown(true);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="max-w-3xl flex justify-center">
        <button
          className={`${isVenueManagersButtonDisabled ? "bg-tahiti" : "bg-bermuda"} px-5 py-2 w-1/2 h-16 text-wrap rounded-l-lg border-2 sm:w-60`}
          onClick={handleTravelersClick}
          disabled={isTravelersButtonDisabled}
        >
          My Bookings
        </button>
        <button
          className={`${isTravelersButtonDisabled ? "bg-tahiti" : "bg-bermuda"} px-5 py-2 w-1/2 h-16 text-wrap rounded-r-lg border-2 sm:w-60`}
          onClick={handleVenueManagersClick}
          disabled={isVenueManagersButtonDisabled}
        >
          My Venues
        </button>
      </div>

      <div className="flex justify-center">
        <div className={`${isTravelersShown ? "hidden" : "flex"} flex-col`}>
          <p className="text-center">My Current Bookings!</p>

          <div className={`flex flex-1 flex-col flex-wrap max-w-2xl md:flex-row md:max-w-fit md:gap-5`}>
            {venueBookingData.bookings ? (
              venueBookingData.bookings.length === 0 ? (
                <p>No bookings found.</p>
              ) : (
                venueBookingData.bookings.map((booked) => (
                  <div key={booked.id}>
                    <Link to={`/venue/${booked.venue.id}`} className="bg-redish rounded-lg">
                      <div className="imgBox">{booked.venue.media[0] && <img src={booked.venue.media[0].url} alt={booked.venue.media[0].alt} />}</div>
                      <div className="p-3">
                        <div className="flex justify-between">
                          <h2>{booked.venue.name}</h2>
                          <p>⭐{booked.venue.rating}</p>
                        </div>
                        <div className="flex justify-between">
                          <div>
                            <h3>{booked.venue.location.country}</h3>
                            <p>{booked.venue.location.city}</p>
                          </div>
                          <p className="self-end">Guests:{booked.guests}</p>
                          <p className="self-end">date From:{booked.dateFrom}</p>
                          <p className="self-end">date To:{booked.dateTo}</p>
                          <p className="self-end">{booked.venue.price}</p>
                        </div>
                      </div>
                    </Link>
                    <button className="btnStyle" onClick={() => handleCreateVenueForm(booked.id)}>
                      Edit Booking
                    </button>
                    {venueIdToShow === booked.id && isVenueEditFormShown && (
                      <BookingEdit setVenueBookingData={setVenueBookingData} fetchVenueBookingData={fetchVenueBookingData} venueId={booked.id} />
                    )}
                  </div>
                ))
              )
            ) : (
              <div className="loading"></div>
            )}
          </div>
        </div>
      </div>
      <div className={`${isVenueManagersShown ? "flex" : "hidden"} flex-col`}>
        <p className="text-center">My Current Venues!</p>
        <div className={`flex flex-1 flex-col flex-wrap max-w-2xl md:flex-row md:max-w-fit md:gap-5`}>
          {venueBookingData.bookings ? (
            venueBookingData.venues.length === 0 ? (
              <p>No venues found.</p>
            ) : (
              venueBookingData.venues.map((venue) => (
                <div key={venue.id}>
                  <Link to={`/venue/${venue.id}`} className="bg-redish rounded-lg">
                    <div className="imgBox">{venue.media[0] && <img src={venue.media[0].url} alt={venue.media[0].alt} />}</div>
                    <div className="p-3">
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
                  <button className="btnStyle" onClick={() => handleCreateVenueForm(venue.id)}>
                    Edit Venue
                  </button>
                  {venueIdToShow === venue.id && isVenueEditFormShown && (
                    <VenueEdit setVenueBookingData={setVenueBookingData} fetchVenueBookingData={fetchVenueBookingData} venueId={venue.id} />
                  )}
                  <button className="btnStyle" onClick={() => handleSeeVenueBookings(venue.id)}>
                    view Bookings
                  </button>
                  {venueIdToShow === venue.id && isVenueBookingsShown && <VenueBookings venueId={venue.id} />}
                </div>
              ))
            )
          ) : (
            <div className="loading"></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileBookingVenuesInfo;
