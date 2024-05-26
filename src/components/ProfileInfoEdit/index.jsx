import { useState } from "react";
import useGETProfileData from "../../hooks/useGETProfileData";
import usePostApiKey from "../../hooks/usePostApiKey";
import useLocalStorage from "../../hooks/useLocalStorage";
import { API_PROFILES } from "../../shared/apis";
import useApiCall from "../../hooks/useApiCall";
import useValidation from "../../util/venueLocations";

/**
 * Component to edit the user's profile information.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {Function} props.setProfileData - Function to update the profile data in the parent component.
 * @param {Function} props.setIsProfileEditShown - Function to toggle the profile edit form visibility.
 * @param {Function} props.setIsUserManager - Function to set the user's manager status.
 * @param {Function} props.setIsSectionAShown - Function to toggle the visibility of section A.
 * @param {Function} props.setIsSectionBShown - Function to toggle the visibility of section B.
 * @param {Function} props.setSectionAButtonDisabled - Function to disable the section A button.
 * @param {Function} props.setSectionBButtonDisabled - Function to disable the section B button.
 * @param {Function} props.handleCloseBtn - Function to handle closing the profile edit form.
 * @returns {JSX.Element} The ProfileInfoEdit component.
 */
function ProfileInfoEdit({
  setProfileData,
  setIsProfileEditShown,
  setIsUserManager,
  setIsSectionAShown,
  setIsSectionBShown,
  setSectionAButtonDisabled,
  setSectionBButtonDisabled,
  handleCloseBtn,
}) {
  const { validateField } = useValidation();
  const { apiKey } = usePostApiKey();
  const { accessToken } = useLocalStorage();
  const [errorMessage, setErrorMessage] = useState("");

  const { profileData } = useGETProfileData();

  const [formState, setFormState] = useState({
    bio: "",
    avatar: {
      url: "",
      alt: "",
    },
    banner: {
      url: "",
      alt: "",
    },
    venueManager: false,
  });

  const [errors, setErrors] = useState({
    avatar: {
      url: "",
    },
    banner: {
      url: "",
    },
  });

  /**
   * Handles blur events on form fields to validate input.
   *
   * @param {Object} event - The blur event object.
   * @param {string} event.target.name - The name of the input field.
   * @param {string} event.target.value - The value of the input field.
   */
  const handleBlur = (event) => {
    const { name, value } = event.target;
    const newErrors = { ...errors };

    switch (name) {
      case "avatar.url":
        newErrors.avatar.url = validateField(value, "imgUrl") ? "" : "Please enter a valid URL";
        break;
      case "banner.url":
        newErrors.banner.url = validateField(value, "imgUrl") ? "" : "Please enter a valid URL";
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const apiCall = useApiCall();

  /**
   * Handles the form submission to update the user's profile information.
   *
   * @param {Object} event - The form submission event object.
   * @param {HTMLFormElement} event.target - The form element.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    let avatarUrl = event.target.elements["avatar.url"].value;
    let avatarAlt = event.target.elements["avatar.alt"].value;
    if (!avatarUrl) {
      avatarUrl = "https://images.unsplash.com/photo-1579547945413-497e1b99dac0";
    }
    if (!avatarAlt) {
      avatarAlt = "Profile Avatar";
    }

    let bannerUrl = event.target.elements["banner.url"].value;
    let bannerAlt = event.target.elements["banner.alt"].value;
    if (!bannerUrl) {
      bannerUrl = "https://images.unsplash.com/photo-1457369804613-52c61a468e7d";
    }
    if (!bannerAlt) {
      bannerAlt = "A wall of books";
    }

    const updatedFormState = {
      ...formState,
      bio: event.target.elements.bio.value,
      avatar: {
        url: avatarUrl,
        alt: avatarAlt,
      },
      banner: {
        url: bannerUrl,
        alt: bannerAlt,
      },
      venueManager: event.target.querySelector('input[name="venueManager"]').checked,
    };
    setFormState(updatedFormState);
    console.log("updatedFormState", updatedFormState);

    try {
      const updatedProfileData = await apiCall(
        API_PROFILES + "/" + profileData.name,
        "PUT",
        {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": apiKey.key,
        },
        updatedFormState
      );
      console.log("try", updatedProfileData.data);

      if (!updatedProfileData.errors) {
        setProfileData({
          ...profileData,
          bio: updatedProfileData.data.bio,
          avatar: updatedProfileData.data.avatar,
          banner: updatedProfileData.data.banner,
          venueManager: updatedProfileData.data.venueManager,
        });
        setIsProfileEditShown(false);
        setIsUserManager(updatedProfileData.data.venueManager);
        if (updatedProfileData.data.venueManager === false) {
          setIsSectionAShown(true);
          setIsSectionBShown(false);
          setSectionAButtonDisabled(true);
          setSectionBButtonDisabled(false);
        }
        console.log("try2", profileData);
      } else {
        console.log("Error:", updatedProfileData);
        console.log("Error:", updatedProfileData.errors[0].message);
        setErrorMessage("There was an error: " + updatedProfileData.errors[0].message);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="self-end">
        <button className="btnStyle" onClick={handleCloseBtn}>
          Close
        </button>
      </div>
      {!profileData.name ? (
        <div className="loading"></div>
      ) : (
        <div className="flex flex-col items-center venueEdit w-72 sm:w-formDiv35">
          <h2 className="font-semibold text-lg">Edit Profile Information</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-64 sm:w-form500">
            <div className="flex flex-col">
              <label htmlFor="bio">User bio</label>
              <textarea
                type="text"
                id="bio"
                name="bio"
                placeholder="User bio"
                minLength={3}
                maxLength={160}
                aria-label="User bio"
                defaultValue={profileData.bio}
                className="bg-greyBlur h-48 w-box280 sm:h-32 sm:w-box490 pl-1"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="avatar.url">Venue avatar url</label>
              <input
                type="text"
                id="avatar.url"
                name="avatar.url"
                placeholder="User avatar url"
                aria-label="User avatar url"
                onBlur={handleBlur}
                defaultValue={profileData.avatar.url}
                className="bg-greyBlur w-box280 sm:w-box490 pl-1"
              />
              <span className="error">{errors.avatar.url}</span>
            </div>
            <div className="flex flex-col">
              <label htmlFor="avatar.alt">Venue avatar alternative text</label>
              <input
                type="text"
                id="avatar.alt"
                name="avatar.alt"
                placeholder="User avatar alternative text"
                aria-label="User avatar alternative text"
                defaultValue={profileData.avatar.alt}
                className="bg-greyBlur w-box280 sm:w-box490 pl-1"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="banner.url">Profile banner url</label>
              <input
                type="text"
                id="banner.url"
                name="banner.url"
                placeholder="Profile banner url"
                aria-label="Profile banner url"
                onBlur={handleBlur}
                defaultValue={profileData.banner.url}
                className="bg-greyBlur w-box280 sm:w-box490 pl-1"
              />
              <span className="error">{errors.banner.url}</span>
            </div>
            <div className="flex flex-col">
              <label htmlFor="banner.alt">Profile banner alternative text</label>
              <input
                type="text"
                id="banner.alt"
                name="banner.alt"
                placeholder="Profile banner alternative text"
                aria-label="Profile banner alternative text"
                defaultValue={profileData.banner.alt}
                className="bg-greyBlur w-box280 sm:w-box490 pl-1"
              />
            </div>
            <div className="checkboxStyle">
              <label htmlFor="venueManager">Venue Manager</label>
              <input
                type="checkbox"
                id="venueManager"
                name="venueManager"
                aria-label="Venue Manager"
                defaultChecked={profileData.venueManager}
                className="switch"
              />
            </div>
            <button type="submit" className="btnStyle w-36 self-center mt-5">
              Save changes
            </button>
          </form>

          {errorMessage && <span className="error flex justify-center pt-2.5 text-xl">{errorMessage}</span>}
        </div>
      )}
    </div>
  );
}

export default ProfileInfoEdit;
