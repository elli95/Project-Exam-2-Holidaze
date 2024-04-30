// import { API_VENUES } from "../../shared/apis";
// import useFetchApi from "../../hooks/useFetchApi";
import { useParams } from "react-router-dom";
import useVenues from "../../store/venueLocations";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";

function VenueInfo() {
  const { id } = useParams();
  const { venues, fetchVenues } = useVenues();
  const [venue, setVenue] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  useEffect(() => {
    const foundVenue = venues.find((venue) => venue.id.toString() === id);
    setVenue(foundVenue);
  }, [venues, id]);

  if (!venue) {
    return <div className="loading"></div>;
  }

  const bookedDates = venue.bookings.map((booking) => ({
    from: new Date(booking.dateFrom),
    to: new Date(booking.dateTo),
  }));

  console.log("bookedDates", bookedDates);
  console.log("startDate and endDate", startDate, endDate);

  return (
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
            </div>
          </div>
          <p className="p-6">{venue.description}</p>
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
          <Calendar
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
          />
          <div className="flex gap-12">
            <div className="flex flex-col">
              <label>Start Date:</label>
              <input type="date" value={startDate || ""} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="flex flex-col">
              <label>End Date:</label>
              <input type="date" value={endDate || ""} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>

          {/* <Calendar
            tileClassName={({ date, view }) => {
              if (view === "month") {
                // Check if the date falls within any booking range
                for (const booking of blockedDates) {
                  if (date >= booking.from && date <= booking.to) {
                    return "highlight";
                  }
                }
              }
              return "available"; // Default class for other dates
            }}
            onClickDay={(date) => {
              if (!blockedDates.some((booking) => date >= booking.from && date <= booking.to)) {
                setSelectedDate(date);
                console.log("Selected date:", date);
                // Handle other logic (e.g., storing selected dates) here
              }
            }}
            minDate={new Date()}
          />
          <input
            type="text"
            placeholder="Enter dates (e.g., YYYY-MM-DD, YYYY-MM-DD)"
            value={selectedDate ? selectedDate.toDateString() : ""}
            onChange={(e) => {
              const inputDates = e.target.value.split(",").map((dateStr) => new Date(dateStr.trim()));
              console.log("Selected dates:", inputDates);
            }}
          /> */}
          <div className="flex">
            <label>Guests:</label>
            <input type="number" min="1" max={venue.maxGuests} pattern="[0-9]*"></input>
          </div>
          <p>Total: {venue.price}</p>
          <button>Book Venue</button>
        </div>
      </div>
    </div>
  );
}
export default VenueInfo;
