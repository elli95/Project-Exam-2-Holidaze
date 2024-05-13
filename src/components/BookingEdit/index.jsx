import { useState } from "react";
import useGETProfileData from "../../hooks/useGETProfileData";
import usePostApiKey from "../../hooks/usePostApiKey";
import useLocalStorage from "../../hooks/useLocalStorage";
import { API_BOOKINGS } from "../../shared/apis";

function BookingEdit({ venueId }) {
  const { apiKey } = usePostApiKey();
  const { accessToken } = useLocalStorage();
  const { profileData } = useGETProfileData();

  const [formState, setFormState] = useState({
    dateFrom: "",
    dateTo: "",
    guests: "",
  });

  console.log("profileData Booking Edits:", profileData.bookings);
  console.log("profileData Booking venueId:", venueId);

  let editVenueFilter;
  if (profileData && profileData.bookings) {
    editVenueFilter = profileData.bookings.filter((venue) => venue.id === venueId);
    console.log("editVenueFilter", editVenueFilter[0]);
  } else {
    console.log("problem?");
  }
  console.log("editVenueFilter????", editVenueFilter);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // months are 0-indexed in JS
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  let dateFrom = "";
  let dateTo = "";
  if (editVenueFilter) {
    dateFrom = formatDate(editVenueFilter[0].dateFrom);
    dateTo = formatDate(editVenueFilter[0].dateTo);
  }

  console.log("dateFrom dateTo", dateFrom, dateTo);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const updatedFormState = {
      ...formState,
      dateFrom: new Date(event.target.elements.dateFrom.value),
      dateTo: new Date(event.target.elements.dateTo.value),
      guests: Number(event.target.elements.guests.value),
    };
    console.log("Form submitted:", updatedFormState);
    setFormState(updatedFormState);

    try {
      const response = await fetch(API_BOOKINGS + "/" + venueId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": apiKey.key,
        },
        body: JSON.stringify(updatedFormState),
      });

      const data = await response.json();
      if (!response.ok) {
        console.log("error", data.errors[0].message);
      } else {
        console.log("User registered successfully!");
      }

      console.log("Form submitted:", data);
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };
  console.log("formState", formState);

  const handleDelete = async () => {
    console.log("hello :D");

    try {
      const response = await fetch(API_BOOKINGS + "/" + venueId, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": apiKey.key,
        },
      });

      if (response.ok) {
        if (response.status !== 204) {
          const data = await response.json();
          console.log("Deletion successful!");
          console.log("Response data:", data);
        } else {
          console.log("Deletion successful!");
        }
      } else {
        const data = await response.json();
        console.log("error", data.errors[0].message);
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <div>
      <div>
        <h2>Create A Venue</h2>
        {!editVenueFilter ? (
          <div className="loading"></div>
        ) : (
          <div>
            <form onSubmit={handleSubmit}>
              <div className="flex gap-12">
                <div className="flex flex-col">
                  <label>Start Date:</label>
                  <input type="date" name="dateFrom" defaultValue={dateFrom} />
                </div>
                <div className="flex flex-col">
                  <label>End Date:</label>
                  <input type="date" name="dateTo" defaultValue={dateTo} />
                </div>
              </div>
              <div className="flex">
                <label>Guests:</label>
                <input
                  type="number"
                  name="guests"
                  min="1"
                  max={editVenueFilter[0].venue.maxGuests}
                  pattern="[0-9]*"
                  defaultValue={editVenueFilter[0].guests}
                ></input>
              </div>
              <p>Total: {editVenueFilter[0].venue.price}</p>
              <button type="submit" className="btnStyle">
                Book Booking
              </button>
            </form>
            <button type="delete" className="btnStyle" onClick={handleDelete}>
              Delete Booking
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingEdit;
