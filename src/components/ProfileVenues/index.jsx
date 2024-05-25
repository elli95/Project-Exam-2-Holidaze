// import { useEffect, useRef, useState } from "react";
// import CreateVenue from "../CreateVenue";
// import { Link } from "react-router-dom";
// import VenueEdit from "../VenueEdit";
// import VenueBookings from "../VenueBookings";
// import useGETProfileData from "../../hooks/useGETProfileData";

// function ProfileVenues() {
//   const [venueBookingData, setVenueBookingData] = useState([]);
//   const [isVenueEditFormShown, setIsVenueEditFormShown] = useState(false);
//   const [isVenueBookingsShown, setIsVenueBookingsShown] = useState(false);
//   const [isCreateVenueShown, setIsCreateVenueShown] = useState(false);
//   const [venueIdToShow, setVenueIdToShow] = useState(null);
//   const { profileData } = useGETProfileData();

//   const divRef = useRef(null);

//   useEffect(() => {
//     if (profileData) {
//       setVenueBookingData(profileData);
//     }
//   }, [profileData]);

//   const handleSeeCreateVenue = (id) => {
//     if (venueIdToShow === id) {
//       setIsCreateVenueShown(false);
//     } else {
//       setIsCreateVenueShown(true);
//     }
//   };

//   const handleCreateVenueForm = (id) => {
//     if (venueIdToShow === id) {
//       setVenueIdToShow(null);
//       setIsVenueEditFormShown(false);
//     } else {
//       setVenueIdToShow(id);
//       setIsVenueEditFormShown(true);
//     }
//   };

//   const handleSeeVenueBookings = (id) => {
//     if (venueIdToShow === id) {
//       setVenueIdToShow(null);
//       setIsVenueBookingsShown(false);
//     } else {
//       setVenueIdToShow(id);
//       setIsVenueBookingsShown(true);
//     }
//   };

//   const handleClickOutside = (event) => {
//     if (divRef.current && !divRef.current.contains(event.target)) {
//       setIsCreateVenueShown(false);
//       setIsVenueEditFormShown(false);
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
//     setIsCreateVenueShown(false);
//     setIsVenueEditFormShown(false);
//     setIsVenueBookingsShown(false);
//   };

//   const handleDeleteVenue = (venueId) => {
//     setVenueBookingData((prevData) => prevData.filter((venue) => venue.id !== venueId));
//   };

//   return (
//     <div className="flex flex-col items-center">
//       {venueBookingData.venueManager === true && (
//         <div className="flex-col mt-5">
//           {venueBookingData.bookings ? (
//             venueBookingData.venues.length === 0 ? (
//               <p>No venues found.</p>
//             ) : (
//               <div>
//                 <div className="flex justify-center mb-5">
//                   <button className="btnStyle w-44" onClick={handleSeeCreateVenue}>
//                     Create new Venue
//                   </button>
//                 </div>
//                 {isCreateVenueShown && (
//                   <div className="overlay">
//                     <div ref={divRef} className="modulePosition w-box340 h-box700 h-5/6 rounded-lg border-2 border-greyBlur sm:w-box610 lg:w-box900">
//                       <CreateVenue
//                         setVenueBookingData={setVenueBookingData}
//                         handleCloseBtn={handleCloseBtn}
//                         setIsCreateVenueShown={setIsCreateVenueShown}
//                       />
//                     </div>
//                   </div>
//                 )}
//                 <div
//                   className={`flex flex-1 flex-col flex-wrap gap-7 md:flex-row md:gap-5 md:w-box700 lg:w-box820 xl:w-box1240 xxl:w-box1660 ${
//                     venueBookingData.venues.length < 2 ? "md:justify-center" : "md:justify-normal"
//                   } ${venueBookingData.venues.length < 3 ? "xl:justify-center" : "xl:justify-normal"} ${
//                     venueBookingData.venues.length < 4 ? "xxl:justify-center" : "xxl:justify-normal"
//                   }`}
//                 >
//                   {venueBookingData.venues.map((venue) => (
//                     <div key={venue.id} className="self-center overflow-hidden w-box300 sm:w-box490 md:w-box340 lg:w-box400">
//                       <Link to={`/venue/${venue.id}`} className="profileVenues rounded-lg">
//                         <div className="imgBox">
//                           {venue.media[0] ? (
//                             <img src={venue.media[0].url} alt={venue.media[0].alt} />
//                           ) : (
//                             <img src="https://images.unsplash.com/photo-1579547945413-497e1b99dac0" alt="Venue" />
//                           )}
//                           {/* {venue.media[0] && <img src={venue.media[0].url} alt={venue.media[0].alt} />} */}
//                         </div>
//                         <div className="h-24 p-3">
//                           <div className="flex justify-between">
//                             <h2>{venue.name}</h2>
//                             <p>⭐{venue.rating}</p>
//                           </div>
//                           <div className="flex justify-between">
//                             <div>
//                               <h3>{venue.location.country}</h3>
//                               <p>{venue.location.city}</p>
//                             </div>
//                             <p className="self-end">{venue.price}</p>
//                           </div>
//                         </div>
//                       </Link>
//                       <button
//                         className="btnStyle alternativeBtnStyle viewVenBtn w-box150 sm:w-box245 md:w-40 lg:w-box200"
//                         onClick={() => handleCreateVenueForm(venue.id)}
//                       >
//                         Edit Venue
//                       </button>
//                       {venueIdToShow === venue.id && isVenueEditFormShown && (
//                         <div className="overlay">
//                           <div
//                             ref={divRef}
//                             className="modulePosition w-box340 h-box700 h-5/6 rounded-lg border-2 border-greyBlur sm:w-box610 lg:w-box900"
//                           >
//                             <VenueEdit
//                               setVenueIdToShow={setVenueIdToShow}
//                               setIsVenueBookingsShown={setIsVenueBookingsShown}
//                               setVenueBookingData={setVenueBookingData}
//                               setIsCreateVenueShown={setIsCreateVenueShown}
//                               onDeleteVenue={handleDeleteVenue}
//                               venueId={venue.id}
//                               handleCloseBtn={handleCloseBtn}
//                             />
//                           </div>
//                         </div>
//                       )}
//                       <button
//                         className="btnStyle alternativeBtnStyle viewBokBtn border-r w-box150 sm:w-box245 md:w-40 lg:w-box200"
//                         onClick={() => handleSeeVenueBookings(venue.id)}
//                       >
//                         View Bookings
//                       </button>
//                       {venueIdToShow === venue.id && isVenueBookingsShown && (
//                         <div className="overlay">
//                           <div
//                             ref={divRef}
//                             className="modulePosition w-box340 h-box700 h-5/6 rounded-lg border-2 border-greyBlur sm:w-box610 lg:w-box900"
//                           >
//                             <VenueBookings venueId={venue.id} handleCloseBtn={handleCloseBtn} />
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )
//           ) : (
//             <div className="loading"></div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// export default ProfileVenues;

import { useEffect, useRef, useState } from "react";
import CreateVenue from "../CreateVenue";
import { Link } from "react-router-dom";
import VenueEdit from "../VenueEdit";
import VenueBookings from "../VenueBookings";
import useGETProfileData from "../../hooks/useGETProfileData";

function ProfileVenues() {
  const [venues, setVenues] = useState([]);
  const [isVenueEditFormShown, setIsVenueEditFormShown] = useState(false);
  const [isVenueBookingsShown, setIsVenueBookingsShown] = useState(false);
  const [isCreateVenueShown, setIsCreateVenueShown] = useState(false);
  const [venueIdToShow, setVenueIdToShow] = useState(null);
  const { profileData } = useGETProfileData();

  const divRef = useRef(null);

  useEffect(() => {
    if (profileData && profileData.venues) {
      setVenues(profileData.venues);
    }
  }, [profileData]);

  const handleSeeCreateVenue = () => {
    setIsCreateVenueShown((prev) => !prev);
  };

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
    if (divRef.current && !divRef.current.contains(event.target)) {
      setIsCreateVenueShown(false);
      setIsVenueEditFormShown(false);
      setIsVenueBookingsShown(false);
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
    setIsCreateVenueShown(false);
    setIsVenueEditFormShown(false);
    setIsVenueBookingsShown(false);
  };

  const handleDeleteVenue = (venueId) => {
    setVenues((prevVenues) => prevVenues.filter((venue) => venue.id !== venueId));
  };

  return (
    <div className="flex flex-col items-center">
      {profileData?.venueManager && (
        <div className="flex-col mt-5">
          {profileData.bookings ? (
            venues.length === 0 ? (
              <p>No venues found.</p>
            ) : (
              <div>
                <div className="flex justify-center mb-5">
                  <button className="bg-white btnStyle w-44" onClick={handleSeeCreateVenue}>
                    Create new Venue
                  </button>
                </div>
                {isCreateVenueShown && (
                  <div className="overlay">
                    <div ref={divRef} className="modulePosition w-box340 h-box700 h-5/6 rounded-lg border-2 border-greyBlur sm:w-box610 lg:w-box900">
                      <CreateVenue setVenues={setVenues} handleCloseBtn={handleCloseBtn} setIsCreateVenueShown={setIsCreateVenueShown} />
                    </div>
                  </div>
                )}
                <div
                  className={`flex flex-1 flex-col flex-wrap gap-7 md:flex-row md:gap-5 md:w-box700 lg:w-box820 xl:w-box1240 xxl:w-box1660 ${
                    venues.length < 2 ? "md:justify-center" : "md:justify-normal"
                  } ${venues.length < 3 ? "xl:justify-center" : "xl:justify-normal"} ${
                    venues.length < 4 ? "xxl:justify-center" : "xxl:justify-normal"
                  }`}
                >
                  {venues.map((venue) => (
                    <div key={venue.id} className="self-center overflow-hidden w-box300 sm:w-box490 md:w-box340 lg:w-box400">
                      <Link to={`/venue/${venue.id}`} className="profileVenues rounded-lg">
                        <div className="imgBox">
                          {venue.media[0] ? (
                            <img src={venue.media[0].url} alt={venue.media[0].alt} />
                          ) : (
                            <img src="https://images.unsplash.com/photo-1579547945413-497e1b99dac0" alt="Venue" />
                          )}
                        </div>
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
                          <div
                            ref={divRef}
                            className="modulePosition w-box340 h-box700 h-5/6 rounded-lg border-2 border-greyBlur sm:w-box610 lg:w-box900"
                          >
                            <VenueEdit
                              setVenueIdToShow={setVenueIdToShow}
                              setIsVenueBookingsShown={setIsVenueBookingsShown}
                              setVenues={setVenues}
                              setIsCreateVenueShown={setIsCreateVenueShown}
                              onDeleteVenue={handleDeleteVenue}
                              venueId={venue.id}
                              handleCloseBtn={handleCloseBtn}
                            />
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
                          <div
                            ref={divRef}
                            className="modulePosition w-box340 h-box700 h-5/6 rounded-lg border-2 border-greyBlur sm:w-box610 lg:w-box900"
                          >
                            <VenueBookings venueId={venue.id} handleCloseBtn={handleCloseBtn} />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          ) : (
            <div className="loading"></div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProfileVenues;
