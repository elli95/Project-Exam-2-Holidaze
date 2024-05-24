import { Link } from "react-router-dom";
import { API_VENUES } from "../../shared/apis";
import useApiCall from "../../hooks/useApiCall";
import usePostApiKey from "../../hooks/usePostApiKey";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faAnglesLeft, faAnglesRight, faWifi, faSquareParking, faMugHot, faPaw } from "@fortawesome/free-solid-svg-icons";
import VenueFilter from "../VenueFilter";

function Venues() {
  const [venues, setVenue] = useState([]);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const { apiKey } = usePostApiKey();
  const { accessToken } = useLocalStorage();
  const [meta, setMeta] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [prevPage, setPrevPage] = useState(null);
  const [itemsPerPage] = useState(40);
  const [errorMessage, setErrorMessage] = useState("");
  // const textRef = useRef(null);

  const apiCall = useApiCall();

  const displayVenues = filteredVenues.length > 0 ? filteredVenues : venues;

  useEffect(() => {
    if (currentPage !== prevPage) {
      // Check if the current page is different from the previous page
      const fetchVenueData = async () => {
        try {
          const venueCall = await apiCall(`${API_VENUES}?sort=created&page=${currentPage}&limit=${itemsPerPage}`, "GET", {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "X-Noroff-API-Key": apiKey.key,
          });
          console.log("aaaaaa", venueCall);
          if (venueCall.errors) {
            console.log("Error:", venueCall.errors[0].message);
            setErrorMessage("There was an error: " + venueCall.errors[0].message);
          } else {
            setVenue(venueCall.data);
            setMeta(venueCall.meta);
          }
        } catch (error) {
          console.error("Failed to fetch venue data:", error);
          setErrorMessage("Failed to fetch venue data");
        }
      };

      fetchVenueData(); // Call fetchVenueData only when currentPage changes
      setPrevPage(currentPage); // Update the previous page
    }
  }, [apiCall, currentPage, itemsPerPage, accessToken, apiKey.key, prevPage]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const Pagination = ({ itemsPerPage, totalItems, paginate }) => {
    const pageNumbers = [];
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    const renderButton = (number) => (
      <li key={number}>
        <button onClick={() => paginate(number)} className={`btnStyle ${currentPage === number ? "bg-green" : ""} `}>
          {number}
        </button>
      </li>
    );

    return (
      <nav>
        <ul className="flex flex-wrap gap-2">
          {pageNumbers.map((number) => {
            if (currentPage === 1) {
              if (number === 1 || number === currentPage + 1 || number === currentPage + 2 || number === totalPages) {
                return renderButton(number);
              } else if (number === currentPage + 3) {
                return (
                  <li className="self-center" key={number}>
                    <FontAwesomeIcon icon={faAnglesRight} />
                  </li>
                );
              }
            } else if (currentPage >= 2 && currentPage <= totalPages - 1) {
              if (number === 1 || number === currentPage - 1 || number === currentPage || number === currentPage + 1 || number === totalPages) {
                return renderButton(number);
              } else if (number === 2) {
                return (
                  <li className="self-center" key={number}>
                    <FontAwesomeIcon icon={faAnglesLeft} />
                  </li>
                );
              } else if (number === totalPages - 1) {
                return (
                  <li className="self-center" key={number}>
                    <FontAwesomeIcon icon={faAnglesRight} />
                  </li>
                );
              }
            } else if (currentPage === totalPages) {
              if (
                number === 1 ||
                (number >= currentPage && number <= currentPage + 1) ||
                (number <= totalPages && number >= totalPages - 2) ||
                number === currentPage - 1
              ) {
                return renderButton(number);
              } else if (number === currentPage - 3) {
                return (
                  <li className="self-center" key={number}>
                    <FontAwesomeIcon icon={faAnglesLeft} />
                  </li>
                );
              }
            } else {
              return null;
            }
            return null;
          })}
        </ul>
      </nav>
    );
  };

  //console.log("Venues updates?:", filteredVenues);

  return (
    <div>
      <VenueFilter setFilteredVenues={setFilteredVenues} />
      {!filteredVenues.length > 0 && (
        <div className="flex justify-center p-5">
          <Pagination itemsPerPage={itemsPerPage} totalItems={meta.totalCount} paginate={paginate} />
        </div>
      )}
      <div className={`${!filteredVenues.length > 0 ? "" : "pt-10"} venueSection`}>
        {!displayVenues ? (
          <div className="loading"></div>
        ) : (
          displayVenues.map((venue) => (
            <Link key={venue.id} to={`/venue/${venue.id}`} className=" rounded">
              <div className="imgBox">{venue.media[0] && <img src={venue.media[0].url} alt={venue.media[0].alt} />}</div>
              <div className="flex flex-col justify-between h-box180 gap-2.5 p-3 overflow-hidden">
                <div className="flex justify-between">
                  <h2 className="text-2xl whitespace-nowrap w-270 overflow-hidden">{venue.name}</h2>

                  <div className="flex gap-1 text-xl">
                    <p className="text-star">
                      <FontAwesomeIcon icon={faStar} />
                    </p>
                    <p>{venue.rating}</p>
                  </div>
                </div>
                <div className="flex gap-2.5 overflow-hidden ">
                  <p className="text-lg overflow-hidden max-w-box150">{venue.location.city}</p>
                  <h3 className="text-xl overflow-hidden max-w-box150">{venue.location.country}</h3>
                </div>
                <div className="flex h-10 gap-2.5">
                  {venue.meta.wifi && (
                    <h3 title="Wifi included" className="metaIconTrue">
                      <FontAwesomeIcon icon={faWifi} />
                    </h3>
                  )}
                  {venue.meta.parking && (
                    <h3 title="Parking available" className="metaIconTrue">
                      <FontAwesomeIcon icon={faSquareParking} />
                    </h3>
                  )}
                  {venue.meta.breakfast && (
                    <h3 title="Breakfast included" className="metaIconTrue">
                      <FontAwesomeIcon icon={faMugHot} />
                    </h3>
                  )}
                  {venue.meta.pets && (
                    <h3 title="Pets permitted" className="metaIconTrue">
                      <FontAwesomeIcon icon={faPaw} />
                    </h3>
                  )}
                </div>
                <p className="text-xl">{venue.price}$ Per Night</p>
              </div>
            </Link>
          ))
        )}
      </div>
      {!filteredVenues.length > 0 && (
        <div className="flex justify-center p-5">
          <Pagination itemsPerPage={itemsPerPage} totalItems={meta.totalCount} paginate={paginate} />
        </div>
      )}
      {errorMessage && <span className="error flex justify-center pt-2.5 text-xl">{errorMessage}</span>}
    </div>
  );
}
export default Venues;
