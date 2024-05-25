import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
// import useApiCall from "../../hooks/useApiCall";
import BookingEdit from "../BookingEdit";
// import usePostApiKey from "../../hooks/usePostApiKey";
// import useLocalStorage from "../../hooks/useLocalStorage";
// import { API_PROFILES } from "../../shared/apis";
import useGETProfileData from "../../hooks/useGETProfileData";

function ProfileBooking() {
  // const { apiKey } = usePostApiKey();
  // const { accessToken, userInfo } = useLocalStorage();
  const [validBookings, setValidBookings] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [venueIdToShow, setVenueIdToShow] = useState(null);
  const [istBookingEditFormShown, setIstBookingEditFormShown] = useState(false);
  //   const [isBookingsShown, setIsBookingsShown] = useState(false);
  const { profileData } = useGETProfileData();

  const divRef = useRef(null);
  // const apiCall = useApiCall();

  // const apiCall = useApiCall();
  console.log("profileData....profileData", profileData);
  console.log("setBookingData....setBookingData", bookingData);
  useEffect(() => {
    if (profileData) {
      // fetchVenueBookingData();
      setBookingData(profileData);
    }
  }, [profileData]);
  // function fetchBookingData() {
  //   if (apiKey.key !== undefined && accessToken.length > 0) {
  //     apiCall(API_PROFILES + "/" + userInfo.name + "/?_bookings=true&_venues=true", "GET", {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${accessToken}`,
  //       "X-Noroff-API-Key": apiKey.key,
  //     })
  //       .then((data) => {
  //         setBookingData(data.data);
  //       })
  //       .catch((error) => console.error("Error fetching data:", error));
  //   }
  // }

  // useEffect(() => {
  //   fetchBookingData();
  // }, [apiKey.key, accessToken]);

  useEffect(() => {
    if (bookingData && bookingData.bookings) {
      let currentDate = new Date();
      let filteredBookings = bookingData.bookings.filter((booking) => {
        let bookingDate = new Date(booking.dateFrom);
        return bookingDate >= currentDate;
      });
      setValidBookings(filteredBookings);
      console.log("--------filteredBookings", filteredBookings);
    }
  }, [bookingData]);

  // useEffect(() => {
  //   if (validBookings) {
  //     console.log("--------validBookings", validBookings);
  //   }
  // }, [validBookings.dateFrom]);

  const handleCreateVenueForm = (id) => {
    if (venueIdToShow === id) {
      setVenueIdToShow(null);
      setIstBookingEditFormShown(false);
    } else {
      setVenueIdToShow(id);
      setIstBookingEditFormShown(true);
    }
  };

  const handleClickOutside = (event) => {
    // setTimeout(() => {
    if (divRef.current && !divRef.current.contains(event.target)) {
      setIstBookingEditFormShown(false);
      // setIsBookingsShown(false);
      setVenueIdToShow(null);
    }
    // }, 0);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCloseBtn = () => {
    setVenueIdToShow(null);
    setIstBookingEditFormShown(false);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center">
        <div className="flex-col mt-5">
          <p className="text-center">Current Active Bookings</p>
          {validBookings ? (
            validBookings.length === 0 ? (
              <p>No bookings found.</p>
            ) : (
              <div
                className={`flex flex-1 flex-col flex-wrap gap-7 md:flex-row md:gap-5 md:w-box700 lg:w-box820 xl:w-box1240 xxl:w-box1660 ${
                  validBookings.length < 2 ? "md:justify-center" : "md:justify-normal"
                } ${validBookings.length < 3 ? "xl:justify-center" : "xl:justify-normal"} ${
                  validBookings.length < 4 ? "xxl:justify-center" : "xxl:justify-normal"
                }`}
              >
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

                    {venueIdToShow === booked.id && istBookingEditFormShown && (
                      <div className="overlay ">
                        <div ref={divRef} className="modulePosition w-box340 h-box700 rounded-lg border-2 border-greyBlur md:w-box610 lg:w-box900">
                          {/* <div ref={divRef} className="modulePosition w-box340  rounded-lg border-2 border-greyBlur md:w-box610 lg:w-box900"> */}
                          <BookingEdit
                            setVenueIdToShow={setVenueIdToShow}
                            setBookingData={setBookingData}
                            // fetchBookingData={fetchBookingData}
                            venueId={booked.id}
                            handleCloseBtn={handleCloseBtn}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="loading flex self-center"></div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileBooking;
