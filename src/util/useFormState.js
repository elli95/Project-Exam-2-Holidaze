import { useState } from "react";
import useValidation from "./useValidation";

export const useFormState = () => {
  const { validateField } = useValidation();

  const [formState, setFormState] = useState({
    name: "",
    description: "",
    media: [{ url: "", alt: "" }],
    price: "",
    maxGuests: "",
    rating: "",
    meta: { wifi: false, parking: false, breakfast: false, pets: false },
    location: { address: "", city: "", zip: "", country: "", continent: "", lat: "", lng: "" },
  });

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    media: [{ url: "" }],
    price: "",
    maxGuests: "",
    location: { lat: "", lng: "" },
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
   * Handles form submission, processes the form data, updates the form state,
   * and optionally sets the show modal, action type, and confirm handler.
   *
   * @param {Event} event - The form submission event.
   * @param {Function} setShowModal - Function to control the visibility of the modal.
   * @param {Function} [setActionType] - Optional function to set the action type.
   * @param {Function} [setConfirmHandler] - Optional function to set the confirm handler.
   * @param {Function} [handleConfirm] - Optional function to handle confirmation of form submission.
   */
  const handleSubmit = (event, setShowModal, setActionType, setConfirmHandler, handleConfirm) => {
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
        media[i].url = "https://images.unsplash.com/photo-1579547945413-497e1b99dac0";
      }
      if (!media[i].alt) {
        media[i].alt = "Venue";
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
    setActionType && setActionType("submit");
    setConfirmHandler && setConfirmHandler(() => () => handleConfirm(updatedFormState));
  };

  return {
    formState,
    errors,
    handleBlur,
    handleAddImage,
    handleRemoveImage,
    handleSubmit,
  };
};
