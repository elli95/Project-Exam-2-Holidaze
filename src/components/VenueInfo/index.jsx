import { useParams } from "react-router-dom";
import useVenues from "../../store/venueLocations";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { API_BOOKINGS } from "../../shared/apis";
import usePostApiKey from "../../hooks/usePostApiKey";
import useLocalStorage from "../../hooks/useLocalStorage";
import useApiCall from "../../hooks/useApiCall";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faWifi, faSquareParking, faMugHot, faPaw } from "@fortawesome/free-solid-svg-icons";
import useVenueApiCall from "../../hooks/useVenueApiCall";

/**
 * The VenueInfo component displays detailed information about a venue,
 * including its name, location, amenities, description, and booking form.
 * It also allows users to select dates for booking the venue.
 *
 * @component
 * @example
 * // Example usage of VenueInfo component:
 * import VenueInfo from './VenueInfo';
 * <VenueInfo />
 */
function VenueInfo() {
  const { apiKey } = usePostApiKey();
  const { accessToken } = useLocalStorage();
  const { id } = useParams();
  const { validateField } = useVenues();
  const [venue, setVenue] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [result, setResult] = useState(null);
  const [selectedImage, setSelectedImage] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(40);
  const { errorMessageVenues, venues, meta } = useVenueApiCall(currentPage, itemsPerPage);

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

  if (errorMessageVenues.length > 0) {
    return <div>{errorMessageVenues && <span className="error flex justify-center pt-2.5 text-xl">{errorMessageVenues}</span>}</div>;
  }

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
      <div className="venueSection bg-grayShadeHover p-5 m-5 rounded textBreakStyle flex-col pt-8" key={venue.id}>
        {venue.media.length > 0 ? (
          <div className="overflow-hidden self-center h-64 w-5/6 md:h-96">
            <img src={selectedImage} alt="Selected" className="object-contain w-full h-full" />
          </div>
        ) : (
          <div className="overflow-hidden self-center h-64 w-5/6 md:h-96">
            <img
              src="https://images.unsplash.com/photo-1579547945413-497e1b99dac0"
              alt="Venue Manager Avatar"
              className="object-contain w-full h-full"
            />
          </div>
        )}
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
        <div className="flex flex-col gap-7 lg:gap-0">
          <div className="flex flex-col justify-center items-center self-center min-h-128 lg:px-5 xl:px-12">
            <div className="flex justify-around items-center w-64 sm:w-box510 sm:justify-start sm:gap-48">
              <h2 className="text-2xl font-bold break-words lg:w-box340">{venue.name || "Venue Name Not Available"}</h2>
              <div className="flex gap-1 text-xl">
                <p className="text-star">
                  <FontAwesomeIcon icon={faStar} />
                </p>
                <p>{venue.rating}</p>
              </div>
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
                    <p>{venue.location.address || "Address Not Available"}</p>
                  </div>
                  <div className="flex justify-between px-1 text-lg flex-wrap">
                    <p>City:</p>
                    <p>{venue.location.city || "City Not Available"}</p>
                  </div>
                  <div className="flex justify-between bg-greyBlur px-1 text-lg flex-wrap">
                    <p>Zip:</p>
                    <p>{venue.location.zip || "Zip Not Available"}</p>
                  </div>
                  <div className="flex justify-between px-1 text-lg flex-wrap">
                    <p>Country:</p>
                    <p>{venue.location.country || "Country Not Available"}</p>
                  </div>
                  <div className="flex justify-between bg-greyBlur px-1 text-lg flex-wrap">
                    <p>Continent:</p>
                    <p>{venue.location.continent || "Continent Not Available"}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center min-w-48">
                <h2 className="text-xl font-semibold">Amenities:</h2>
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
              </div>
            </div>
            <div className="flex flex-col p-6 gap-2.5 max-w-box565">
              <h2 className="text-xl font-semibold">Description</h2>
              <p className="break-all text-lg">{venue.description}</p>
              <div className="min-w-48 sm:self-baseline">
                <h2 className="text-xl font-semibold">Venue manager:</h2>
                <div className="flex items-center justify-start gap-2.5">
                  <div className="h-12 w-12 overflow-hidden">
                    {venue.owner.avatar ? (
                      <img src={venue.owner.avatar.url} alt={venue.owner.avatar.alt} className="rounded-full object-cover" />
                    ) : (
                      <img src="https://images.unsplash.com/photo-1579547945413-497e1b99dac0" alt="Venue" className="rounded-full object-cover" />
                    )}
                  </div>
                  <p className="text-lg">{venue.owner.name}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center self-center gap-5 lg:pt-5 lg:px-5 xl:px-12">
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
                          return "highlightBooked";
                        }
                      }
                    }
                    return "available";
                  }}
                  tileDisabled={({ date }) => {
                    return (
                      bookedDates.some((booking) => date >= booking.from && date <= booking.to) ||
                      (startDate && endDate && (date < startDate || date > endDate))
                    );
                  }}
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
                  <button type="submit" className="bg-white btnStyle">
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
    </div>
  );
}
export default VenueInfo;
