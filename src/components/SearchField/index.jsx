import { API_VENUES } from "../../shared/apis";
// import useFetchApi from "../../hooks/useFetchApi";
import { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import usePostApiKey from "../../hooks/usePostApiKey";
import useLocalStorage from "../../hooks/useLocalStorage";
import useApiCall from "../../hooks/useApiCall";

function SearchField() {
  // const { venues, isError } = useFetchApi(API_VENUES);
  const [venues, setVenue] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const { apiKey } = usePostApiKey();
  const { accessToken } = useLocalStorage();
  const apiCall = useApiCall();
  const inputRef = useRef();
  const listRef = useRef();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    apiCall(API_VENUES, "GET", {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": apiKey.key,
    })
      .then((data) => setVenue(data.data))
      .catch((error) => console.error("Error fetching data:", error));
    // Samme Kode!!
  }, []);

  const inputValueChange = (input) => {
    const newValue = input.target.value;
    setInputValue(newValue);
  };

  const filteredVenues = venues.filter((venueData) => venueData.name.toLowerCase().includes(inputValue.toLowerCase()));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target) && listRef.current && !listRef.current.contains(event.target)) {
        setInputValue("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setInputValue("");
  }, [location]);

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search"
        value={inputValue}
        onChange={inputValueChange}
        className="rounded-lg p-2 max-h-10 text-xl w-80 h-10 lg:w-96"
      ></input>
      {inputValue && (
        <ul ref={listRef}>
          {filteredVenues.map((venue) => (
            <Link key={venue.id} to={`/venue/${venue.id}`}>
              <li key={venue.id}>
                <div>{venue.media[0] && <img src={venue.media[0].url} alt={venue.media[0].alt} className="max-w-8" />}</div>
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
