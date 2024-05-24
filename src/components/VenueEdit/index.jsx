import { useEffect, useRef, useState } from "react";
import useGETProfileData from "../../hooks/useGETProfileData";
import usePostApiKey from "../../hooks/usePostApiKey";
import useLocalStorage from "../../hooks/useLocalStorage";
import { API_VENUES } from "../../shared/apis";
import useApiCall from "../../hooks/useApiCall";
import useVenues from "../../store/venueLocations";

function VenueEdit({ setVenueIdToShow, setIsVenueBookingsShown, setVenueBookingData, fetchVenueBookingData, venueId, handleCloseBtn }) {
  const { validateField } = useVenues();
  const { apiKey } = usePostApiKey();
  const { accessToken } = useLocalStorage();
  const { profileData } = useGETProfileData();
  const [errorMessage, setErrorMessage] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [confirmHandler, setConfirmHandler] = useState(null);

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

  // const handleAddImage = () => {
  //   setFormState({
  //     ...formState,
  //     media: [...formState.media, { url: "", alt: "" }],
  //   });
  // };
  const handleAddImage =
    (() => {
      setFormState((prevState) => ({
        ...prevState,
        media: [...prevState.media, { url: "", alt: "" }],
      }));
    },
    []);
  const runCount = useRef(0);

  useEffect(() => {
    if (editVenueFilter && runCount.current < editVenueFilter[0].media.length - 1) {
      handleAddImage(editVenueFilter[0].media[runCount.current]);
      runCount.current += 1;
    }
  }, [editVenueFilter, handleAddImage]);

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

  const ConfirmationModal = ({ onConfirm, onCancel }) => {
    const message = actionType === "submit" ? "Are you sure you want to edit this booking?" : "Are you sure you want to delete this booking?";
    return (
      <div className="overlayCheckVenue w-box300 sm:w-box565 md:w-form580 lg:w-box850">
        <div className="modulePositionVenue rounded-lg w-box245 sm:w-auto">
          <div className="flex flex-col justify-center ">
            <p className="text-xl text-center">{message}</p>
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
    setShowModal(true);
    setActionType("submit");
    setConfirmHandler(() => () => handleConfirm(updatedFormState));
    console.log("handleConfirm:", confirmHandler);
  };

  const handleConfirm = async (updatedFormState) => {
    setShowModal(false);

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
      if (updatedProfileData && !updatedProfileData.errors) {
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
        setVenueIdToShow(null);
        setIsVenueBookingsShown(false);
      } else {
        console.log("Error:", updatedProfileData);
        console.log("Error:", updatedProfileData.errors[0].message);
        setErrorMessage("There was an error: " + updatedProfileData.errors[0].message);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
    // Samme Kode!!
  };
  console.log("formState", formState);

  const handleDelete = async () => {
    console.log("hello :D");
    setShowModal(true);
    setActionType("delete");
    setConfirmHandler(() => handleDeleteConfirm);
  };

  const handleDeleteConfirm = async () => {
    setShowModal(false);

    try {
      const updatedProfileData = await apiCall(API_VENUES + "/" + venueId, "DELETE", {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey.key,
      });

      if (!updatedProfileData) {
        fetchVenueBookingData();
      } else {
        console.log("Error:", updatedProfileData.errors[0].message);
        setErrorMessage("There was an error: " + updatedProfileData.errors[0].message);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <div>
      <div className="flex justify-end">
        <button className="btnStyle" onClick={handleCloseBtn}>
          Close
        </button>
      </div>
      {showModal && <ConfirmationModal onConfirm={confirmHandler} onCancel={handleCancel} />}
      <div>
        {!editVenueFilter ? (
          <div className="loading"></div>
        ) : (
          <div>
            <form onSubmit={handleSubmit} className="flex flex-col venueEdit">
              <div className="flex flex-col items-center gap-5">
                <div className="flex flex-wrap justify-center gap-2.5">
                  <div className="flex flex-col">
                    <label htmlFor="name">Venue name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Venue name"
                      aria-label="Venue Name"
                      onBlur={handleBlur}
                      defaultValue={editVenueFilter[0].name}
                      className="bg-greyBlur w-box280 sm:w-box490 pl-1"
                      required
                    />
                    <span className="error">{errors.name}</span>
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="Venue description">Venue description</label>
                    <input
                      type="text"
                      name="description"
                      placeholder="Venue description"
                      aria-label="Venue description"
                      onBlur={handleBlur}
                      defaultValue={editVenueFilter[0].description}
                      className="bg-greyBlur w-box280 sm:w-box490 pl-1"
                      required
                    />
                    <span className="error">{errors.description}</span>
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="price">Venue price</label>
                    <input
                      type="number"
                      name="price"
                      placeholder="Venue price"
                      aria-label="Venue price"
                      onBlur={handleBlur}
                      defaultValue={editVenueFilter[0].price}
                      className="bg-greyBlur w-box280 sm:w-box490 pl-1"
                      required
                    />
                    <span className="error">{errors.price}</span>
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="maxGuests">Max guests</label>
                    <input
                      type="number"
                      name="maxGuests"
                      aria-label="Max guests"
                      onBlur={handleBlur}
                      defaultValue={editVenueFilter[0].maxGuests}
                      className="bg-greyBlur w-box280 sm:w-box490 pl-1"
                      required
                    />
                    <span className="error">{errors.maxGuests}</span>
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="rating">Venue rating</label>
                    <input
                      type="number"
                      name="rating"
                      aria-label="Venue rating"
                      max={5}
                      defaultValue={editVenueFilter[0].rating}
                      className="bg-greyBlur w-box280 sm:w-box490 pl-1"
                    />
                  </div>
                </div>
                <div className="flex flex-col w-box280 sm:w-box490 gap-2.5">
                  <h2>Amenities</h2>
                  <div className="flex justify-between bg-greyBlur px-1">
                    <label htmlFor="meta.wifi">Wifi availability</label>
                    <input type="checkbox" name="meta.wifi" aria-label="Wifi availability" defaultChecked={editVenueFilter[0].meta.wifi} />
                  </div>
                  <div className="flex justify-between px-1">
                    <label htmlFor="meta.parking">Parking availability</label>
                    <input type="checkbox" name="meta.parking" aria-label="Parking availability" defaultChecked={editVenueFilter[0].meta.parking} />
                  </div>
                  <div className="flex justify-between bg-greyBlur px-1">
                    <label htmlFor="meta.breakfast">Breakfast availability</label>
                    <input
                      type="checkbox"
                      name="meta.breakfast"
                      aria-label="Breakfast availability"
                      defaultChecked={editVenueFilter[0].meta.breakfast}
                    />
                  </div>
                  <div className="flex justify-between px-1">
                    <label htmlFor="meta.pets">Pets availability</label>
                    <input type="checkbox" name="meta.pets" aria-label="Pets availability" defaultChecked={editVenueFilter[0].meta.pets} />
                  </div>
                </div>
                <div className="flex flex-col gap-2.5">
                  <h2>Venue location</h2>
                  <div className="flex flex-col">
                    <label htmlFor="location.address">Venue address</label>
                    <input
                      type="text"
                      name="location.address"
                      placeholder="Venue address"
                      minLength={3}
                      aria-label="Venue address"
                      defaultValue={editVenueFilter[0].location.address}
                      className="bg-greyBlur w-box280 sm:w-box490 pl-1"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="location.city">Venue city</label>
                    <input
                      type="text"
                      name="location.city"
                      placeholder="Venue city"
                      minLength={3}
                      aria-label="Venue city"
                      defaultValue={editVenueFilter[0].location.city}
                      className="bg-greyBlur w-box280 sm:w-box490 pl-1"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="location.zip">Venue zip</label>
                    <input
                      type="number"
                      name="location.zip"
                      placeholder="Venue zip"
                      minLength={3}
                      aria-label="Venue zip"
                      defaultValue={editVenueFilter[0].location.zip}
                      className="bg-greyBlur w-box280 sm:w-box490 pl-1"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="location.country">Venue country</label>
                    <input
                      type="text"
                      name="location.country"
                      placeholder="Venue country"
                      minLength={3}
                      aria-label="Venue country"
                      defaultValue={editVenueFilter[0].location.country}
                      className="bg-greyBlur w-box280 sm:w-box490 pl-1"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="location.continent">Venue continent</label>
                    <input
                      type="text"
                      name="location.continent"
                      placeholder="Venue continent"
                      minLength={3}
                      aria-label="Venue continent"
                      defaultValue={editVenueFilter[0].location.continent}
                      className="bg-greyBlur w-box280 sm:w-box490 pl-1"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="location.lat">Venue latitude</label>
                    <input
                      type="number"
                      name="location.lat"
                      placeholder="Venue latitude"
                      minLength={3}
                      aria-label="Venue latitude"
                      defaultValue={editVenueFilter[0].location.lat}
                      className="bg-greyBlur w-box280 sm:w-box490 pl-1"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="location.lng">Venue longitude </label>
                    <input
                      type="number"
                      name="location.lng"
                      placeholder="Venue longitude"
                      minLength={3}
                      aria-label="Venue longitude"
                      defaultValue={editVenueFilter[0].location.lng}
                      className="bg-greyBlur w-box280 sm:w-box490 pl-1"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2.5">
                  <h2>Venue Media</h2>
                  {formState.media.map((mediaItem, index) => (
                    <div key={index} className={`flex flex-col ${index === 0 ? "pb-5" : ""}`}>
                      <label htmlFor={`media.url.${index}`}>Venue media url</label>
                      <input
                        type="text"
                        name={`media.url.${index}`}
                        placeholder="User media url"
                        aria-label="User media url"
                        onBlur={handleBlur}
                        defaultValue={editVenueFilter[0].media[index]?.url || ""}
                        className="bg-greyBlur w-box280 sm:w-box490 pl-1"
                      />
                      <span className="error">{errors.media[index] && errors.media[index].url}</span>
                      <label htmlFor={`media.alt.${index}`}>Venue media alt</label>
                      <input
                        type="text"
                        name={`media.alt.${index}`}
                        placeholder="User media alt"
                        aria-label="User media alt"
                        defaultValue={editVenueFilter[0].media[index]?.alt || ""}
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
            {/* {showModal && <ConfirmationModal onConfirm={confirmHandler} onCancel={handleCancel} />} */}
            <div className="flex justify-center mt-5">
              <button type="delete" className="btnStyle alternativeBtnStyle w-form500" onClick={handleDelete}>
                Delete Booking
              </button>
            </div>
            {errorMessage && <span className="error flex justify-center pt-2.5 text-xl">{errorMessage}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

export default VenueEdit;
