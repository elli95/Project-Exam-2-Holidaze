import { useEffect, useRef, useState } from "react";
import useGETProfileData from "../../hooks/useGETProfileData";
import usePostApiKey from "../../hooks/usePostApiKey";
import useLocalStorage from "../../hooks/useLocalStorage";
import { API_BOOKINGS } from "../../shared/apis";
import useApiCall from "../../hooks/useApiCall";
import useVenues from "../../store/venueLocations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWifi, faSquareParking, faMugHot, faPaw } from "@fortawesome/free-solid-svg-icons";

// function BookingEdit({ setVenueBookingData = () => {}, fetchVenueBookingData = () => {}, venueId }) {
function BookingEdit({ setVenueIdToShow, setBooking, venueId, handleCloseBtn, onDeleteBooking }) {
  const { validateField } = useVenues();
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

  const [errors, setErrors] = useState({
    dateFrom: "",
    dateTo: "",
    guests: "",
  });

  const handleBlur = (event) => {
    const { name, value } = event.target;
    const newErrors = { ...errors };

    switch (name) {
      case "dateFrom":
      case "dateTo":
        newErrors[name] = validateField(value, "date") ? "" : "You must choose an available date";
        break;
      case "guests":
        newErrors[name] = validateField(value, "numbersOnly") ? "" : "Enter a valid number of guests";
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

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

  useEffect(() => {
    if (editVenueFilter) {
      const oneDay = 24 * 60 * 60 * 1000;
      const daysDifference = Math.round(Math.abs((endDate - startDate) / oneDay) + 1);
      const value = editVenueFilter[0].venue.price;
      const calculatedResult = daysDifference * value;
      setResult(calculatedResult);
    }
  }, [startDate, endDate, editVenueFilter]);

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

  useEffect(() => {
    if (runCount.current === 0 && editVenueFilter) {
      handleStartDateChange({ target: { value: editVenueFilter[0].dateFrom } });
      handleEndDateChange({ target: { value: editVenueFilter[0].dateTo } });
      runCount.current += 1;
    }
  }, [editVenueFilter]);

  if (!editVenueFilter) {
    return <div className="loading"></div>;
  }

  const ConfirmationModal = ({ onConfirm, onCancel }) => {
    const message = actionType === "submit" ? "Are you sure you want to edit this booking?" : "Are you sure you want to cancel this booking?";
    return (
      <div className="overlayCheck" onTouchStart={(e) => e.stopPropagation()}>
        <div className="modulePosition flex flex-col justify-center rounded-lg">
          <p className="text-xl text-center">{message}</p>
          <div className="flex gap-5 justify-evenly pt-5">
            <button className="btnStyle confirmBtn w-24 bg-green" onClick={onConfirm}>
              Yes
            </button>
            <button className="btnStyle denyBtn w-24 bg-redish" onClick={onCancel}>
              No
            </button>
          </div>
        </div>
      </div>
    );
  };

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
    console.log("handleConfirm:", confirmHandler);
  };

  // console.log("handleConfirm2:", confirmHandler);
  // console.log("formState out:", formState);

  const handleConfirm = async (updatedFormState) => {
    // console.log("formState:", updatedFormState);
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
      console.log("try", updatedProfileData);
      if (!updatedProfileData.errors) {
        setBooking((prevVenues) =>
          prevVenues.map((venue) => (venue.id === updatedProfileData.data.id ? { ...venue, ...updatedProfileData.data } : venue))
        );
        handleCloseBtn();
        // setVenueIdToShow(null);
        // setIsVenueBookingsShown(false);
        // setIsBookingsShown(false);
      } else {
        console.log("Error:", updatedProfileData);
        console.log("Error:", updatedProfileData.errors[0].message);
        setErrorMessage("There was an error: " + updatedProfileData.errors[0].message);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleDelete = async () => {
    console.log("hello :D");
    setShowModal(true);
    setActionType("delete");
    setConfirmHandler(() => handleDeleteConfirm);
  };

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
        // setIsCreateBookingShown(false);
        // fetchBookingData();
      } else {
        console.log("Error:", updatedProfileData.errors[0].message);
        setErrorMessage("There was an error: " + updatedProfileData.errors[0].message);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

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
          <div className="loading flex self-center"></div>
        ) : (
          <div>
            <div>
              <div className="imgBox">
                {editVenueFilter[0].venue.media[0] && <img src={editVenueFilter[0].venue.media[0].url} alt={editVenueFilter[0].venue.media[0].alt} />}
              </div>
              <div className="p-3">
                <div className="flex justify-between">
                  <h2>{editVenueFilter[0].venue.name}</h2>
                  <p>⭐{editVenueFilter[0].venue.rating}</p>
                </div>
                <div className="flex flex-col justify-center gap-2.5 items-center">
                  <div className="flex flex-col w-64">
                    <div className="flex justify-between bg-greyBlur px-1">
                      <h3>Country:</h3>
                      <h3>{editVenueFilter[0].venue.location.country}</h3>
                    </div>
                    <div className="flex justify-between px-1">
                      <h3>City:</h3>
                      <h3>{editVenueFilter[0].venue.location.city}</h3>
                    </div>
                    <div className="flex justify-between bg-greyBlur px-1">
                      <h3>Address:</h3>
                      <h3>{editVenueFilter[0].venue.location.address}</h3>
                    </div>
                  </div>
                  <div>
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
                    <div className="flex justify-between w-64 gap-2 py-2">
                      <h3
                        title={`Wifi${editVenueFilter[0].venue.meta.wifi ? "" : " not"} included`}
                        className={`${editVenueFilter[0].venue.meta.wifi ? "metaIconTrue" : "metaIconFalse"}`}
                      >
                        <FontAwesomeIcon icon={faWifi} />
                      </h3>
                      <h3
                        title={`Parking${editVenueFilter[0].venue.meta.parking ? "" : " not"} available`}
                        className={`${editVenueFilter[0].venue.meta.parking ? "metaIconTrue" : "metaIconFalse"}`}
                      >
                        <FontAwesomeIcon icon={faSquareParking} />
                      </h3>
                      <h3
                        title={`Breakfast${editVenueFilter[0].venue.meta.breakfast ? "" : " not"} included`}
                        className={`${editVenueFilter[0].venue.meta.breakfast ? "metaIconTrue" : "metaIconFalse"}`}
                      >
                        <FontAwesomeIcon icon={faMugHot} />
                      </h3>
                      <h3
                        title={` ${editVenueFilter[0].venue.meta.pets ? "Pets" : "No pets"} permitted`}
                        className={`${editVenueFilter[0].venue.meta.pets ? "metaIconTrue" : "metaIconFalse"}`}
                      >
                        <FontAwesomeIcon icon={faPaw} />
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="flex gap-12 justify-center">
                <div className="flex flex-col items-center">
                  <label>Start Date:</label>
                  <input
                    type="date"
                    name="dateFrom"
                    min={currentDate.toISOString().split("T")[0]}
                    defaultValue={dateFrom}
                    onBlur={handleBlur}
                    onChange={handleStartDateChange}
                  />
                  <span className="error">{errors.dateFrom}</span>
                </div>
                <div className="flex flex-col items-center">
                  <label>End Date:</label>
                  <input
                    type="date"
                    name="dateTo"
                    min={currentDate.toISOString().split("T")[0]}
                    defaultValue={dateTo}
                    onBlur={handleBlur}
                    onChange={handleEndDateChange}
                  />
                  <span className="error">{errors.dateTo}</span>
                </div>
              </div>
              <div className="flex justify-center my-2.5 gap-2">
                <label>Guests:</label>
                <select type="number" name="guests" onBlur={handleBlur} defaultValue={editVenueFilter[0].guests} className="bg-greyBlur w-20 pl-1">
                  {[...Array(editVenueFilter[0].venue.maxGuests)].map((_, index) => (
                    <option key={index + 1} value={index + 1}>
                      {index + 1}
                    </option>
                  ))}
                </select>
                {/* <input
                  type="number"
                  name="guests"
                  min="1"
                  max={editVenueFilter[0].venue.maxGuests}
                  pattern="[0-9]*"
                  defaultValue={editVenueFilter[0].guests}
                  onBlur={handleBlur}
                  className="bg-greyBlur w-20 pl-1"
                ></input> */}
                <span className="error">{errors.guests}</span>
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
            {/* {showModal && <ConfirmationModal onConfirm={handleDeleteConfirm} onCancel={handleCancel} />} */}
            {/* {showModal && <ConfirmationModal onConfirm={handleConfirm} onCancel={handleCancel} />} */}
            {showModal && <ConfirmationModal onConfirm={confirmHandler} onCancel={handleCancel} />}

            {errorMessage && <span className="error flex justify-center pt-2.5 text-xl">{errorMessage}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingEdit;
