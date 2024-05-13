import { useState } from "react";
import Calendar from "react-calendar";
import useVenues from "../../store/venueLocations";

function VenueCalendar() {
  // const [date, setDate] = useState(new Date());
  // const [selectedDate, setSelectedDate] = useState(null);
  const { venues, fetchVenues } = useVenues();
  const [venue, setVenue] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const bookedDates = venue.bookings.map((booking) => ({
    from: new Date(booking.dateFrom),
    to: new Date(booking.dateTo),
  }));

  console.log("bookedDates", bookedDates);
  console.log("startDate and endDate", startDate, endDate);

  return (
    <div>
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
  );
}
export default VenueCalendar;
