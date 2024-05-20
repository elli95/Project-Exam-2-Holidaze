import { useState } from "react";
import { API_VENUES } from "../../shared/apis";
import useLocalStorage from "../../hooks/useLocalStorage";
import usePostApiKey from "../../hooks/usePostApiKey";
import useApiCall from "../../hooks/useApiCall";
import useVenues from "../../store/venueLocations";

function CreateVenue() {
  const { validateField } = useVenues();
  const { apiKey } = usePostApiKey();
  const { accessToken } = useLocalStorage();
  const [isVenueFormShown, setIsVenueFormShown] = useState(false);
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

  const handleCreateVenueForm = () => {
    setIsVenueFormShown(!isVenueFormShown);
  };

  const handleAddImage = () => {
    setFormState({
      ...formState,
      media: [...formState.media, { url: "", alt: "" }],
    });
  };

  const handleRemoveImage = (index) => {
    if (formState.media.length > 1) {
      const newMedia = [...formState.media];
      newMedia.splice(index, 1);
      setFormState({ ...formState, media: newMedia });
    }
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
    console.log("Venue form submitted:", updatedFormState);
    setFormState(updatedFormState);

    apiCall(
      API_VENUES,
      "POST",
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey.key,
      },
      updatedFormState
    );
  };

  return (
    <div className="self-center">
      <div className="flex justify-center">
        <button className="btnStyle w-44" onClick={handleCreateVenueForm}>
          Create new Venue
        </button>
      </div>
      {isVenueFormShown && (
        <div className="flex flex-col items-center formStyle w-72 sm:w-formDiv35">
          <h2 className="font-semibold text-lg">Create A Venue</h2>
          <form onSubmit={handleSubmit} className="flex flex-col w-64 sm:w-form500">
            <div>
              <div className="gap-3">
                <div>
                  <label htmlFor="name">Venue name</label>
                  <input type="text" name="name" placeholder="Venue name" aria-label="Venue Name" onBlur={handleBlur} required />
                  <span className="error">{errors.name}</span>
                </div>
                <div>
                  <label htmlFor="Venue description">Venue description</label>
                  <textarea
                    type="text"
                    name="description"
                    placeholder="Venue description"
                    aria-label="Venue description"
                    onBlur={handleBlur}
                    className="h-48 "
                    required
                  />
                  <span className="error">{errors.description}</span>
                </div>
                <div>
                  <label htmlFor="price">Venue price</label>
                  <input type="number" name="price" placeholder="Venue price" aria-label="Venue price" onBlur={handleBlur} required />
                  <span className="error">{errors.price}</span>
                </div>
                <div className="flex flex-row">
                  <label htmlFor="maxGuests">Max guests</label>
                  <input type="number" name="maxGuests" min={1} max={100} aria-label="Max guests" onBlur={handleBlur} required />
                  <span className="error">{errors.maxGuests}</span>
                </div>
                <div className="flex flex-row">
                  <label htmlFor="rating">Venue rating</label>
                  <input type="number" name="rating" aria-label="Venue rating" />
                </div>
              </div>
              <div className="gap-3">
                <h2 className="font-semibold">Venue media</h2>
                {formState.media.map((mediaItem, index) => (
                  <div key={index} className="gap-1.5">
                    <div>
                      <label htmlFor={`media.url.${index}`}>Venue media url</label>
                      <input type="text" name={`media.url.${index}`} placeholder="User media url" aria-label="User media url" onBlur={handleBlur} />
                      <span className="error">{errors.media[index] && errors.media[index].url}</span>
                    </div>
                    <div>
                      <label htmlFor={`media.alt.${index}`}>Venue media alt</label>
                      <input type="text" name={`media.alt.${index}`} placeholder="User media alt" aria-label="User media alt" />
                    </div>
                    {index !== 0 && (
                      <div className="mt-3">
                        <button type="button" className="btnStyle w-32 self-center" onClick={() => handleRemoveImage(index)}>
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                <div>
                  <button type="button" className="btnStyle w-32 self-center" onClick={handleAddImage}>
                    Add Image
                  </button>
                </div>
              </div>
              <div className="gap-3">
                <h2 className="font-semibold">Amenities</h2>
                <div className="checkboxStyle">
                  <label htmlFor="meta.wifi">Wifi availability</label>
                  <input type="checkbox" name="meta.wifi" aria-label="Wifi availability" />
                </div>
                <div className="checkboxStyle">
                  <label htmlFor="meta.parking">Parking availability</label>
                  <input type="checkbox" name="meta.parking" aria-label="Parking availability" />
                </div>
                <div className="checkboxStyle">
                  <label htmlFor="meta.breakfast">Breakfast availability</label>
                  <input type="checkbox" name="meta.breakfast" aria-label="Breakfast availability" />
                </div>
                <div className="checkboxStyle">
                  <label htmlFor="meta.pets">Pets availability</label>
                  <input type="checkbox" name="meta.pets" aria-label="Pets availability" />
                </div>
              </div>
              <div className="gap-3">
                <h2 className="font-semibold">Venue location</h2>
                <div>
                  <label htmlFor="location.address">Venue address</label>
                  <input type="text" name="location.address" placeholder="Venue address" aria-label="Venue address" />
                </div>
                <div>
                  <label htmlFor="location.city">Venue city</label>
                  <input type="text" name="location.city" placeholder="Venue city" aria-label="Venue city" />
                </div>
                <div>
                  <label htmlFor="location.zip">Venue zip</label>
                  <input type="number" name="location.zip" placeholder="Venue zip" aria-label="Venue zip" />
                </div>
                <div>
                  <label htmlFor="location.country">Venue country</label>
                  <input type="text" name="location.country" placeholder="Venue country" aria-label="Venue country" />
                </div>
                <div>
                  <label htmlFor="location.continent">Venue continent</label>
                  <input type="text" name="location.continent" placeholder="Venue continent" aria-label="Venue continent" />
                </div>
                <div>
                  <label htmlFor="location.lat">Venue latitude</label>
                  <input type="number" name="location.lat" placeholder="Venue latitude" min={-90} max={90} aria-label="Venue latitude" />
                </div>
                <div>
                  <label htmlFor="location.lng">Venue longitude </label>
                  <input type="number" name="location.lng" placeholder="Venue longitude" min={-90} max={90} aria-label="Venue longitude" />
                </div>
              </div>
            </div>
            <div>
              <button type="submit" className="btnStyle w-32 self-center mt-5">
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default CreateVenue;
