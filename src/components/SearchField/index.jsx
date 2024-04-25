import { API_VENUES } from "../../shared/apis";
import useFetchApi from "../../hooks/useFetchApi";
import { useState } from "react";
import { Link } from "react-router-dom";

function SearchField() {
  const { venues, isError } = useFetchApi(API_VENUES);
  const [inputValue, setInputValue] = useState("");

  if (isError) {
    return <div>Sorry, there was an error loading the venue</div>;
  }

  const inputValueChange = (input) => {
    const newValue = input.target.value;
    setInputValue(newValue);
  };

  const filteredVenues = venues.filter((venueData) => venueData.name.toLowerCase().includes(inputValue.toLowerCase()));

  return (
    <div>
      <input
        type="text"
        placeholder="Search"
        value={inputValue}
        onChange={inputValueChange}
        className="rounded-lg p-2 max-h-10 text-xl w-80 h-10 lg:w-96"
      ></input>
      {inputValue && (
        <ul>
          {filteredVenues.map((venue) => (
            <Link key={venue.id} to={`/venue/${venue.id}`}>
              <li key={venue.id}>
                {/* <div>{venue.image[0] && <img src={venue.image[0].url} alt={venue.image[0].alt} />}</div> */}
                {venue.name}
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
}
export default SearchField;
