import { useState } from "react";
import useGETProfileData from "../../hooks/useGETProfileData";
import usePostApiKey from "../../hooks/usePostApiKey";
import useLocalStorage from "../../hooks/useLocalStorage";
import { API_VENUES } from "../../shared/apis";

// import usePostApiKey from "../../hooks/usePostApiKey";
// import { API_PROFILES } from "../../shared/apis";
// import { useEffect } from "react";
// import useLocalStorage from "../../hooks/useLocalStorage";

function VenueEdit({ venueId }) {
  const { apiKey } = usePostApiKey();
  const { accessToken } = useLocalStorage();
  //   const [isVenueFormShown, setIsVenueFormShown] = useState(false);

  const { profileData } = useGETProfileData();

  //   console.log("venueId={venue.id}venueId={venue.id}", venueId);

  const [formState, setFormState] = useState({
    name: "",
    description: "",
    media: [
      {
        url: "",
        alt: "",
      },
    ],
    price: "",
    maxGuests: "",
    rating: "",
    meta: {
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false,
    },
    location: {
      address: "",
      city: "",
      zip: "",
      country: "",
      continent: "",
      lat: "",
      lng: "",
    },
  });
  console.log("profileData Venue Edits:", profileData.venues);

  let editVenueFilter;
  if (profileData && profileData.venues) {
    editVenueFilter = profileData.venues.filter((venue) => venue.id === venueId);
    console.log("editVenueFilter", editVenueFilter[0]);
  }
  console.log("editVenueFilter????", editVenueFilter);

  //   const isValidUrl = (string) => {
  //     try {
  //       new URL(string);
  //     } catch (_) {
  //       return false;
  //     }
  //     return true;
  //   };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // const { type, checked } = event.target;
    // const avatarUrl = event.target.elements["avatar.url"].value;
    // const bannerUrl = event.target.elements["banner.url"].value;

    // if (!isValidUrl(avatarUrl) || !isValidUrl(bannerUrl)) {
    //   console.error("Image URL must be valid URL");
    //   return;
    // }

    const updatedFormState = {
      ...formState,
      name: event.target.elements.name.value,
      description: event.target.elements.description.value,
      media: [
        {
          url: event.target.elements["media.url"].value,
          alt: event.target.elements["media.alt"].value,
        },
      ],
      price: Number(event.target.elements.price.value),
      maxGuests: Number(event.target.elements.maxGuests.value),
      rating: Number(event.target.elements.rating.value),
      meta: {
        wifi: event.target.querySelector('input[name="meta.wifi"]').checked,
        parking: event.target.querySelector('input[name="meta.parking"]').checked,
        breakfast: event.target.querySelector('input[name="meta.breakfast"]').checked,
        pets: event.target.querySelector('input[name="meta.pets"]').checked,
      },
      location: {
        address: event.target.elements["location.address"].value,
        city: event.target.elements["location.city"].value,
        zip: event.target.elements["location.zip"].value,
        country: event.target.elements["location.country"].value,
        continent: event.target.elements["location.continent"].value,
        lat: Number(event.target.elements["location.lat"].value),
        lng: Number(event.target.elements["location.lng"].value),
      },
    };
    console.log("Form submitted:", updatedFormState);
    setFormState(updatedFormState);

    try {
      const response = await fetch(API_VENUES + "/" + venueId, {
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
      const response = await fetch(API_VENUES + "/" + venueId, {
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
      {/* <button className="btnStyle" onClick={handleCreateVenueForm}>
        Edit Venue
      </button> */}
      {/* {isVenueFormShown && ( */}
      {/* venueBookingData.venues.map((venue) => (<div></div>)) */}
      <div>
        <h2>Create A Venue</h2>
        {/* <h2>{editVenueFilter && editVenueFilter[0] && editVenueFilter[0].name}</h2> */}
        {!editVenueFilter ? (
          <div className="loading"></div>
        ) : (
          <div>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name">Venue name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Venue name"
                  minLength={3}
                  aria-label="Venue Name"
                  defaultValue={editVenueFilter[0].name}
                  required
                />
              </div>
              <div>
                <label htmlFor="Venue description">Venue description</label>
                <input
                  type="text"
                  name="description"
                  placeholder="Venue description"
                  minLength={3}
                  aria-label="Venue description"
                  defaultValue={editVenueFilter[0].description}
                  required
                />
              </div>
              <div>
                <label htmlFor="media.url">Venue media url</label>
                <input
                  type="text"
                  name="media.url"
                  placeholder="User media url"
                  minLength={3}
                  aria-label="User media url"
                  defaultValue={editVenueFilter[0].media[0].url}
                />
              </div>
              <div>
                <label htmlFor="media.alt">Venue media alternative text</label>
                <input
                  type="text"
                  name="media.alt"
                  placeholder="User media alternative text"
                  minLength={3}
                  aria-label="User media alternative text"
                  defaultValue={editVenueFilter[0].media[0].alt}
                />
              </div>
              <div>
                <label htmlFor="price">Venue price</label>
                <input
                  type="number"
                  name="price"
                  placeholder="Venue price"
                  aria-label="Venue price"
                  defaultValue={editVenueFilter[0].price}
                  required
                />
              </div>
              <div className="flex flex-row">
                <label htmlFor="maxGuests">Max guests</label>
                <input type="number" name="maxGuests" aria-label="Max guests" defaultValue={editVenueFilter[0].maxGuests} required />
              </div>
              <div className="flex flex-row">
                <label htmlFor="rating">Venue rating</label>
                <input type="number" name="rating" aria-label="Venue rating" defaultValue={editVenueFilter[0].rating} />
              </div>
              <h2>Amenities</h2>
              <div>
                <label htmlFor="meta.wifi">Wifi availability</label>
                <input type="checkbox" name="meta.wifi" aria-label="Wifi availability" defaultChecked={editVenueFilter[0].meta.wifi} />
              </div>
              <div>
                <label htmlFor="meta.parking">Parking availability</label>
                <input type="checkbox" name="meta.parking" aria-label="Parking availability" defaultChecked={editVenueFilter[0].meta.parking} />
              </div>
              <div>
                <label htmlFor="meta.breakfast">Breakfast availability</label>
                <input type="checkbox" name="meta.breakfast" aria-label="Breakfast availability" defaultChecked={editVenueFilter[0].meta.breakfast} />
              </div>
              <div>
                <label htmlFor="meta.pets">Pets availability</label>
                <input type="checkbox" name="meta.pets" aria-label="Pets availability" defaultChecked={editVenueFilter[0].meta.pets} />
              </div>
              <h2>Venue location</h2>
              <div>
                <label htmlFor="location.address">Venue address</label>
                <input
                  type="text"
                  name="location.address"
                  placeholder="Venue address"
                  minLength={3}
                  aria-label="Venue address"
                  defaultValue={editVenueFilter[0].location.address}
                />
              </div>
              <div>
                <label htmlFor="location.city">Venue city</label>
                <input
                  type="text"
                  name="location.city"
                  placeholder="Venue city"
                  minLength={3}
                  aria-label="Venue city"
                  defaultValue={editVenueFilter[0].location.city}
                />
              </div>
              <div>
                <label htmlFor="location.zip">Venue zip</label>
                <input
                  type="number"
                  name="location.zip"
                  placeholder="Venue zip"
                  minLength={3}
                  aria-label="Venue zip"
                  defaultValue={editVenueFilter[0].location.zip}
                />
              </div>
              <div>
                <label htmlFor="location.country">Venue country</label>
                <input
                  type="text"
                  name="location.country"
                  placeholder="Venue country"
                  minLength={3}
                  aria-label="Venue country"
                  defaultValue={editVenueFilter[0].location.country}
                />
              </div>
              <div>
                <label htmlFor="location.continent">Venue continent</label>
                <input
                  type="text"
                  name="location.continent"
                  placeholder="Venue continent"
                  minLength={3}
                  aria-label="Venue continent"
                  defaultValue={editVenueFilter[0].location.continent}
                />
              </div>
              <div>
                <label htmlFor="location.lat">Venue latitude</label>
                <input
                  type="number"
                  name="location.lat"
                  placeholder="Venue latitude"
                  minLength={3}
                  aria-label="Venue latitude"
                  defaultValue={editVenueFilter[0].location.lat}
                />
              </div>
              <div>
                <label htmlFor="location.lng">Venue longitude </label>
                <input
                  type="number"
                  name="location.lng"
                  placeholder="Venue longitude"
                  minLength={3}
                  aria-label="Venue longitude"
                  defaultValue={editVenueFilter[0].location.lng}
                />
              </div>
              <button type="submit" className="btnStyle">
                Submit
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

export default VenueEdit;
