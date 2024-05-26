import { useEffect, useRef, useState } from "react";
import useGETProfileData from "../../hooks/useGETProfileData";
import usePostApiKey from "../../hooks/usePostApiKey";
import useLocalStorage from "../../hooks/useLocalStorage";
import { API_BOOKINGS } from "../../shared/apis";
import useApiCall from "../../hooks/useApiCall";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faWifi, faSquareParking, faMugHot, faPaw } from "@fortawesome/free-solid-svg-icons";
import { ConfirmationModal } from "../../util/ConfirmationModal";

/**
 * BookingEdit component allows users to edit their booking details.
 * @component
 * @param {function} setVenueIdToShow - Function to set the ID of the venue to show.
 * @param {function} setBooking - Function to set the booking details.
 * @param {string} venueId - The ID of the venue.
 * @param {function} handleCloseBtn - Function to handle closing the modal.
 * @param {function} onDeleteBooking - Function to delete a booking.
 * @returns {JSX.Element} - JSX element representing the BookingEdit component.
 * @example
 * // Example usage of BookingEdit component:
 * import BookingEdit from './BookingEdit';
 * <BookingEdit setVenueIdToShow={setVenueIdToShow} setBooking={setBooking} venueId={venueId} handleCloseBtn={handleCloseBtn} onDeleteBooking={onDeleteBooking} />
 */
function BookingEdit({ setVenueIdToShow, setBooking, venueId, handleCloseBtn, onDeleteBooking }) {
  const { apiKey } = usePostApiKey();
  const { accessToken } = useLocalStorage();
  const { profileData } = useGETProfileData();
  const [errorMessage, setErrorMessage] = useState("");

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [result, setResult] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [confirmHandler, setConfirmHandler] = useState(null);

  const [formState, setFormState] = useState({
    dateFrom: "",
    dateTo: "",
    guests: "",
  });

  const apiCall = useApiCall();

  const handleStartDateChange = (e) => {
    setStartDate(new Date(e.target.value));
  };

  const handleEndDateChange = (e) => {
    setEndDate(new Date(e.target.value));
  };

  let editVenueFilter;
  if (profileData && profileData.bookings) {
    editVenueFilter = profileData.bookings.filter((venue) => venue.id === venueId);
  }

  /**
   * Calculates and updates the result based on the start date, end date, and venue price.
   * Runs whenever there's a change in the start date, end date, or venue filter.
   */
  useEffect(() => {
    if (editVenueFilter) {
      const oneDay = 24 * 60 * 60 * 1000;
      const daysDifference = Math.round(Math.abs((endDate - startDate) / oneDay) + 1);
      const value = editVenueFilter[0].venue.price;
      const calculatedResult = daysDifference * value;
      setResult(calculatedResult);
    }
  }, [startDate, endDate, editVenueFilter]);

  /**
   * Formats a given date string to YYYY-MM-DD format.
   * @param {string} dateString - The date string to format.
   * @returns {string} The formatted date string in YYYY-MM-DD format.
   */
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  let dateFrom = "";
  let dateTo = "";
  if (editVenueFilter) {
    dateFrom = formatDate(editVenueFilter[0].dateFrom);
    dateTo = formatDate(editVenueFilter[0].dateTo);
  }
  const runCount = useRef(0);

  /**
   * useEffect hook that runs only once when the component mounts and if editVenueFilter exists.
   * It sets the start and end dates based on the initial values from editVenueFilter.
   * @param {function} handleStartDateChange - Function to handle start date change.
   * @param {function} handleEndDateChange - Function to handle end date change.
   * @param {object} editVenueFilter - Object containing venue filter data.
   * @param {object} runCount - Ref object to keep track of how many times the effect has run.
   */
  useEffect(() => {
    if (runCount.current === 0 && editVenueFilter) {
      handleStartDateChange({ target: { value: editVenueFilter[0].dateFrom } });
      handleEndDateChange({ target: { value: editVenueFilter[0].dateTo } });
      runCount.current += 1;
    }
  }, [editVenueFilter]);

  if (!editVenueFilter) {
    return (
      <div className="flex justify-center">
        <div className="loading flex justify-center"></div>
      </div>
    );
  }

  /**
   * Handles form submission for editing a booking.
   * @param {object} event - The form submission event.
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const updatedFormState = {
      ...formState,
      dateFrom: new Date(event.target.elements.dateFrom.value),
      dateTo: new Date(event.target.elements.dateTo.value),
      guests: Number(event.target.elements.guests.value),
    };
    const now = new Date();
    if (updatedFormState.dateFrom >= now) {
      console.log("The date is the same or after the current date and time.");
    } else {
      console.log("The date is before the current date and time.");
    }
    setFormState(updatedFormState);
    setShowModal(true);
    setActionType("submit");
    setConfirmHandler(() => () => handleConfirm(updatedFormState));
  };

  /**
   * Handles confirmation of editing or deleting a booking.
   * @param {object} updatedFormState - The updated form state containing booking details.
   */
  const handleConfirm = async (updatedFormState) => {
    setShowModal(false);
    try {
      const updatedProfileData = await apiCall(
        API_BOOKINGS + "/" + venueId,
        "PUT",
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": apiKey.key,
        },
        updatedFormState
      );
      if (!updatedProfileData.errors) {
        setBooking((prevVenues) =>
          prevVenues.map((venue) => (venue.id === updatedProfileData.data.id ? { ...venue, ...updatedProfileData.data } : venue))
        );
        handleCloseBtn();
      } else {
        console.log("Error:", updatedProfileData.errors[0].message);
        setErrorMessage("There was an error: " + updatedProfileData.errors[0].message);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  /**
   * Handles the initiation of the booking deletion process.
   */
  const handleDelete = async () => {
    setShowModal(true);
    setActionType("delete");
    setConfirmHandler(() => handleDeleteConfirm);
  };

  /**
   * Handles the confirmation of booking deletion.
   * Initiates the deletion of the booking from the backend.
   * If successful, updates the state to remove the booking and resets the venue to show.
   * If unsuccessful, sets an error message.
   */
  const handleDeleteConfirm = async () => {
    setShowModal(false);

    try {
      const updatedProfileData = await apiCall(API_BOOKINGS + "/" + venueId, "DELETE", {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey.key,
      });

      if (!updatedProfileData) {
        onDeleteBooking(venueId);
        setVenueIdToShow(null);
      } else {
        console.log("Error:", updatedProfileData.errors[0].message);
        setErrorMessage("There was an error: " + updatedProfileData.errors[0].message);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  /**
   * Cancels the current action and closes the confirmation modal.
   */
  const handleCancel = () => {
    setShowModal(false);
  };

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);

  return (
    <div className="flex flex-col justify-center">
      <div className="self-end">
        <button className="btnStyle" onClick={handleCloseBtn}>
          Close
        </button>
      </div>
      <div className="flex justify-center">
        {!editVenueFilter ? (
          <div className="flex justify-center">
            <div className="loading flex justify-center"></div>
          </div>
        ) : (
          <div>
            <div>
              <div className="imgBox pt-2.5">
                {editVenueFilter[0].venue.media[0] ? (
                  <img src={editVenueFilter[0].venue.media[0].url} alt={editVenueFilter[0].venue.media[0].alt} />
                ) : (
                  <img src="https://images.unsplash.com/photo-1579547945413-497e1b99dac0" alt="Venue" />
                )}
              </div>
              <div className="p-3">
                <div className="flex justify-between text-xl">
                  <h2>{editVenueFilter[0].venue.name || "Venue Name Not Available"}</h2>
                  <div className="flex gap-1 text-xl">
                    <p className="text-star">
                      <FontAwesomeIcon icon={faStar} />
                    </p>
                    <p>{editVenueFilter[0].venue.rating}</p>
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-2.5 items-center text-lg">
                  <div className="flex flex-col w-64">
                    <div className="flex justify-between bg-greyBlur px-1">
                      <h3>Country:</h3>
                      <h3>{editVenueFilter[0].venue.location.country || "Country Name Not Available"}</h3>
                    </div>
                    <div className="flex justify-between px-1">
                      <h3>City:</h3>
                      <h3>{editVenueFilter[0].venue.location.city || "City Not Available"}</h3>
                    </div>
                    <div className="flex justify-between bg-greyBlur px-1">
                      <h3>Address:</h3>
                      <h3>{editVenueFilter[0].venue.location.address || "Address Not Available"}</h3>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <div className="flex flex-col w-64">
                      <div className="flex justify-between px-1">
                        <h3>Guests:</h3>
                        <h3>{editVenueFilter[0].venue.maxGuests}</h3>
                      </div>
                      <div className="flex justify-between bg-greyBlur px-1">
                        <h3>Price per night:</h3>
                        <h3>{editVenueFilter[0].venue.price}</h3>
                      </div>
                    </div>
                    <div className="flex justify-center h-10 gap-2.5">
                      {editVenueFilter[0].venue.meta.wifi && (
                        <div className="metaIconTrue">
                          <FontAwesomeIcon icon={faWifi} />
                          <span className="sr-only">Wifi included</span>
                        </div>
                      )}
                      {editVenueFilter[0].venue.meta.parking && (
                        <div className="metaIconTrue">
                          <FontAwesomeIcon icon={faSquareParking} />
                          <span className="sr-only">Parking available</span>
                        </div>
                      )}
                      {editVenueFilter[0].venue.meta.breakfast && (
                        <div className="metaIconTrue">
                          <FontAwesomeIcon icon={faMugHot} />
                          <span className="sr-only">Breakfast included</span>
                        </div>
                      )}
                      {editVenueFilter[0].venue.meta.pets && (
                        <div className="metaIconTrue">
                          <FontAwesomeIcon icon={faPaw} />
                          <span className="sr-only">Pets permitted</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="text-lg">
              <div className="flex gap-12 justify-center">
                <div className="flex flex-col items-center">
                  <label htmlFor="dateFrom">Start Date:</label>
                  <input
                    type="date"
                    id="dateFrom"
                    name="dateFrom"
                    min={currentDate.toISOString().split("T")[0]}
                    defaultValue={dateFrom}
                    onChange={handleStartDateChange}
                  />
                </div>
                <div className="flex flex-col items-center">
                  <label htmlFor="dateTo">End Date:</label>
                  <input
                    type="date"
                    id="dateTo"
                    name="dateTo"
                    min={currentDate.toISOString().split("T")[0]}
                    defaultValue={dateTo}
                    onChange={handleEndDateChange}
                  />
                </div>
              </div>
              <div className="flex justify-center my-2.5 gap-2">
                <label htmlFor="guests">Guests:</label>
                <select type="number" id="guests" name="guests" defaultValue={editVenueFilter[0].guests} className="bg-greyBlur w-20 pl-1">
                  {[...Array(editVenueFilter[0].venue.maxGuests)].map((_, index) => (
                    <option key={index + 1} value={index + 1}>
                      {index + 1}
                    </option>
                  ))}
                </select>
              </div>
              <p className="flex justify-center">Total: {result}</p>
              <div className="flex justify-center mt-4">
                <button type="submit" className="btnStyle alternativeBtnStyle w-72 md:w-form500">
                  Edit Booking
                </button>
              </div>
            </form>
            <div className="flex justify-center mt-5">
              <button type="delete" className="btnStyle alternativeBtnStyle w-72 md:w-form500" onClick={handleDelete}>
                Cancel Booking
              </button>
            </div>
            {showModal && (
              <ConfirmationModal
                message={actionType === "submit" ? "Are you sure you want to edit this booking?" : "Are you sure you want to delete this booking?"}
                onConfirm={confirmHandler}
                onCancel={handleCancel}
                containerClassName="overlayCheck bookingEditModuleHight"
                contentClassName="modulePosition flex flex-col justify-center rounded-lg"
                buttonClassName={{ confirm: "bg-green", deny: "bg-redish" }}
              />
            )}

            {errorMessage && <span className="error flex justify-center pt-2.5 text-xl">{errorMessage}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingEdit;
