import { useState } from "react";
import { API_VENUES } from "../../shared/apis";
import useLocalStorage from "../../hooks/useLocalStorage";
import usePostApiKey from "../../hooks/usePostApiKey";
import useApiCall from "../../hooks/useApiCall";
import useValidation from "../../util/venueLocations";

/**
 * Component for creating a new venue.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Function} props.setVenues - Function to set the list of venues.
 * @param {Function} props.handleCloseBtn - Function to handle closing the create venue form.
 * @param {Function} props.setIsCreateVenueShown - Function to set the visibility of the create venue form.
 * @returns {JSX.Element} The JSX element representing the create venue form.
 */
function CreateVenue({ setVenues, handleCloseBtn, setIsCreateVenueShown }) {
  const { validateField } = useValidation();
  const { apiKey } = usePostApiKey();
  const { accessToken } = useLocalStorage();
  const [showModal, setShowModal] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
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
    location: {
      lat: "",
      lng: "",
    },
  });

  /**
   * Handles blur events on form fields to perform validation.
   *
   * @param {Event} event - The blur event.
   */
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
          newErrors[name] = validateField(value, "inputLength") ? "" : "You must enter a name between 1 to 20 characters";
          break;
        case "description":
          newErrors[name] = validateField(value, "minInputLength") ? "" : "You must enter a description";
          break;
        case "price":
        case "maxGuests":
          newErrors[name] = validateField(value, "numbersOnly") ? "" : "Value must be a number";
          break;
        case "location.lat":
          newErrors.location.lat = validateField(value, "latitude") ? "" : "Latitude must be between -90 and 90";
          break;
        case "location.lng":
          newErrors.location.lng = validateField(value, "longitude") ? "" : "Longitude must be between -180 and 180";
          break;
        default:
          break;
      }
    }

    setErrors(newErrors);
  };

  const apiCall = useApiCall();

  /**
   * Adds a new image field to the form state.
   */
  const handleAddImage = () => {
    setFormState({
      ...formState,
      media: [...formState.media, { url: "", alt: "" }],
    });
  };

  /**
   * Removes an image field from the form state.
   *
   * @param {number} index - The index of the image field to remove.
   */
  const handleRemoveImage = (index) => {
    if (formState.media.length > 1) {
      const newMedia = [...formState.media];
      newMedia.splice(index, 1);
      setFormState({ ...formState, media: newMedia });
    }
  };

  /**
   * Confirmation modal component for confirming venue creation.
   *
   * @param {Object} props - The properties passed to the component.
   * @param {Function} props.onConfirm - Function to confirm venue creation.
   * @param {Function} props.onCancel - Function to cancel venue creation.
   * @returns {JSX.Element} The JSX element representing the confirmation modal.
   */
  const ConfirmationModal = ({ onConfirm, onCancel }) => {
    return (
      <div className="overlayCheckVenue w-box300 sm:w-box565 md:w-form580 lg:w-box850">
        <div className="modulePositionVenue rounded-lg w-box245 sm:w-auto">
          <div className="flex flex-col justify-center ">
            <p className="text-xl text-center">Create new Venue?</p>
            <div className="flex gap-5 justify-evenly pt-5">
              <button className="btnStyle confirmBtn w-24 bg-green" onClick={onConfirm}>
                Yes
              </button>
              <button className="btnStyle denyBtn w-24 bg-redish" onClick={onCancel}>
                No
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Handles form submission.
   *
   * @param {Event} event - The form submission event.
   */
  const handleSubmit = (event) => {
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
    setFormState(updatedFormState);
    setShowModal(true);
  };

  /**
   * Handles confirmation of venue creation.
   */
  const handleConfirm = async () => {
    setShowModal(false);

    try {
      const updatedProfileData = await apiCall(
        API_VENUES,
        "POST",
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": apiKey.key,
        },
        formState
      );

      if (updatedProfileData && !updatedProfileData.errors) {
        setVenues((prevVenues) => [...prevVenues, updatedProfileData.data]);
        setIsCreateVenueShown(false);
      } else {
        console.log("Error:", updatedProfileData);
        console.log("Error:", updatedProfileData.errors[0].message);
        setErrorMessage("There was an error: " + updatedProfileData.errors[0].message);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  /**
   * Handles cancellation of venue creation.
   */
  const handleCancel = () => {
    setShowModal(false);
  };

  const optionsGuest = Array.from({ length: 100 }, (_, index) => index + 1);
  const optionsRating = Array.from({ length: 6 }, (_, index) => index);

  return (
    <div>
      <div className="flex justify-end">
        <button className="btnStyle" onClick={handleCloseBtn}>
          Close
        </button>
      </div>
      {showModal && <ConfirmationModal onConfirm={handleConfirm} onCancel={handleCancel} />}

      <div>
        <form onSubmit={handleSubmit} className="flex flex-col venueEdit">
          <div className="flex flex-col items-center gap-5">
            <div className="flex flex-wrap justify-center gap-2.5">
              <div className="flex flex-col">
                <label htmlFor="name">Venue name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Venue name"
                  aria-label="Venue Name"
                  onBlur={handleBlur}
                  className="bg-greyBlur w-box280 sm:w-box490 pl-1"
                  required
                />
                <span className="error">{errors.name}</span>
              </div>
              <div className="flex flex-col">
                <label htmlFor="description">Venue description</label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  placeholder="Venue description"
                  aria-label="Venue description"
                  onBlur={handleBlur}
                  className="bg-greyBlur w-box280 sm:w-box490 pl-1"
                  required
                />
                <span className="error">{errors.description}</span>
              </div>

              <div className="flex flex-col">
                <label htmlFor="price">Venue price</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Venue price"
                  aria-label="Venue price"
                  max={10000}
                  onBlur={handleBlur}
                  className="bg-greyBlur w-box280 sm:w-box490 pl-1"
                  required
                />
                <span className="error">{errors.price}</span>
              </div>
              <div className="flex flex-col">
                <label htmlFor="maxGuests">Max guests</label>
                <select
                  type="number"
                  id="maxGuests"
                  name="maxGuests"
                  onBlur={handleBlur}
                  aria-label="Max guests"
                  className="bg-greyBlur w-box280 sm:w-box490 pl-1"
                  required
                >
                  {optionsGuest.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <span className="error">{errors.maxGuests}</span>
              </div>
              <div className="flex flex-col">
                <label htmlFor="rating">Venue rating</label>
                <select type="number" id="rating" name="rating" aria-label="Venue rating" className="bg-greyBlur w-box280 sm:w-box490 pl-1">
                  {optionsRating.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col w-box280 sm:w-box490 gap-2.5">
              <h2>Amenities</h2>
              <div className="flex justify-between bg-greyBlur px-1">
                <label htmlFor="meta.wifi">Wifi availability</label>
                <input type="checkbox" id="meta.wifi" name="meta.wifi" aria-label="Wifi availability" />
              </div>
              <div className="flex justify-between px-1">
                <label htmlFor="meta.parking">Parking availability</label>
                <input type="checkbox" id="meta.parking" name="meta.parking" aria-label="Parking availability" />
              </div>
              <div className="flex justify-between bg-greyBlur px-1">
                <label htmlFor="meta.breakfast">Breakfast availability</label>
                <input type="checkbox" id="meta.breakfast" name="meta.breakfast" aria-label="Breakfast availability" />
              </div>
              <div className="flex justify-between px-1">
                <label htmlFor="meta.pets">Pets availability</label>
                <input type="checkbox" id="meta.pets" name="meta.pets" aria-label="Pets availability" />
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              <h2>Venue location</h2>
              <div className="flex flex-col">
                <label htmlFor="location.address">Venue address</label>
                <input
                  type="text"
                  id="location.address"
                  name="location.address"
                  placeholder="Venue address"
                  aria-label="Venue address"
                  className="bg-greyBlur w-box280 sm:w-box490 pl-1"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="location.city">Venue city</label>
                <input
                  type="text"
                  id="location.city"
                  name="location.city"
                  placeholder="Venue city"
                  aria-label="Venue city"
                  className="bg-greyBlur w-box280 sm:w-box490 pl-1"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="location.zip">Venue zip</label>
                <input
                  type="number"
                  id="location.zip"
                  name="location.zip"
                  placeholder="Venue zip"
                  aria-label="Venue zip"
                  className="bg-greyBlur w-box280 sm:w-box490 pl-1"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="location.country">Venue country</label>
                <input
                  type="text"
                  id="location.country"
                  name="location.country"
                  placeholder="Venue country"
                  aria-label="Venue country"
                  className="bg-greyBlur w-box280 sm:w-box490 pl-1"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="location.continent">Venue continent</label>
                <input
                  type="text"
                  id="location.continent"
                  name="location.continent"
                  placeholder="Venue continent"
                  aria-label="Venue continent"
                  className="bg-greyBlur w-box280 sm:w-box490 pl-1"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="location.lat">Venue latitude</label>
                <input
                  type="number"
                  id="location.lat"
                  name="location.lat"
                  onBlur={handleBlur}
                  placeholder="Venue latitude"
                  aria-label="Venue latitude"
                  className="bg-greyBlur w-box280 sm:w-box490 pl-1"
                />
                <span className="error">{errors.location.lat}</span>
              </div>
              <div className="flex flex-col">
                <label htmlFor="location.lng">Venue longitude </label>
                <input
                  type="number"
                  id="location.lng"
                  name="location.lng"
                  onBlur={handleBlur}
                  placeholder="Venue longitude"
                  aria-label="Venue longitude"
                  className="bg-greyBlur w-box280 sm:w-box490 pl-1"
                />
                <span className="error">{errors.location.lng}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2.5">
              <h2>Venue Media</h2>
              {formState.media.map((mediaItem, index) => (
                <div key={index} className={`flex flex-col ${index === 0 ? "pb-5" : ""}`}>
                  <label htmlFor={`media.url.${index}`}>Venue media url</label>
                  <input
                    type="text"
                    id={`media.url.${index}`}
                    name={`media.url.${index}`}
                    placeholder="User media url"
                    aria-label="User media url"
                    onBlur={handleBlur}
                    className="bg-greyBlur w-box280 sm:w-box490 pl-1"
                  />
                  <span className="error">{errors.media[index] && errors.media[index].url}</span>
                  <label htmlFor={`media.alt.${index}`}>Venue media alt</label>
                  <input
                    type="text"
                    id={`media.alt.${index}`}
                    name={`media.alt.${index}`}
                    placeholder="User media alt"
                    aria-label="User media alt"
                    className="bg-greyBlur w-box280 sm:w-box490 pl-1"
                  />
                  {console.log("index before btn", index)}
                  {index !== 0 && (
                    <button
                      type="button"
                      className="btnStyle alternativeBtnStyle mt-2.5 w-box280 sm:w-box490"
                      onClick={() => handleRemoveImage(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <div className="flex justify-center mt-4">
                <button type="button" className="btnStyle" onClick={handleAddImage}>
                  Add Image
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <button type="submit" className="btnStyle alternativeBtnStyle w-form500">
              Submit
            </button>
          </div>
        </form>
        {errorMessage && <span className="error flex justify-center pt-2.5 text-xl">{errorMessage}</span>}
      </div>
    </div>
  );
}

export default CreateVenue;
