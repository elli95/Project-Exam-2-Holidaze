import useFetchApi from "../../hooks/useFetchApi";
import { API_VENUES } from "../../shared/apis";

function VenueBookings({ venueId }) {
  const { venues } = useFetchApi(API_VENUES + "/?_bookings=true");

  let venueBookingsFilter;
  if (venues) {
    venueBookingsFilter = venues.filter((venue) => venue.id === venueId);
    // console.log("venueBookingsFilter", venueBookingsFilter[0]);
  }

  return (
    <div>
      {!venueBookingsFilter[0] ? (
        <div className="loading"></div>
      ) : venueBookingsFilter[0]._count.bookings === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div>
          {venueBookingsFilter[0].bookings.map((booked) => {
            return (
              <div key={booked.id} className="border-2">
                <h2>
                  <strong>User:</strong>
                  {booked.customer.name}
                </h2>
                <p>
                  <strong>Email:</strong>
                  {booked.customer.email}
                </p>
                <p>
                  <strong>Guests:</strong>
                  {booked.guests}
                </p>
                <p>
                  <strong>Created:</strong>
                  {new Date(booked.created).toLocaleDateString()}
                </p>
                <p>
                  <strong>From:</strong>
                  {new Date(booked.dateFrom).toLocaleDateString()}
                </p>
                <p>
                  <strong>To:</strong>
                  {new Date(booked.dateTo).toLocaleDateString()}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default VenueBookings;
