// import { API_VENUES } from "../../shared/apis";
// import useFetchApi from "../../hooks/useFetchApi";
import { useParams } from "react-router-dom";
import useVenues from "../../store/venueLocations";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { API_BOOKINGS, API_VENUES } from "../../shared/apis";
import usePostApiKey from "../../hooks/usePostApiKey";
import useLocalStorage from "../../hooks/useLocalStorage";
import useApiCall from "../../hooks/useApiCall";

function VenueInfo() {
  const { apiKey } = usePostApiKey();
  const { accessToken } = useLocalStorage();
  const { id } = useParams();
  // const { venues, fetchVenues, validateField } = useVenues();
  const { validateField } = useVenues();
  // const [venues, setVenues] = useState(null);
  const [venue, setVenue] = useState(null);
  // const [selectedDate, setSelectedDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [formState, setFormState] = useState({
    dateFrom: "",
    dateTo: "",
    guests: "",
    venueId: "",
  });

  const [errors, setErrors] = useState({
    dateFrom: "",
    dateTo: "",
    guests: "",
  });

  const [selecting, setSelecting] = useState(true);

  console.log("venuevenue", venue);
  const apiCall = useApiCall();

  console.log("formState", formState);
  const onDateChange = (value) => {
    if (selecting) {
      setFormState({
        dateFrom: value,
        dateTo: null,
      });
      setSelecting(false);
    } else {
      setFormState({
        ...formState,
        dateTo: value,
      });
      setSelecting(true);
    }
  };

  useEffect(() => {
    if (startDate !== null && endDate !== null) {
      const oneDay = 24 * 60 * 60 * 1000;
      const daysDifference = Math.round(Math.abs((endDate - startDate) / oneDay) + 1);
      console.log("daysDifference:", daysDifference);
      const value = venue.price;
      const calculatedResult = daysDifference * value;
      console.log("calculateResult:", calculatedResult);
      setResult(calculatedResult);
    }
  }, [startDate, endDate, venue]);

  const handleStartDateChange = (e) => {
    setStartDate(new Date(e.target.value));
  };

  const handleEndDateChange = (e) => {
    setEndDate(new Date(e.target.value));
  };

  async function findVenue(apiCall, id, page = 1) {
    const data = await apiCall(API_VENUES + `?_bookings=true&_owner=true&page=${page}`, "GET", {
      "Content-Type": "application/json",
    });
    console.log("data", data);
    const foundVenue = data.data.find((venue) => venue.id.toString() === id);
    console.log("foundVenue", foundVenue);
    if (foundVenue) {
      return foundVenue;
    } else if (data.meta.isLastPage) {
      return null;
    } else {
      return findVenue(apiCall, id, data.meta.nextPage);
    }
  }

  useEffect(() => {
    findVenue(apiCall, id).then((foundVenue) => {
      console.log("foundVenue", foundVenue);
      setVenue(foundVenue);
    });
  }, [id]);

  if (!venue) {
    return <div className="loading"></div>;
  }

  const bookedDates = venue.bookings.map((booking) => ({
    from: new Date(booking.dateFrom),
    to: new Date(booking.dateTo),
  }));

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const updatedFormState = {
      ...formState,
      dateFrom: new Date(event.target.elements.dateFrom.value),
      dateTo: new Date(event.target.elements.dateTo.value),
      guests: Number(event.target.elements.guests.value),
      venueId: venue.id,
    };
    console.log("updatedFormState", updatedFormState);
    setFormState(updatedFormState);

    apiCall(
      API_BOOKINGS,
      "POST",
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey.key,
      },
      updatedFormState
    )
      .then((data) => {
        if (data.errors) {
          setErrorMessage(data.errors[0].message);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  return (
    <div>
      {!venue ? (
        <div className="loading"></div>
      ) : (
        <div className="venueSection flex-col" key={venue.id}>
          <div className="overflow-hidden self-center max-h-56 w-5/6 md:h-96  ">
            {venue.media[0] && <img src={venue.media[0].url} alt={venue.media[0].alt} className="object-contain" />}
          </div>
          <div className="flex justify-around lg:justify-between">
            <h2>{venue.name}</h2>
            <p className="text-end">⭐{venue.rating}</p>
          </div>
          {/* <div className="flex flex-col gap-7 lg:gap-0 lg:flex-row "> */}
          <div className="flex flex-col gap-7 lg:gap-0 lg:grid lg:grid-cols-2 ">
            <div className="flex flex-col justify-center items-center self-center min-h-128 lg:border-r-2 lg:px-5 xl:px-12">
              <div className="flex flex-col gap-4 max-w-56 sm:max-w-none sm:flex-row sm:justify-evenly sm:gap-20">
                <div className="min-w-48">
                  <h2>Location:</h2>
                  <div className="flex justify-between">
                    <p>Address:</p>
                    <p>{venue.location.address}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>City:</p>
                    <p>{venue.location.city}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Zip:</p>
                    <p>{venue.location.zip}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Country:</p>
                    <p>{venue.location.country}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Continent:</p>
                    <p>{venue.location.continent}</p>
                  </div>
                </div>
                <div className="min-w-48">
                  <h2>Amenities:</h2>
                  <div className="flex justify-between">
                    <p>Guests:</p>
                    <p>{venue.maxGuests}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Wifi:</p>
                    <p>{venue.meta.wifi ? "Yes" : "No"}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Parking:</p>
                    <p>{venue.meta.parking ? "Yes" : "No"}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Pets:</p>
                    <p>{venue.meta.pets ? "Yes" : "No"}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Breakfast:</p>
                    <p> {venue.meta.breakfast ? "Yes" : "No"}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Price per day:</p>
                    <p> {venue.price}</p>
                  </div>
                </div>
              </div>
              <p className="p-6 break-all">{venue.description}</p>
              <div className="min-w-48 sm:self-baseline">
                <h2>Venue manager:</h2>
                <div className="flex items-center justify-center gap-2.5">
                  <div className="h-12 w-12 overflow-hidden">
                    {venue.owner.avatar && <img src={venue.owner.avatar.url} alt={venue.owner.avatar.alt} className="rounded-full object-cover" />}
                  </div>
                  <p>{venue.owner.name}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center self-center gap-5 lg:border-l-2 lg:px-5 xl:px-12">
              <h2>Book Venue</h2>
              <p>Choose a date</p>
              <div>
                <Calendar onChange={onDateChange} value={formState.dateFrom} />
                <p>Start Date: {formState.dateFrom && formState.dateFrom.toString()}</p>
                <p>End Date: {formState.dateTo && formState.dateTo.toString()}</p>
              </div>
              {/* <Calendar
                className="react-calendar"
                // Other props...
                tileClassName={({ date, view }) => {
                  if (view === "month") {
                    // Check if the date falls within the selected range
                    if (startDate && endDate) {
                      const selectedRange = {
                        from: new Date(startDate),
                        to: new Date(endDate),
                      };
                      selectedRange.from.setHours(0, 0, 0, 0);
                      selectedRange.to.setHours(23, 59, 59, 999);

                      if (date >= selectedRange.from && date <= selectedRange.to) {
                        console.log("startDate", startDate);
                        console.log("endDate", endDate);
                        return "highlightBooking";
                      }
                    }
                    // Check if the date falls within any booking range
                    for (const booking of bookedDates) {
                      if (date >= booking.from && date <= booking.to) {
                        return "highlight";
                      }
                    }
                  }
                  return "available"; // Default class for other dates
                }}
                tileDisabled={({ date }) => {
                  // Disable interaction with booked dates and dates outside the selected range
                  return (
                    bookedDates.some((booking) => date >= booking.from && date <= booking.to) ||
                    (startDate && endDate && (date < startDate || date > endDate))
                  );
                }}
                minDate={new Date()}
              /> */}
              <form onSubmit={handleSubmit}>
                <div className="flex gap-12">
                  <div className="flex flex-col">
                    <label>Start Date:</label>
                    <input type="date" name="dateFrom" onBlur={handleBlur} onChange={handleStartDateChange} />
                    <span className="error">{errors.dateFrom}</span>
                  </div>
                  <div className="flex flex-col">
                    <label>End Date:</label>
                    <input type="date" name="dateTo" onBlur={handleBlur} onChange={handleEndDateChange} />
                    <span className="error">{errors.dateTo}</span>
                  </div>
                </div>
                <div className="flex">
                  <label>Guests:</label>
                  <input type="number" name="guests" min="1" max={venue.maxGuests} pattern="[0-9]*" onBlur={handleBlur}></input>
                  <span className="error">{errors.guests}</span>
                </div>
                <p>Total: {result}</p>
                <button type="submit" className="btnStyle">
                  Book Venue
                </button>
                {errorMessage && <span className="error">{errorMessage}</span>}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default VenueInfo;
