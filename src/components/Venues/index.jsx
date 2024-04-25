import { Link } from "react-router-dom";
import { API_VENUES } from "../../shared/apis";
import useFetchApi from "../../hooks/useFetchApi";

function Venues() {
  const { venues, isLoading, isError } = useFetchApi(API_VENUES);

  if (isLoading) {
    return <div className="loading"></div>;
  }

  if (isError) {
    return <div>Sorry, there was an error loading the product</div>;
  }

  console.log("venues1", venues);

  return (
    <div className="venueSection">
      {venues.map((venue) => (
        <Link key={venue.id} to={`/venue/${venue.id}`} className="bg-redish rounded-lg">
          <div className="imgBox">{venue.media[0] && <img src={venue.media[0].url} alt={venue.media[0].alt} />}</div>
          <div className="p-3">
            <div className="flex justify-between">
              <h2>{venue.name}</h2>
              <p>⭐{venue.rating}</p>
            </div>
            <div className="flex justify-between">
              <div>
                <h3>{venue.location.country}</h3>
                <p>{venue.location.city}</p>
              </div>
              <p className="self-end">{venue.price}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
export default Venues;
