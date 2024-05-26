// import { API_VENUES } from "../../shared/apis";
// import useFetchApi from "../../hooks/useFetchApi";
import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
// import usePostApiKey from "../../hooks/usePostApiKey";
// import useLocalStorage from "../../hooks/useLocalStorage";
// import useApiCall from "../../hooks/useApiCall";
// import useAllVenuesApiCall from "../../hooks/useAllVenuesApiCall";
import useVenueApiCall from "../../hooks/useVenueApiCall";

function SearchField({ onLinkClick }) {
  // const { venues, isError } = useFetchApi(API_VENUES);
  // const [venues, setVenue] = useState([]);
  const [inputValue, setInputValue] = useState("");
  // const { apiKey } = usePostApiKey();
  // const { accessToken } = useLocalStorage();
  // const apiCall = useApiCall();
  const inputRef = useRef();
  const listRef = useRef();

  // const { allVenues } = useAllVenuesApiCall();
  // const fetchApiData = () => {
  const currentPage = 1;
  const itemsPerPage = 100;
  const { errorMessageVenues, venues } = useVenueApiCall(currentPage, itemsPerPage);
  // };
  // const navigate = useNavigate();
  const location = useLocation();

  const inputValueChange = (input) => {
    const newValue = input.target.value;
    setInputValue(newValue);
  };

  // useEffect(() => {
  const filteredVenues = venues.filter((venueData) => venueData.name.toLowerCase().includes(inputValue.toLowerCase()));
  // }, []);
  console.log("filteredVenues", filteredVenues);

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
      <label htmlFor="Search" for="Search"></label>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search"
        value={inputValue}
        // onClick={fetchApiData}
        onChange={inputValueChange}
        className="rounded-lg p-2 max-h-10 text-xl w-80 h-10 lg:w-96 z-20 relative"
      ></input>
      {inputValue && (
        <ul ref={listRef} className="flex flex-col absolute pt-5 p-2.5 top-12 bg-grayShade w-80 h-box565 lg:w-96 overflow-auto z-10 rounded ">
          {filteredVenues.map((venue) => (
            <Link key={venue.id} to={`/venue/${venue.id}`} className="hover:bg-grayShadeHover p-2.5" onClick={onLinkClick}>
              <li key={venue.id} className="flex overflow-hidden whitespace-nowrap gap-2.5 items-center">
                <div>{venue.media[0] && <img src={venue.media[0].url} alt={venue.media[0].alt} className="w-12 h-12 rounded" />}</div>
                <p className="w-12">{venue.name}</p>
              </li>
            </Link>
          ))}
          {errorMessageVenues && <span className="error flex justify-center pt-2.5 text-xl">{errorMessageVenues}</span>}
        </ul>
      )}
      {/* {!inputValue && <div className="loading"></div>} */}
    </div>
  );
}
export default SearchField;
