import { useEffect, useRef, useState } from "react";
import useGETProfileData from "../../hooks/useGETProfileData";
import usePostApiKey from "../../hooks/usePostApiKey";
import useLocalStorage from "../../hooks/useLocalStorage";
import { API_VENUES } from "../../shared/apis";
import useApiCall from "../../hooks/useApiCall";
import { useFormState } from "../../util/useFormState";
import { ConfirmationModal } from "../../util/ConfirmationModal";

/**
 * Component for editing a venue.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Function} props.setVenueIdToShow - Function to set the id of the venue to show.
 * @param {Function} props.setIsVenueBookingsShown - Function to set the visibility of the venue bookings.
 * @param {Function} props.setVenues - Function to set the list of venues.
 * @param {string} props.venueId - The ID of the venue to edit.
 * @param {Function} props.handleCloseBtn - Function to handle closing the venue edit form.
 * @param {Function} props.setIsCreateVenueShown - Function to set the visibility of the create venue form.
 * @param {Function} props.onDeleteVenue - Function to handle deletion of a venue.
 * @returns {JSX.Element} The JSX element representing the venue edit form.
 */
function VenueEdit({ setVenueIdToShow, setIsVenueBookingsShown, setVenues, venueId, handleCloseBtn, setIsCreateVenueShown, onDeleteVenue }) {
  const { formState, errors, handleBlur, handleAddImage, handleRemoveImage, handleSubmit } = useFormState();
  const { apiKey } = usePostApiKey();
  const { accessToken } = useLocalStorage();
  const { profileData } = useGETProfileData();
  const [errorMessage, setErrorMessage] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [confirmHandler, setConfirmHandler] = useState(null);

  const runCount = useRef(0);

  let editVenueFilter;
  if (profileData && profileData.venues) {
    editVenueFilter = profileData.venues.filter((venue) => venue.id === venueId);
  }

  const apiCall = useApiCall();

  useEffect(() => {
    if (editVenueFilter && runCount.current < editVenueFilter[0].media.length - 1) {
      handleAddImage(editVenueFilter[0].media[runCount.current]);
      runCount.current += 1;
    }
  }, [editVenueFilter, handleAddImage]);

  /**
   * Handles confirmation of venue update.
   *
   * @param {Object} updatedFormState - The updated form state.
   */
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
      if (updatedProfileData && !updatedProfileData.errors) {
        setVenues((prevVenues) =>
          prevVenues.map((venue) => (venue.id === updatedProfileData.data.id ? { ...venue, ...updatedProfileData.data } : venue))
        );
        setVenueIdToShow(null);
        setIsVenueBookingsShown(false);
      } else {
        console.log("Error:", updatedProfileData.errors[0].message);
        setErrorMessage("There was an error: " + updatedProfileData.errors[0].message);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  /**
   * Handles deletion of the venue.
   */
  const handleDelete = async () => {
    setShowModal(true);
    setActionType("delete");
    setConfirmHandler(() => handleDeleteConfirm);
  };

  /**
   * Handles confirmation of venue deletion.
   */
  const handleDeleteConfirm = async () => {
    setShowModal(false);

    try {
      const updatedProfileData = await apiCall(API_VENUES + "/" + venueId, "DELETE", {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey.key,
      });

      if (!updatedProfileData) {
        onDeleteVenue(venueId);
        setVenueIdToShow(null);
        setIsCreateVenueShown(false);
      } else {
        console.log("Error:", updatedProfileData.errors[0].message);
        setErrorMessage("There was an error: " + updatedProfileData.errors[0].message);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  /**
   * Handles cancellation of the action.
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
      {showModal && (
        <ConfirmationModal
          message={actionType === "submit" ? "Are you sure you want to edit this venue?" : "Are you sure you want to delete this venue?"}
          onConfirm={confirmHandler}
          onCancel={handleCancel}
          containerClassName="overlayCheckVenue w-box300 sm:w-box565 md:w-form580 lg:w-box850"
          contentClassName="modulePositionVenue rounded-lg w-box245 sm:w-auto"
          buttonClassName={{ confirm: "bg-green", deny: "bg-redish" }}
        />
      )}
      <div>
        {!editVenueFilter ? (
          <div className="loading"></div>
        ) : (
          <div>
            <form
              onSubmit={(e) => handleSubmit(e, setShowModal, setActionType, setConfirmHandler, handleConfirm)}
              className="flex flex-col venueEdit"
            >
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
                      defaultValue={editVenueFilter[0].name}
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
                      id="price"
                      name="price"
                      placeholder="Venue price"
                      aria-label="Venue price"
                      max={10000}
                      onBlur={handleBlur}
                      defaultValue={editVenueFilter[0].price}
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
                      defaultValue={editVenueFilter[0].maxGuests}
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
                    <select
                      type="number"
                      id="rating"
                      name="rating"
                      aria-label="Venue rating"
                      defaultValue={editVenueFilter[0].rating}
                      className="bg-greyBlur w-box280 sm:w-box490 pl-1"
                    >
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
                    <input
                      type="checkbox"
                      id="meta.wifi"
                      name="meta.wifi"
                      aria-label="Wifi availability"
                      defaultChecked={editVenueFilter[0].meta.wifi}
                    />
                  </div>
                  <div className="flex justify-between px-1">
                    <label htmlFor="meta.parking">Parking availability</label>
                    <input
                      type="checkbox"
                      id="meta.parking"
                      name="meta.parking"
                      aria-label="Parking availability"
                      defaultChecked={editVenueFilter[0].meta.parking}
                    />
                  </div>
                  <div className="flex justify-between bg-greyBlur px-1">
                    <label htmlFor="meta.breakfast">Breakfast availability</label>
                    <input
                      type="checkbox"
                      id="meta.breakfast"
                      name="meta.breakfast"
                      aria-label="Breakfast availability"
                      defaultChecked={editVenueFilter[0].meta.breakfast}
                    />
                  </div>
                  <div className="flex justify-between px-1">
                    <label htmlFor="meta.pets">Pets availability</label>
                    <input
                      type="checkbox"
                      id="meta.pets"
                      name="meta.pets"
                      aria-label="Pets availability"
                      defaultChecked={editVenueFilter[0].meta.pets}
                    />
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
                      defaultValue={editVenueFilter[0].location.address}
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
                      defaultValue={editVenueFilter[0].location.city}
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
                      defaultValue={editVenueFilter[0].location.zip}
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
                      defaultValue={editVenueFilter[0].location.country}
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
                      defaultValue={editVenueFilter[0].location.continent}
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
                      defaultValue={editVenueFilter[0].location.lat}
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
                      defaultValue={editVenueFilter[0].location.lng}
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
                        defaultValue={editVenueFilter[0].media[index]?.url || ""}
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
                        defaultValue={editVenueFilter[0].media[index]?.alt || ""}
                        className="bg-greyBlur w-box280 sm:w-box490 pl-1"
                      />
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
