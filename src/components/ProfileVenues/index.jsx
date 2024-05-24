import { useCallback, useEffect, useRef, useState } from "react";
import useApiCall from "../../hooks/useApiCall";
import { API_PROFILES } from "../../shared/apis";
import usePostApiKey from "../../hooks/usePostApiKey";
import useLocalStorage from "../../hooks/useLocalStorage";
import CreateVenue from "../CreateVenue";
import { Link } from "react-router-dom";
import VenueEdit from "../VenueEdit";
import VenueBookings from "../VenueBookings";

function ProfileVenues() {
  const { apiKey } = usePostApiKey();
  const { accessToken, userInfo } = useLocalStorage();
  const [venueBookingData, setVenueBookingData] = useState([]);
  const [isVenueEditFormShown, setIsVenueEditFormShown] = useState(false);
  const [isVenueBookingsShown, setIsVenueBookingsShown] = useState(false);
  const [isCreateVenueShown, setIsCreateVenueShown] = useState(false);
  const [venueIdToShow, setVenueIdToShow] = useState(null);

  const divRef = useRef(null);
  const apiCall = useApiCall();

  const fetchVenueBookingData = useCallback(async () => {
    if (apiKey.key !== undefined && accessToken.length > 0) {
      try {
        const data = await apiCall(`${API_PROFILES}/${userInfo.name}/?_bookings=true&_venues=true`, "GET", {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": apiKey.key,
        });
        setVenueBookingData(data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  }, [apiCall, apiKey.key, accessToken, userInfo.name]);

  useEffect(() => {
    fetchVenueBookingData();
  }, [fetchVenueBookingData]);
  // useEffect(() => {
  //   const fetchVenueBookingData = async () => {
  //     if (apiKey.key !== undefined && accessToken.length > 0) {
  //       apiCall(API_PROFILES + "/" + userInfo.name + "/?_bookings=true&_venues=true", "GET", {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${accessToken}`,
  //         "X-Noroff-API-Key": apiKey.key,
  //       })
  //         .then((data) => {
  //           setVenueBookingData(data.data);
  //         })
  //         .catch((error) => console.error("Error fetching data:", error));
  //     }
  //   };

  //   fetchVenueBookingData();
  // }, [apiCall, apiKey.key, accessToken, userInfo.name]);

  const handleSeeCreateVenue = (id) => {
    if (venueIdToShow === id) {
      setIsCreateVenueShown(false);
    } else {
      setIsCreateVenueShown(true);
    }
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
    setTimeout(() => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setIsCreateVenueShown(false);
        setIsVenueEditFormShown(false);
        setIsVenueBookingsShown(false);
        setVenueIdToShow(null);
      }
    }, 0);
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

  return (
    <div className="flex flex-col items-center">
      {venueBookingData.venueManager === true && (
        <div className="flex-col mt-5">
          {venueBookingData.bookings ? (
            venueBookingData.venues.length === 0 ? (
              <p>No venues found.</p>
            ) : (
              <div>
                <div className="flex justify-center mb-5">
                  <button className="btnStyle w-44" onClick={handleSeeCreateVenue}>
                    Create new Venue
                  </button>
                </div>
                {isCreateVenueShown && (
                  <div className="overlay">
                    <div ref={divRef} className="modulePosition w-box340 h-5/6 rounded-lg border-2 border-greyBlur sm:w-box610 lg:w-box900">
                      <CreateVenue
                        setVenueBookingData={setVenueBookingData}
                        handleCloseBtn={handleCloseBtn}
                        setIsCreateVenueShown={setIsCreateVenueShown}
                      />
                    </div>
                  </div>
                )}
                <div
                  className={`flex flex-1 flex-col flex-wrap gap-7 md:flex-row md:gap-5 md:w-box700 lg:w-box820 xl:w-box1240 xxl:w-box1660 ${
                    venueBookingData.venues.length < 2 ? "md:justify-center" : "md:justify-normal"
                  } ${venueBookingData.venues.length < 3 ? "xl:justify-center" : "xl:justify-normal"} ${
                    venueBookingData.venues.length < 4 ? "xxl:justify-center" : "xxl:justify-normal"
                  }`}
                >
                  {venueBookingData.venues.map((venue) => (
                    <div key={venue.id} className="self-center overflow-hidden w-box300 sm:w-box490 md:w-box340 lg:w-box400">
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
                          <div ref={divRef} className="modulePosition w-box340 h-5/6 rounded-lg border-2 border-greyBlur sm:w-box610 lg:w-box900">
                            <VenueEdit
                              setVenueIdToShow={setVenueIdToShow}
                              setIsVenueBookingsShown={setIsVenueBookingsShown}
                              setVenueBookingData={setVenueBookingData}
                              fetchVenueBookingData={fetchVenueBookingData}
                              // fetchVenueBookingData={() => {
                              //   const fetchVenueBookingData = async () => {
                              //     if (apiKey.key !== undefined && accessToken.length > 0) {
                              //       apiCall(API_PROFILES + "/" + userInfo.name + "/?_bookings=true&_venues=true", "GET", {
                              //         "Content-Type": "application/json",
                              //         Authorization: `Bearer ${accessToken}`,
                              //         "X-Noroff-API-Key": apiKey.key,
                              //       })
                              //         .then((data) => {
                              //           setVenueBookingData(data.data);
                              //         })
                              //         .catch((error) => console.error("Error fetching data:", error));
                              //     }
                              //   };
                              //   fetchVenueBookingData();
                              // }}
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
                          <div ref={divRef} className="modulePosition w-box340 h-5/6 rounded-lg border-2 border-greyBlur sm:w-box610 lg:w-box900">
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
