import { useEffect, useRef, useState } from "react";
import useGETProfileData from "../../hooks/useGETProfileData";
import usePostApiKey from "../../hooks/usePostApiKey";
import useLocalStorage from "../../hooks/useLocalStorage";
import { API_VENUES } from "../../shared/apis";
import useApiCall from "../../hooks/useApiCall";
import useVenues from "../../store/venueLocations";

function VenueEdit({ setVenueBookingData = () => {}, fetchVenueBookingData = () => {}, venueId }) {
  const { validateField } = useVenues();
  const { apiKey } = usePostApiKey();
  const { accessToken } = useLocalStorage();

  const { profileData } = useGETProfileData();

  let editVenueFilter;
  if (profileData && profileData.venues) {
    editVenueFilter = profileData.venues.filter((venue) => venue.id === venueId);
  }

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

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    // media: formState.media.map(() => ({ url: "" })),
    media: [
      {
        url: "",
      },
    ],
    price: "",
    maxGuests: "",
  });

  const handleBlur = (event) => {
    const { name, value } = event.target;
    const newErrors = { ...errors };

    if (name.startsWith("media.url")) {
      const index = name.split(".")[2];
      if (!newErrors.media[index]) {
        newErrors.media[index] = {};
      }
      newErrors.media[index].url = validateField(value, "imgUrl") ? "" : "Please enter a valid URL";
    } else {
      switch (name) {
        case "name":
        case "description":
          newErrors[name] = validateField(value, "inputLength") ? "" : "You must enter at least 1 characters";
          break;
        case "price":
        case "maxGuests":
          newErrors[name] = validateField(value, "numbersOnly") ? "" : "Value must be a number";
          break;
        default:
          break;
      }
    }

    setErrors(newErrors);
  };

  const apiCall = useApiCall();

  const handleAddImage = () => {
    setFormState({
      ...formState,
      media: [...formState.media, { url: "", alt: "" }],
    });
  };

  const runCount = useRef(0);

  useEffect(() => {
    if (editVenueFilter && runCount.current < editVenueFilter[0].media.length - 1) {
      handleAddImage(editVenueFilter[0].media[runCount.current]);
      runCount.current += 1;
    }
  }, [editVenueFilter]);

  const handleRemoveImage = (index) => {
    console.log("index after btn", index);
    if (formState.media.length > 1) {
      const newMedia = [...formState.media];
      console.log("index after btn newMedia", newMedia);
      console.log("index after btn", index);
      newMedia.splice(index, 1);
      setFormState({ ...formState, media: newMedia });
    }
    console.log("index after btn formState", formState);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const media = [];
    for (let element of event.target.elements) {
      if (element.name.startsWith("media.url.")) {
        const index = parseInt(element.name.replace("media.url.", ""), 10);
        if (!media[index]) {
          media[index] = { url: "", alt: "" };
        }
        media[index].url = element.value;
      } else if (element.name.startsWith("media.alt.")) {
        const index = parseInt(element.name.replace("media.alt.", ""), 10);
        if (!media[index]) {
          media[index] = { url: "", alt: "" };
        }
        media[index].alt = element.value;
      }
    }

    for (let i = 0; i < media.length; i++) {
      if (!media[i].url) {
        media[i].url =
          "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?q=80&w=2624&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
      }
      if (!media[i].alt) {
        media[i].alt = "This is a goldfish";
      }
    }

    console.log("media--media--media", media);
    const updatedFormState = {
      ...formState,
      name: event.target.elements.name.value,
      description: event.target.elements.description.value,
      media,
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
      const updatedProfileData = await apiCall(
        API_VENUES + "/" + venueId,
        "PUT",
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": apiKey.key,
        },
        updatedFormState
      );
      console.log("try", updatedProfileData.data);
      setVenueBookingData((prevState) => ({
        ...prevState,
        venues: prevState.venues.map((venue) =>
          venue.id === updatedProfileData.data.id
            ? {
                ...venue,
                name: updatedProfileData.data.name,
                description: updatedProfileData.data.description,
                media: updatedProfileData.data.media,
                price: updatedProfileData.data.price,
                maxGuests: updatedProfileData.data.maxGuests,
                rating: updatedProfileData.data.rating,
                meta: updatedProfileData.data.meta,
                location: updatedProfileData.data.location,
              }
            : venue
        ),
      }));
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
    // Samme Kode!!
  };
  console.log("formState", formState);

  const handleDelete = async () => {
    apiCall(API_VENUES + "/" + venueId, "DELETE", {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": apiKey.key,
    })
      .then(() => {
        console.log("hello :D");
        fetchVenueBookingData();
      })
      .catch((error) => console.error("Error deleting venue:", error));
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
              <div>
                <label htmlFor="name">Venue name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Venue name"
                  aria-label="Venue Name"
                  onBlur={handleBlur}
                  defaultValue={editVenueFilter[0].name}
                  required
                />
                <span className="error">{errors.name}</span>
              </div>
              <div>
                <label htmlFor="Venue description">Venue description</label>
                <input
                  type="text"
                  name="description"
                  placeholder="Venue description"
                  aria-label="Venue description"
                  onBlur={handleBlur}
                  defaultValue={editVenueFilter[0].description}
                  required
                />
                <span className="error">{errors.description}</span>
              </div>
              {formState.media.map((mediaItem, index) => (
                <div key={index}>
                  <label htmlFor={`media.url.${index}`}>Venue media url</label>
                  <input
                    type="text"
                    name={`media.url.${index}`}
                    placeholder="User media url"
                    aria-label="User media url"
                    onBlur={handleBlur}
                    defaultValue={editVenueFilter[0].media[index]?.url || ""}
                  />
                  <span className="error">{errors.media[index] && errors.media[index].url}</span>
                  <label htmlFor={`media.alt.${index}`}>Venue media alt</label>
                  <input
                    type="text"
                    name={`media.alt.${index}`}
                    placeholder="User media alt"
                    aria-label="User media alt"
                    defaultValue={editVenueFilter[0].media[index]?.alt || ""}
                  />
                  {console.log("index before btn", index)}
                  {index !== 0 && (
                    <button type="button" className="btnStyle" onClick={() => handleRemoveImage(index)}>
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="btnStyle" onClick={handleAddImage}>
                Add Image
              </button>
              <div>
                <label htmlFor="price">Venue price</label>
                <input
                  type="number"
                  name="price"
                  placeholder="Venue price"
                  aria-label="Venue price"
                  onBlur={handleBlur}
                  defaultValue={editVenueFilter[0].price}
                  required
                />
                <span className="error">{errors.price}</span>
              </div>
              <div className="flex flex-row">
                <label htmlFor="maxGuests">Max guests</label>
                <input
                  type="number"
                  name="maxGuests"
                  aria-label="Max guests"
                  onBlur={handleBlur}
                  defaultValue={editVenueFilter[0].maxGuests}
                  required
                />
                <span className="error">{errors.maxGuests}</span>
              </div>
              <div className="flex flex-row">
                <label htmlFor="rating">Venue rating</label>
                <input type="number" name="rating" aria-label="Venue rating" max={5} defaultValue={editVenueFilter[0].rating} />
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
