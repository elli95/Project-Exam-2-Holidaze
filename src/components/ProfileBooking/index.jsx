// import { useEffect, useRef, useState } from "react";
// import { Link } from "react-router-dom";
// import BookingEdit from "../BookingEdit";
// import useGETProfileData from "../../hooks/useGETProfileData";
// import { format } from "date-fns";

// function ProfileBooking() {
//   const [bookings, setBooking] = useState([]);
//   const [istBookingEditFormShown, setIstBookingEditFormShown] = useState(false);
//   const [isVenueBookingsShown, setIsVenueBookingsShown] = useState(false);
//   const [isCreateBookingShown, setIsCreateBookingShown] = useState(false);
//   const [venueIdToShow, setVenueIdToShow] = useState(null);
//   const [validBookings, setValidBookings] = useState([]);
//   // const [bookingData, setBookingData] = useState([]);
//   const { profileData } = useGETProfileData();

//   console.log("bookings", bookings);

//   const divRef = useRef(null);

//   useEffect(() => {
//     if (profileData && profileData.bookings) {
//       setBooking(profileData.bookings);
//     }
//   }, [profileData]);

//   useEffect(() => {
//     if (bookings) {
//       let currentDate = new Date();
//       let filteredBookings = bookings.filter((booking) => {
//         let bookingDate = new Date(booking.dateFrom);
//         return bookingDate >= currentDate;
//       });
//       setValidBookings(filteredBookings);
//       console.log("--------filteredBookings", filteredBookings);
//     }
//   }, [bookings]);

//   const handleCreateVenueForm = (id) => {
//     if (venueIdToShow === id) {
//       setVenueIdToShow(null);
//       setIstBookingEditFormShown(false);
//     } else {
//       setVenueIdToShow(id);
//       setIstBookingEditFormShown(true);
//     }
//   };

//   // const handleSeeVenueBookings = (id) => {
//   //   if (venueIdToShow === id) {
//   //     setVenueIdToShow(null);
//   //     setIsVenueBookingsShown(false);
//   //   } else {
//   //     setVenueIdToShow(id);
//   //     setIsVenueBookingsShown(true);
//   //   }
//   // };

//   const handleClickOutside = (event) => {
//     if (divRef.current && !divRef.current.contains(event.target)) {
//       setIsCreateBookingShown(false);
//       setIstBookingEditFormShown(false);
//       setIsVenueBookingsShown(false);
//       setVenueIdToShow(null);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleCloseBtn = () => {
//     setVenueIdToShow(null);
//     setIsCreateBookingShown(false);
//     setIstBookingEditFormShown(false);
//     setIsVenueBookingsShown(false);
//   };

//   const handleDeleteVenue = (venueId) => {
//     setBooking((prevVenues) => prevVenues.filter((venue) => venue.id !== venueId));
//   };

//   return (
//     <div className="flex flex-col items-center">
//       <div className="flex justify-center">
//         <div className="flex-col mt-5">
//           <p className="text-center">Current Active Bookings</p>
//           {profileData.venues ? (
//             profileData.venues.length === 0 ? (
//               <p>No bookings found.</p>
//             ) : (
//               <div
//                 className={`flex flex-1 flex-col flex-wrap gap-7 md:flex-row md:gap-5 md:w-box700 lg:w-box820 xl:w-box1240 xxl:w-box1660 ${
//                   validBookings.length < 2 ? "md:justify-center" : "md:justify-normal"
//                 } ${validBookings.length < 3 ? "xl:justify-center" : "xl:justify-normal"} ${
//                   validBookings.length < 4 ? "xxl:justify-center" : "xxl:justify-normal"
//                 }`}
//               >
//                 {bookings.map((booked) => (
//                   <div key={booked.id} className=" self-center w-box300 sm:w-box490 md:w-box340 lg:w-box400">
//                     <Link to={`/venue/${booked.venue.id}`} className="profileVenues rounded-lg">
//                       <div className="imgBox">{booked.venue.media[0] && <img src={booked.venue.media[0].url} alt={booked.venue.media[0].alt} />}</div>
//                       <div className="h-40 p-3">
//                         <div className="flex justify-between">
//                           <h2>{booked.venue.name}</h2>
//                           <p>⭐{booked.venue.rating}</p>
//                         </div>
//                         <div className="flex justify-between">
//                           <h3>Country: {booked.venue.location.country}</h3>
//                         </div>
//                         <div className="flex flex-col">
//                           <div className="flex flex-row justify-between">
//                             <p>Date From:</p>
//                             <p>{format(new Date(booked.dateFrom), "dd MMM yyyy")}</p>
//                           </div>
//                           <div className="flex flex-row justify-between">
//                             <p>Date To:</p>
//                             <p>{format(new Date(booked.dateTo), "dd MMM yyyy")}</p>
//                           </div>
//                           <div className="flex flex-row justify-between">
//                             <p>Guests:</p>
//                             <p>{booked.guests}</p>
//                           </div>
//                           <div className="flex flex-row justify-between">
//                             <p>Total Price:</p>
//                             <p>{booked.venue.price}</p>
//                           </div>
//                         </div>
//                       </div>
//                     </Link>

//                     <button
//                       className="btnStyle alternativeBtnStyle w-box300 sm:w-box490 md:w-box340 lg:w-box400"
//                       onClick={() => handleCreateVenueForm(booked.id)}
//                     >
//                       Edit Booking
//                     </button>

//                     {venueIdToShow === booked.id && istBookingEditFormShown && (
//                       <div className="overlay ">
//                         <div ref={divRef} className="modulePosition w-box340 h-box700 rounded-lg border-2 border-greyBlur md:w-box610 lg:w-box900">
//                           <BookingEdit
//                             setVenueIdToShow={setVenueIdToShow}
//                             setIsVenueBookingsShown={setIsVenueBookingsShown}
//                             setBooking={setBooking}
//                             setIsCreateBookingShown={setIsCreateBookingShown}
//                             onDeleteBooking={handleDeleteVenue}
//                             venueId={booked.id}
//                             handleCloseBtn={handleCloseBtn}
//                           />
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )
//           ) : (
//             <div className="loading flex self-center"></div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ProfileBooking;

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import BookingEdit from "../BookingEdit";
import useGETProfileData from "../../hooks/useGETProfileData";
import { format } from "date-fns";

function ProfileBooking() {
  const [bookings, setBooking] = useState([]);
  const [isBookingEditFormShown, setIsBookingEditFormShown] = useState(false);
  // const [isVenueBookingsShown, setIsVenueBookingsShown] = useState(false);
  // const [isCreateBookingShown, setIsCreateBookingShown] = useState(false);
  const [venueIdToShow, setVenueIdToShow] = useState(null);
  const [validBookings, setValidBookings] = useState([]);
  const { profileData } = useGETProfileData();

  const divRef = useRef(null);

  useEffect(() => {
    if (profileData && profileData.bookings) {
      setBooking(profileData.bookings);
    }
  }, [profileData]);

  useEffect(() => {
    if (bookings) {
      const currentDate = new Date();
      const filteredBookings = bookings.filter((booking) => {
        const bookingDate = new Date(booking.dateFrom);
        return bookingDate >= currentDate;
      });
      setValidBookings(filteredBookings);
    }
  }, [bookings]);

  const handleCreateVenueForm = (id) => {
    if (venueIdToShow === id) {
      setVenueIdToShow(null);
      setIsBookingEditFormShown(false);
    } else {
      setVenueIdToShow(id);
      setIsBookingEditFormShown(true);
    }
  };

  const handleClickOutside = (event) => {
    if (divRef.current && !divRef.current.contains(event.target)) {
      // setIsCreateBookingShown(false);
      setIsBookingEditFormShown(false);
      // setIsVenueBookingsShown(false);
      setVenueIdToShow(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCloseBtn = () => {
    setVenueIdToShow(null);
    // setIsCreateBookingShown(false);
    setIsBookingEditFormShown(false);
    // setIsVenueBookingsShown(false);
  };

  const handleDeleteVenue = (venueId) => {
    setBooking((prevBookings) => prevBookings.filter((booking) => booking.id !== venueId));
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-center">
        <div className="flex-col mt-5">
          <p className="text-center">Current Active Bookings</p>
          {profileData.bookings ? (
            profileData.bookings.length === 0 ? (
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
                  <div key={booked.id} className=" self-center w-box300 sm:w-box490 md:w-box340 lg:w-box400">
                    <Link to={`/venue/${booked.venue.id}`} className="profileVenues rounded-lg">
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
                          <div className="flex flex-row justify-between">
                            <p>Total Price:</p>
                            <p>{booked.venue.price}</p>
                          </div>
                        </div>
                      </div>
                    </Link>

                    {new Date(booked.dateFrom) < new Date() ? (
                      <h2 className="flex justify-center btnStyle alternativeBtnStyle w-box300 sm:w-box490 md:w-box340 lg:w-box400">
                        Booking Active
                      </h2>
                    ) : (
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
