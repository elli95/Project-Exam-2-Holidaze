// import { API_VENUES } from "../../shared/apis";
// import useFetchApi from "../../hooks/useFetchApi";
import { useParams } from "react-router-dom";
import useVenues from "../../store/venueLocations";
import { useEffect, useState } from "react";

function VenueInfo() {
  const { id } = useParams();
  const { venues, fetchVenues } = useVenues();
  const [venue, setVenue] = useState(null);

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

  // const result = venue.meta.map((value) => (value ? "yes" : "no"));

  console.log("thisVenue", venue);

  return (
    <div className="venueSection" key={venue.id}>
      <div>{venue.media[0] && <img src={venue.media[0].url} alt={venue.media[0].alt} />}</div>
      <h2>{venue.name}</h2>
      <div>
        <h3>{venue.location.country}</h3>
        <p>{venue.location.continent}</p>
        <p>{venue.location.city}</p>
        <p>{venue.location.address}</p>
      </div>
      <p>⭐{venue.rating}</p>
      <p>{venue.description}</p>
      <p>{venue.price}</p>
      <div>
        <p>{venue.maxGuests}</p>
        <p>{venue.meta.breakfast ? "Yes" : "No"}</p>
        <p>{venue.meta.parking ? "Yes" : "No"}</p>
        <p>{venue.meta.pets ? "Yes" : "No"}</p>
        <p>{venue.meta.wifi ? "Yes" : "No"}</p>
      </div>
    </div>
  );
}
export default VenueInfo;
