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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesRight, faWifi, faSquareParking, faMugHot, faPaw } from "@fortawesome/free-solid-svg-icons";

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
  const [successMessage, setSuccessMessage] = useState("");
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
      // console.log("daysDifference:", daysDifference);
      const value = venue.price;
      const calculatedResult = daysDifference * value;
      // console.log("calculateResult:", calculatedResult);
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
    // console.log("data", data);
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
      // console.log("foundVenue", foundVenue);
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
    // console.log("updatedFormState", updatedFormState);
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
        } else {
          setSuccessMessage("Your order has been registered. You can now find it on your profile page.");
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  return (
    <div>
      {!venue ? (
        <div className="loading"></div>
      ) : (
        <div className="venueSection textBreakStyle flex-col pt-8" key={venue.id}>
          <div className="overflow-hidden self-center max-h-56 w-5/6 md:h-96  ">
            {venue.media[0] && <img src={venue.media[0].url} alt={venue.media[0].alt} className="object-contain" />}
          </div>
          {/* <div className="flex flex-col gap-7 lg:gap-0 lg:flex-row "> */}
          <div className="flex flex-col gap-7 lg:gap-0 lg:grid lg:grid-cols-2 ">
            <div className="flex flex-col justify-center items-center self-center min-h-128 lg:border-r-2 lg:px-5 xl:px-12">
              <div className="flex justify-around items-center w-64 sm:w-box510 sm:justify-start sm:gap-48">
                <h2 className="text-2xl font-bold break-words">{venue.name}</h2>
                <p className="text-end w-11 text-lg">⭐{venue.rating}</p>
              </div>
              <div className="flex flex-col items-center gap-4 w-64 sm:flex-row sm:justify-evenly sm:gap-20">
                <div className="flex flex-col gap-2.5 min-w-60 ">
                  <div className="flex justify-between px-1 text-lg">
                    <p>Guests:</p>
                    <p>{venue.maxGuests}</p>
                  </div>
                  <div className="flex justify-between bg-greyBlur px-1 text-lg">
                    <p>Price per day:</p>
                    <p> {venue.price}</p>
                  </div>
                  <div className="flex flex-col gap-2.5 min-w-48 pt-2.5">
                    <h2 className="text-xl font-semibold">Location:</h2>
                    <div className="flex justify-between bg-greyBlur px-1 text-lg flex-wrap">
                      <p>Address:</p>
                      <p>{venue.location.address}</p>
                    </div>
                    <div className="flex justify-between px-1 text-lg flex-wrap">
                      <p>City:</p>
                      <p>{venue.location.city}</p>
                    </div>
                    <div className="flex justify-between bg-greyBlur px-1 text-lg flex-wrap">
                      <p>Zip:</p>
                      <p>{venue.location.zip}</p>
                    </div>
                    <div className="flex justify-between px-1 text-lg flex-wrap">
                      <p>Country:</p>
                      <p>{venue.location.country}</p>
                    </div>
                    <div className="flex justify-between bg-greyBlur px-1 text-lg flex-wrap">
                      <p>Continent:</p>
                      <p>{venue.location.continent}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center min-w-48">
                  <h2 className="text-xl font-semibold">Amenities:</h2>
                  <div className="flex flex-wrap gap-2.5 justify-center pt-2.5">
                    {venue.meta.wifi && (
                      <div className="flex flex-col items-center w-24 text-lg">
                        <h3 title="Wifi included" className="metaIconTrue">
                          <FontAwesomeIcon icon={faWifi} />
                        </h3>
                        <p>Wifi</p>
                      </div>
                    )}
                    {venue.meta.parking && (
                      <div className="flex flex-col items-center w-24 text-lg">
                        <h3 title="Parking available" className="metaIconTrue">
                          <FontAwesomeIcon icon={faSquareParking} />
                        </h3>
                        <p>Parking</p>
                      </div>
                    )}
                    {venue.meta.breakfast && (
                      <div className="flex flex-col items-center w-24 text-lg">
                        <h3 title="Breakfast included" className="metaIconTrue">
                          <FontAwesomeIcon icon={faMugHot} />
                        </h3>
                        <p>Breakfast</p>
                      </div>
                    )}
                    {venue.meta.pets && (
                      <div className="flex flex-col items-center w-24 text-lg">
                        <h3 title="Pets permitted" className="metaIconTrue">
                          <FontAwesomeIcon icon={faPaw} />
                        </h3>
                        <p>Pets</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col p-6 gap-2.5 max-w-box565">
                <h2 className="text-xl font-semibold">Description</h2>
                <p className="break-all text-lg">{venue.description}</p>
                <div className="min-w-48 sm:self-baseline">
                  <h2 className="text-xl font-semibold">Venue manager:</h2>
                  <div className="flex items-center justify-start gap-2.5">
                    <div className="h-12 w-12 overflow-hidden">
                      {venue.owner.avatar && <img src={venue.owner.avatar.url} alt={venue.owner.avatar.alt} className="rounded-full object-cover" />}
                    </div>
                    <p className="text-lg">{venue.owner.name}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center self-center gap-5 lg:border-l-2 lg:px-5 xl:px-12">
              <h2 className="text-2xl font-bold">Book Venue</h2>
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
              <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
                <div>
                  <p className="text-xl font-semibold">Choose a date</p>
                  <Calendar
                    onChange={onDateChange}
                    value={formState.dateFrom}
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
                  />
                  <p>Start Date: {formState.dateFrom && formState.dateFrom.toString()}</p>
                  <p>End Date: {formState.dateTo && formState.dateTo.toString()}</p>
                </div>
                {/* <div className="flex gap-12">
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
                </div> */}
                <div className="flex text-lg">
                  <label>Guests:</label>
                  <input type="number" name="guests" min="1" max={venue.maxGuests} pattern="[0-9]*" onBlur={handleBlur}></input>
                  <span className="error">{errors.guests}</span>
                </div>
                <p className="text-xl font-semibold">Total: {result}</p>
                <button type="submit" className="btnStyle">
                  Book Venue
                </button>
                {successMessage && <span className="error">{successMessage}</span>}
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
