import { useEffect, useRef, useState } from "react";
import CreateVenue from "../CreateVenue";
import { Link } from "react-router-dom";
import VenueEdit from "../VenueEdit";
import VenueBookings from "../VenueBookings";
import useGETProfileData from "../../hooks/useGETProfileData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faWifi, faSquareParking, faMugHot, faPaw } from "@fortawesome/free-solid-svg-icons";

/**
 * ProfileVenues component to manage and display the user's venues.
 * It allows the user to create, edit, and view bookings for their venues.
 *
 * @returns {JSX.Element} The ProfileVenues component.
 */
function ProfileVenues() {
  const [venues, setVenues] = useState([]);
  const [isVenueEditFormShown, setIsVenueEditFormShown] = useState(false);
  const [isVenueBookingsShown, setIsVenueBookingsShown] = useState(false);
  const [isCreateVenueShown, setIsCreateVenueShown] = useState(false);
  const [venueIdToShow, setVenueIdToShow] = useState(null);
  const { profileData } = useGETProfileData();

  const divRef = useRef(null);

  // Update venues state when profileData changes
  useEffect(() => {
    if (profileData && profileData.venues) {
      setVenues(profileData.venues);
    }
  }, [profileData]);

  /**
   * Toggles the visibility of the create venue form.
   */
  const handleSeeCreateVenue = () => {
    setIsCreateVenueShown((prev) => !prev);
  };

  /**
   * Handles the visibility of the venue edit form.
   * @param {string} id - The ID of the venue to edit.
   */
  const handleCreateVenueForm = (id) => {
    if (venueIdToShow === id) {
      setVenueIdToShow(null);
      setIsVenueEditFormShown(false);
    } else {
      setVenueIdToShow(id);
      setIsVenueEditFormShown(true);
    }
  };

  /**
   * Handles the visibility of the venue bookings.
   * @param {string} id - The ID of the venue to view bookings for.
   */
  const handleSeeVenueBookings = (id) => {
    if (venueIdToShow === id) {
      setVenueIdToShow(null);
      setIsVenueBookingsShown(false);
    } else {
      setVenueIdToShow(id);
      setIsVenueBookingsShown(true);
    }
  };

  /**
   * Handles click events outside of the referenced div to close any open forms or views.
   * @param {Event} event - The DOM event.
   */
  const handleClickOutside = (event) => {
    if (divRef.current && !divRef.current.contains(event.target)) {
      setIsCreateVenueShown(false);
      setIsVenueEditFormShown(false);
      setIsVenueBookingsShown(false);
      setVenueIdToShow(null);
    }
  };

  // Add event listener to detect clicks outside the component
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /**
   * Closes all open forms and views.
   */
  const handleCloseBtn = () => {
    setVenueIdToShow(null);
    setIsCreateVenueShown(false);
    setIsVenueEditFormShown(false);
    setIsVenueBookingsShown(false);
  };

  /**
   * Deletes a venue from the list.
   * @param {string} venueId - The ID of the venue to delete.
   */
  const handleDeleteVenue = (venueId) => {
    setVenues((prevVenues) => prevVenues.filter((venue) => venue.id !== venueId));
  };

  return (
    <div className="flex flex-col items-center">
      {profileData?.venueManager && (
        <div className="flex-col mt-5">
          <div className="flex justify-center mb-5">
            <button className="bg-white btnStyle w-44" onClick={handleSeeCreateVenue}>
              Create new Venue
            </button>
          </div>
          {profileData.bookings ? (
            venues.length === 0 ? (
              <p>No venues found.</p>
            ) : (
              <div>
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
                        <div className="flex flex-col gap-2.5 h-48 p-3">
                          <div className="flex justify-between text-xl">
                            <h2 className="whitespace-nowrap overflow-hidden w-270">{venue.name || "Venue Name Not Available"}</h2>
                            <div className="flex gap-1 text-xl">
                              <p className="text-star">
                                <FontAwesomeIcon icon={faStar} />
                              </p>
                              <p>{venue.rating}</p>
                            </div>
                          </div>
                          <div className="flex justify-between  text-lg">
                            <div>
                              <h3>{venue.location.country || "Country Not Available"}</h3>
                              <p>{venue.location.city || "City Not Available"}</p>
                            </div>
                          </div>
                          <div className="flex h-10 gap-2.5">
                            {venue.meta.wifi && (
                              <div title="Wifi included" className="metaIconTrue">
                                <FontAwesomeIcon icon={faWifi} />
                                <span className="sr-only">Wifi included</span>
                              </div>
                            )}
                            {venue.meta.parking && (
                              <div title="Parking available" className="metaIconTrue">
                                <FontAwesomeIcon icon={faSquareParking} />
                                <span className="sr-only">Parking available</span>
                              </div>
                            )}
                            {venue.meta.breakfast && (
                              <div title="Breakfast included" className="metaIconTrue">
                                <FontAwesomeIcon icon={faMugHot} />
                                <span className="sr-only">Breakfast included</span>
                              </div>
                            )}
                            {venue.meta.pets && (
                              <div title="Pets permitted" className="metaIconTrue">
                                <FontAwesomeIcon icon={faPaw} />
                                <span className="sr-only">Pets permitted</span>
                              </div>
                            )}
                          </div>
                          <p className="text-xl">{venue.price} $ Per Night</p>
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
            <div className="flex justify-center">
              <div className="loading flex justify-center"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProfileVenues;
