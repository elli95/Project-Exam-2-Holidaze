import { useEffect, useRef, useState } from "react";
import useGETProfileData from "../../hooks/useGETProfileData";
import usePostApiKey from "../../hooks/usePostApiKey";
import useLocalStorage from "../../hooks/useLocalStorage";
import { API_BOOKINGS } from "../../shared/apis";
import useApiCall from "../../hooks/useApiCall";
import useVenues from "../../store/venueLocations";

function BookingEdit({ setVenueBookingData = () => {}, venueId }) {
  const { validateField } = useVenues();
  const { apiKey } = usePostApiKey();
  const { accessToken } = useLocalStorage();
  const { profileData } = useGETProfileData();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [result, setResult] = useState(null);

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
    console.log("hello", new Date(e.target.value));
    setStartDate(new Date(e.target.value));
  };

  const handleEndDateChange = (e) => {
    setEndDate(new Date(e.target.value));
  };

  let editVenueFilter;
  if (profileData && profileData.bookings) {
    editVenueFilter = profileData.bookings.filter((venue) => venue.id === venueId);
    console.log("editVenueFilter", editVenueFilter[0]);
  } else {
    console.log("problem?");
  }

  useEffect(() => {
    if (editVenueFilter) {
      const oneDay = 24 * 60 * 60 * 1000;
      const daysDifference = Math.round(Math.abs((endDate - startDate) / oneDay) + 1);
      console.log("daysDifference:", daysDifference);
      const value = editVenueFilter[0].venue.price;
      const calculatedResult = daysDifference * value;
      console.log("calculateResult:", calculatedResult);
      setResult(calculatedResult);
    }
  }, [startDate, endDate, editVenueFilter]);

  console.log("startDate :", startDate);
  console.log("endDate:", endDate);

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

  console.log("dateFrom dateTo", dateFrom, dateTo);

  if (!editVenueFilter) {
    return <div className="loading"></div>;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const updatedFormState = {
      ...formState,
      dateFrom: new Date(event.target.elements.dateFrom.value),
      dateTo: new Date(event.target.elements.dateTo.value),
      guests: Number(event.target.elements.guests.value),
    };
    console.log("Form submitted:", updatedFormState);
    setFormState(updatedFormState);

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
      console.log("try", updatedProfileData.data);
      setVenueBookingData((prevState) => ({
        ...prevState,
        bookings: prevState.bookings.map((booking) =>
          booking.id === updatedProfileData.data.id
            ? {
                ...booking,
                dateFrom: updatedProfileData.data.dateFrom,
                dateTo: updatedProfileData.data.dateTo,
                guests: updatedProfileData.data.guests,
              }
            : booking
        ),
      }));
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };
  console.log("formState", formState);

  const handleDelete = async () => {
    console.log("hello :D");

    try {
      const updatedProfileData = await apiCall(API_BOOKINGS + "/" + venueId, "DELETE", {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey.key,
      });

      console.log("hello :D");
      console.log("try", updatedProfileData.data);
      setVenueBookingData((prevState) => ({
        ...prevState,
        // bookings: prevState.bookings.filter((booking) => booking.id !== venueId),
      }));
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
    // .then(() => fetchVenueBookingData())
    // .catch((error) => console.error("Error updating data:", error));
  };

  return (
    <div>
      <div>
        <h2>Create A Venue</h2>
        {!editVenueFilter ? (
          <div className="loading"></div>
        ) : (
          <div>
            <form onSubmit={handleSubmit}>
              <div className="flex gap-12">
                <div className="flex flex-col">
                  <label>Start Date:</label>
                  <input type="date" name="dateFrom" defaultValue={dateFrom} onBlur={handleBlur} onChange={handleStartDateChange} />
                  <span className="error">{errors.dateFrom}</span>
                </div>
                <div className="flex flex-col">
                  <label>End Date:</label>
                  <input type="date" name="dateTo" defaultValue={dateTo} onBlur={handleBlur} onChange={handleEndDateChange} />
                  <span className="error">{errors.dateTo}</span>
                </div>
              </div>
              <div className="flex">
                <label>Guests:</label>
                <input
                  type="number"
                  name="guests"
                  min="1"
                  max={editVenueFilter[0].venue.maxGuests}
                  pattern="[0-9]*"
                  defaultValue={editVenueFilter[0].guests}
                  onBlur={handleBlur}
                ></input>
                <span className="error">{errors.guests}</span>
              </div>
              <p>
                Total: {editVenueFilter[0].venue.price} or {result}
              </p>
              <button type="submit" className="btnStyle">
                Book Booking
              </button>
            </form>
            <button type="delete" className="btnStyle" onClick={handleDelete}>
              Delete Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingEdit;
