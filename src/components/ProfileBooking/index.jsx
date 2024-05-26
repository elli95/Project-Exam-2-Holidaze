import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import BookingEdit from "../BookingEdit";
import useGETProfileData from "../../hooks/useGETProfileData";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

/**
 * Component for displaying and managing profile bookings.
 *
 * @component
 */
function ProfileBooking() {
  const [bookings, setBooking] = useState([]);
  const [isBookingEditFormShown, setIsBookingEditFormShown] = useState(false);
  const [venueIdToShow, setVenueIdToShow] = useState(null);
  const [validBookings, setValidBookings] = useState([]);
  const [bookingType, setBookingType] = useState("upcoming");
  const [totalPrice, setTotalPrices] = useState([]);
  const { profileData } = useGETProfileData();

  const divRef = useRef(null);

  /**
   * Effect to set the bookings when profileData is loaded.
   */
  useEffect(() => {
    if (profileData && profileData.bookings) {
      setBooking(profileData.bookings);
    }
  }, [profileData]);

  /**
   * Effect to filter the bookings based on the current booking type.
   */
  useEffect(() => {
    if (bookings) {
      const currentDate = new Date();
      let filteredBookings = [];
      if (bookingType === "upcoming") {
        filteredBookings = bookings.filter((booking) => {
          const bookingDate = new Date(booking.dateFrom);
          return bookingDate >= currentDate;
        });
      } else if (bookingType === "active") {
        filteredBookings = bookings.filter((booking) => new Date(booking.dateFrom) < currentDate && new Date(booking.dateTo) >= currentDate);
      } else if (bookingType === "outdated") {
        filteredBookings = bookings.filter((booking) => new Date(booking.dateTo) < currentDate);
      }
      setValidBookings(filteredBookings);
    }
  }, [bookings, bookingType]);

  /**
   * Toggles the display of the booking edit form for a specific venue.
   *
   * @param {string} id - The ID of the venue to show/edit.
   */
  const handleCreateVenueForm = (id) => {
    if (venueIdToShow === id) {
      setVenueIdToShow(null);
      setIsBookingEditFormShown(false);
    } else {
      setVenueIdToShow(id);
      setIsBookingEditFormShown(true);
    }
  };

  /**
   * A useEffect hook that calculates the total prices for valid bookings.
   * The total price is calculated based on the duration of each booking and the price per day.
   * It updates the state variable 'totalPrices' with the calculated total prices.
   *
   * @function calculateTotalPrices
   * @returns {void}
   */
  useEffect(() => {
    const calculateTotalPrices = () => {
      const updatedTotalPrices = validBookings.map((booked) => {
        const startDate = new Date(booked.dateFrom);
        const endDate = new Date(booked.dateTo);
        const daysDifference = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        const pricePerDay = booked.venue.price;
        return daysDifference * pricePerDay;
      });
      setTotalPrices(updatedTotalPrices);
    };

    calculateTotalPrices();
  }, [validBookings]);

  /**
   * Handles click outside the booking edit form to close it.
   *
   * @param {Event} event - The mouse click event.
   */
  const handleClickOutside = (event) => {
    if (divRef.current && !divRef.current.contains(event.target)) {
      setIsBookingEditFormShown(false);
      setVenueIdToShow(null);
    }
  };

  /**
   * Effect to add event listener for detecting clicks outside the booking edit form.
   */
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /**
   * Closes the booking edit form.
   */
  const handleCloseBtn = () => {
    setVenueIdToShow(null);
    setIsBookingEditFormShown(false);
  };

  /**
   * Deletes a venue from the bookings list.
   *
   * @param {string} venueId - The ID of the venue to delete.
   */
  const handleDeleteVenue = (venueId) => {
    setBooking((prevBookings) => prevBookings.filter((booking) => booking.id !== venueId));
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center">
        <div className="flex flex-col items-center mt-5">
          <div className="flex justify-center font-wrap gap-5 w-80 sm:w-auto">
            <button className="btnStyle bg-white w-28" onClick={() => setBookingType("upcoming")}>
              Upcoming
            </button>
            <button className="btnStyle bg-white w-28" onClick={() => setBookingType("active")}>
              Active
            </button>
            <button className="btnStyle bg-white w-28" onClick={() => setBookingType("outdated")}>
              Outdated
            </button>
          </div>
          {bookingType === "upcoming" && <h2 className="text-center text-2xl p-2.5">Current Upcoming Bookings</h2>}
          {bookingType === "active" && <h2 className="text-center text-2xl p-2.5">Current Active Bookings</h2>}
          {bookingType === "outdated" && <h2 className="text-center text-2xl p-2.5">Current Outdated Bookings</h2>}
          {profileData.bookings ? (
            <div
              className={`flex flex-1 flex-col flex-wrap gap-7 md:flex-row md:gap-5 md:w-box700 lg:w-box820 xl:w-box1240 xxl:w-box1660 ${
                validBookings.length < 2 ? "md:justify-center" : "md:justify-normal"
              } ${validBookings.length < 3 ? "xl:justify-center" : "xl:justify-normal"} ${
                validBookings.length < 4 ? "xxl:justify-center" : "xxl:justify-normal"
              }`}
            >
              {validBookings.map((booked, index) => (
                <div key={booked.id} className=" self-center w-box300 sm:w-box490 md:w-box340 lg:w-box400">
                  <Link to={`/venue/${booked.venue.id}`} className="profileVenues rounded-lg">
                    <div className="imgBox">
                      {booked.venue.media[0] ? (
                        <img src={booked.venue.media[0].url} alt={booked.venue.media[0].alt} />
                      ) : (
                        <img src="https://images.unsplash.com/photo-1579547945413-497e1b99dac0" alt="Venue" />
                      )}
                    </div>
                    <div className="h-48 p-3 text-lg">
                      <div className="flex justify-between text-xl">
                        <h2>{booked.venue.name}</h2>
                        <div className="flex gap-1 text-xl">
                          <p className="text-star">
                            <FontAwesomeIcon icon={faStar} />
                          </p>
                          <p>{booked.venue.rating}</p>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <h3>Country: {booked.venue.location.country}</h3>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex flex-row justify-between">
                          <p>Date From:</p>
                          <p>{format(new Date(booked.dateFrom), "dd MMM yyyy")}</p>
                        </div>
                        <div className="flex flex-row justify-between">
                          <p>Date To:</p>
                          <p>{format(new Date(booked.dateTo), "dd MMM yyyy")}</p>
                        </div>
                        <div className="flex flex-row justify-between">
                          <p>Guests:</p>
                          <p>{booked.guests}</p>
                        </div>
                        {/* <div className="flex flex-row justify-between">
                          <p>Total Price:</p> */}
                        {/* <p>{booked.venue.price}</p> */}
                        <div className="flex flex-row justify-between">
                          <p>Total Price:</p>
                          <p>{totalPrice[index]}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                  {bookingType === "upcoming" && (
                    <button
                      className="btnStyle alternativeBtnStyle w-box300 sm:w-box490 md:w-box340 lg:w-box400"
                      onClick={() => handleCreateVenueForm(booked.id)}
                    >
                      Edit Booking
                    </button>
                  )}
                  {venueIdToShow === booked.id && isBookingEditFormShown && (
                    <div className="overlay ">
                      <div ref={divRef} className="modulePosition w-box340 h-box700 rounded-lg border-2 border-greyBlur md:w-box610 lg:w-box900">
                        <BookingEdit
                          setVenueIdToShow={setVenueIdToShow}
                          setBooking={setBooking}
                          onDeleteBooking={handleDeleteVenue}
                          venueId={booked.id}
                          handleCloseBtn={handleCloseBtn}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="loading flex justify-center"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileBooking;
