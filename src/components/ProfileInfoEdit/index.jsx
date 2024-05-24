import { useState } from "react";
import useGETProfileData from "../../hooks/useGETProfileData";
import usePostApiKey from "../../hooks/usePostApiKey";
import useLocalStorage from "../../hooks/useLocalStorage";
import { API_PROFILES } from "../../shared/apis";
import useApiCall from "../../hooks/useApiCall";
import useVenues from "../../store/venueLocations";
// import useBtnDividerEventHandlers from "../../hooks/useBtnDividerEventHandlers";

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
  const { validateField } = useVenues();
  const { apiKey } = usePostApiKey();
  const { accessToken } = useLocalStorage();
  // const [isVenueFormShown, setIsVenueFormShown] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // const [profileData, setProfileData] = useState();

  const { profileData } = useGETProfileData();

  // const { setIsSectionAShown } = useBtnDividerEventHandlers();

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

  // const handleCreateVenueForm = () => {
  //   setIsVenueFormShown(!isVenueFormShown);
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let avatarUrl = event.target.elements["avatar.url"].value;
    let avatarAlt = event.target.elements["avatar.alt"].value;
    if (!avatarUrl) {
      avatarUrl =
        "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?q=80&w=2624&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    }
    if (!avatarAlt) {
      avatarAlt = "This is a goldfish";
    }

    let bannerUrl = event.target.elements["banner.url"].value;
    let bannerAlt = event.target.elements["banner.alt"].value;
    if (!bannerUrl) {
      bannerUrl =
        "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
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

  console.log("try333", profileData);
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="self-end">
        <button className="btnStyle" onClick={handleCloseBtn}>
          Close
        </button>
      </div>
      {/* <div className="flex justify-center">
        <button className="btnStyle w-44" onClick={handleCreateVenueForm}>
          Edit Profile
        </button>
      </div> */}
      {/* {isVenueFormShown && ( */}
      {!profileData.name ? (
        <div className="loading"></div>
      ) : (
        <div className="flex flex-col items-center venueEdit w-72 sm:w-formDiv35">
          <h2 className="font-semibold text-lg">Edit Profile Information</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-64 sm:w-form500">
            <div className="flex flex-col">
              <label htmlFor="name">User bio</label>
              <textarea
                type="text"
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
                name="banner.alt"
                placeholder="Profile banner alternative text"
                aria-label="Profile banner alternative text"
                defaultValue={profileData.banner.alt}
                className="bg-greyBlur w-box280 sm:w-box490 pl-1"
              />
            </div>
            <div className="checkboxStyle">
              <label htmlFor="venueManager">Venue Manager</label>
              <input type="checkbox" name="venueManager" aria-label="Venue Manager" defaultChecked={profileData.venueManager} className="switch" />
            </div>
            <button type="submit" className="btnStyle w-36 self-center mt-5">
              Save changes
            </button>
          </form>

          {errorMessage && <span className="error flex justify-center pt-2.5 text-xl">{errorMessage}</span>}
        </div>
      )}
      {/* )} */}
    </div>
  );
}

export default ProfileInfoEdit;
