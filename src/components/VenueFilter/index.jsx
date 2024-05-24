import { useEffect, useState } from "react";
import useApiCall from "../../hooks/useApiCall";
import { API_VENUES } from "../../shared/apis";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

function VenueFilter({ setFilteredVenues }) {
  const [venues, setVenues] = useState([]);
  const [filters, setFilters] = useState({
    title: "",
    location: {
      city: "",
      country: "",
    },
    rating: "",
    wifi: false,
    parking: false,
    pets: false,
    breakfast: false,
  });

  const apiCall = useApiCall();

  useEffect(() => {
    const fetchAllPages = async (url) => {
      try {
        const data = await apiCall(url, "GET", {
          "Content-Type": "application/json",
        });

        setVenues((prevVenues) => [...prevVenues, ...data.data]);

        if (!data.meta.isLastPage) {
          await fetchAllPages(`${API_VENUES}?page=${data.meta.nextPage}`);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAllPages(`${API_VENUES}?page=1`);
  }, [apiCall]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const parsedValue = type === "radio" ? parseFloat(value) : value;
    const [fieldName, nestedFieldName] = name.split(".");

    if (nestedFieldName) {
      setFilters((prevState) => ({
        ...prevState,
        [fieldName]: {
          ...prevState[fieldName],
          [nestedFieldName]: type === "checkbox" ? checked : parsedValue,
        },
      }));
    } else {
      setFilters((prevState) => ({
        ...prevState,
        [name]: type === "checkbox" ? checked : parsedValue,
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const filteredData = venues.filter((item) => {
      for (let key in filters) {
        if (key === "wifi" || key === "parking" || key === "pets" || key === "breakfast") {
          if (filters[key] && item.meta[key] !== filters[key]) {
            return false;
          }
        } else if (key === "location") {
          const { city, country } = filters.location;
          if (
            (city && city.trim() && item.location && item.location.city && item.location.city.toLowerCase() !== city.toLowerCase()) ||
            (city && city.trim() && item.location.city === null) ||
            (city && item.location.city.length === 0) ||
            (country && country.trim() && item.location && item.location.country && item.location.country.toLowerCase() !== country.toLowerCase()) ||
            (country && country.trim() && item.location.country === null) ||
            (country && item.location.country.length === 0)
          ) {
            return false;
          }
        } else if (key === "rating") {
          if (filters.rating && item.rating !== filters.rating) {
            return false;
          }
        } else {
          if (filters[key] && (!item[key] || String(item[key]).toLowerCase().indexOf(String(filters[key]).toLowerCase()) === -1)) {
            return false;
          }
        }
      }
      return true;
    });

    const uniqueFilteredData = filteredData.filter((item, index, self) => index === self.findIndex((t) => t.id === item.id));

    setFilteredVenues(uniqueFilteredData);
  };

  const handleClearFilter = () => {
    setFilters({
      title: "",
      location: {
        city: "",
        country: "",
      },
      rating: "",
      wifi: false,
      parking: false,
      pets: false,
      breakfast: false,
    });
    document.getElementById("filterForm").reset();
    setFilteredVenues([]);
  };

  //console.log("filterdData filters:", filters);

  return (
    <div className="flex justify-center venueEdit">
      <form id="filterForm" onSubmit={handleSubmit} className="flex flex-col justify-center rounded p-7 gap-2.5 max-w-box700 venueFilterBox">
        <input type="text" name="name" onChange={handleChange} placeholder="name" className="w-5/6 text-lg sm:w-box570" />
        <div className="flex flex-wrap gap-2.5 justify-center">
          <input type="text" name="location.country" onChange={handleChange} placeholder="Country" className="w-5/6 text-lg sm:w-box280" />
          <input type="text" name="location.city" onChange={handleChange} placeholder="City" className="w-5/6 text-lg sm:w-box280" />
        </div>
        <div className="flex flex-col sm:flex-row gap-2.5 justify-center  sm:justify-between">
          <div className="flex flex-col gap-2.5">
            <div className="flex gap-2.5 justify-center text-lg">
              {[1, 2, 3, 4, 5].map((rating) => (
                <label key={rating}>
                  <input type="radio" name="rating" value={rating} onChange={handleChange} className="mr-1" />

                  <FontAwesomeIcon icon={faStar} className="text-star" />
                  {rating}
                </label>
              ))}
            </div>
            <div className="flex flex-wrap gap-2.5 justify-center text-lg">
              <label className="flex gap-1">
                <input type="checkbox" name="wifi" onChange={handleChange} />
                Wifi
              </label>
              <label className="flex gap-1">
                <input type="checkbox" name="parking" onChange={handleChange} />
                Parking
              </label>
              <label className="flex gap-1">
                <input type="checkbox" name="pets" onChange={handleChange} />
                Pets
              </label>
              <label className="flex gap-1">
                <input type="checkbox" name="breakfast" onChange={handleChange} />
                Breakfast
              </label>
            </div>
          </div>
          <div className="flex self-center sm:pr-1.5">
            <button className="btnStyle">Filter Venues</button>
            <button type="button" onClick={handleClearFilter} className="btnStyle ml-2">
              Clear Filters
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default VenueFilter;
