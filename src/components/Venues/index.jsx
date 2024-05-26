import { Link } from "react-router-dom";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faAnglesLeft, faAnglesRight, faWifi, faSquareParking, faMugHot, faPaw } from "@fortawesome/free-solid-svg-icons";
import VenueFilter from "../VenueFilter";
import useVenueApiCall from "../../hooks/useVenueApiCall";

/**
 * Venues Component
 * Displays a list of venues with pagination and filtering functionality.
 * @returns JSX.Element
 */

function Venues() {
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(40);
  const { errorMessageVenues, venues, meta } = useVenueApiCall(currentPage, itemsPerPage);

  // Function to handle pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Determine venues to display based on whether filtering is applied or not
  const displayVenues = filteredVenues.length > 0 ? filteredVenues : venues;

  // Pagination Component
  const Pagination = ({ itemsPerPage, totalItems, paginate }) => {
    // Calculate total number of pages
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Array to hold page numbers
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    // Function to render pagination buttons
    const renderButton = (number) => (
      <li key={number}>
        <button onClick={() => paginate(number)} className={`btnStyle ${currentPage === number ? "bg-green" : "bg-white"}`}>
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

  return (
    <div>
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
                <div className="imgBox">
                  {venue.media[0] ? (
                    <img src={venue.media[0].url} alt={venue.media[0].alt} />
                  ) : (
                    <img src="https://images.unsplash.com/photo-1579547945413-497e1b99dac0" alt="Venue" />
                  )}
                </div>
                <div className="flex flex-col justify-between h-box180 gap-2.5 p-3 overflow-hidden">
                  <div className="flex justify-between">
                    <h2 className="text-2xl whitespace-nowrap w-270 overflow-hidden">{venue.name || "Venue Name Not Available"}</h2>

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
      </div>
      {errorMessageVenues && <span className="error flex justify-center pt-2.5 text-xl">{errorMessageVenues}</span>}
    </div>
  );
}
export default Venues;
