import { useParams } from "react-router-dom";
import useVenues from "../../store/venueLocations";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { API_BOOKINGS } from "../../shared/apis";
import usePostApiKey from "../../hooks/usePostApiKey";
import useLocalStorage from "../../hooks/useLocalStorage";
import useApiCall from "../../hooks/useApiCall";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWifi, faSquareParking, faMugHot, faPaw } from "@fortawesome/free-solid-svg-icons";
import useVenueApiCall from "../../hooks/useVenueApiCall";

function VenueInfo() {
  const { apiKey } = usePostApiKey();
  const { accessToken } = useLocalStorage();
  const { id } = useParams();
  const { validateField } = useVenues();
  const [venue, setVenue] = useState(null);
  // const [selectedDate, setSelectedDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [result, setResult] = useState(null);
  const [selectedImage, setSelectedImage] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(40);
  const { venues, meta } = useVenueApiCall(currentPage, itemsPerPage);

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

  // useEffect(() => {
  //   setSelectedImage(venue.media[0].url);
  // }, [venue]);

  const onDateChange = (value) => {
    if (selecting) {
      setFormState({
        dateFrom: value,
        dateTo: "",
      });
      setStartDate(value);
      setSelecting(false);
    } else {
      setFormState({
        ...formState,
        dateTo: value,
      });
      setEndDate(value);
      setSelecting(true);
    }
  };

  // useEffect(() => {
  //   if (startDate && endDate) {
  //     const start = new Date(startDate);
  //     const end = new Date(endDate);
  //     if (!isNaN(start) && !isNaN(end)) {
  //       const oneDay = 24 * 60 * 60 * 1000;
  //       const daysDifference = Math.round(Math.abs((end - start) / oneDay) + 1);
  //       // console.log("daysDifference:", daysDifference);
  //       const value = venue ? venue.price : 0;
  //       const calculatedResult = daysDifference * value;
  //       // console.log("calculatedResult:", calculatedResult);
  //       setResult(calculatedResult);
  //     }
  //   }
  // }, [startDate, endDate, venue]);

  useEffect(() => {
    if (startDate && endDate) {
      const oneDay = 24 * 60 * 60 * 1000;
      const daysDifference = Math.round(Math.abs((endDate - startDate) / oneDay) + 1);
      console.log("daysDifference:", daysDifference);
      const value = venue ? venue.price : 0;
      const calculatedResult = daysDifference * value;
      console.log("calculatedResult:", calculatedResult);
      setResult(calculatedResult);
    }
  }, [startDate, endDate, venue]);

  /*------------*/

  useEffect(() => {
    const foundVenue = venues.find((venue) => venue.id.toString() === id);
    console.log("venues venues venues", venues, foundVenue);
    if (foundVenue) {
      setSelectedImage(foundVenue.media[0]?.url);
      setVenue(foundVenue);
    } else if (meta.nextPage && !meta.isLastPage) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }, [venues, id, meta]);

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
        const date = new Date(value);
        newErrors[name] = !isNaN(date.getTime()) ? "" : "You must choose an available date";
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
      dateFrom: new Date(formState.dateFrom),
      dateTo: new Date(formState.dateTo),
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
        } else {
          setSuccessMessage("Your order has been registered. You can now find it on your profile page.");
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const handleThumbnailClick = (url) => {
    setSelectedImage(url);
  };

  return (
    <div>
      {!venue ? (
        <div className="loading"></div>
      ) : (
        <div className="venueSection textBreakStyle flex-col pt-8" key={venue.id}>
          <div className="overflow-hidden self-center h-64 w-5/6 md:h-96">
            <img src={selectedImage} alt="Selected" className="object-contain w-full h-full" />
          </div>
          {venue.media.length > 1 && (
            <div className="flex justify-center flex-wrap gap-2.5">
              {venue.media.map((mediaItem, index) => (
                <img
                  key={index}
                  src={mediaItem.url}
                  alt={mediaItem.alt}
                  className="object-contain imgCover h-16 w-16 mx-2 cursor-pointer border-2 border-transparent hover:border-blue-500"
                  onClick={() => handleThumbnailClick(mediaItem.url)}
                />
              ))}
            </div>
          )}
          {/* <div className="overflow-hidden self-center max-h-56 w-5/6 md:h-96  ">
            {venue.media[0] && <img src={venue.media[0].url} alt={venue.media[0].alt} className="object-contain" />}
          </div> */}
          <div className="flex flex-col gap-7 lg:gap-0 lg:grid lg:grid-cols-2 ">
            <div className="flex flex-col justify-center items-center self-center min-h-128 lg:border-r-2 lg:px-5 xl:px-12">
              <div className="flex justify-around items-center w-64 sm:w-box510 sm:justify-start sm:gap-48">
                <h2 className="text-2xl font-bold break-words lg:w-box340">{venue.name}</h2>
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
              <form onSubmit={handleSubmit} className="flex flex-col venueEdit gap-2.5">
                <div>
                  <p className="text-xl font-semibold">Choose a date</p>
                  <Calendar
                    onChange={onDateChange}
                    value={formState.dateFrom}
                    tileClassName={({ date, view }) => {
                      if (view === "month") {
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
                        for (const booking of bookedDates) {
                          if (date >= booking.from && date <= booking.to) {
                            return "highlight";
                          }
                        }
                      }
                      return "available";
                    }}
                    // tileDisabled={({ date }) => {
                    //   return (
                    //     bookedDates.some((booking) => date >= booking.from && date <= booking.to) ||
                    //     (startDate && endDate && (date < startDate || date > endDate))
                    //   );
                    // }}
                    minDate={new Date()}
                  />
                </div>
                {localStorage.length > 0 && (
                  <>
                    <div className="flex text-lg self-center items-center gap-2.5">
                      <label>Guests:</label>
                      <select name="guests" onBlur={handleBlur}>
                        {[...Array(venue.maxGuests)].map((_, index) => (
                          <option key={index + 1} value={index + 1}>
                            {index + 1}
                          </option>
                        ))}
                      </select>
                      <span className="error">{errors.guests}</span>
                    </div>
                    <p className="text-xl font-semibold">Total: {result}</p>
                    <button type="submit" className="btnStyle">
                      Book Venue
                    </button>
                  </>
                )}
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
