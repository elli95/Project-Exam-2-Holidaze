import { useEffect, useState } from "react";
import useGETProfileData from "../../hooks/useGETProfileData";
import usePostApiKey from "../../hooks/usePostApiKey";
import useLocalStorage from "../../hooks/useLocalStorage";
import { API_PROFILES } from "../../shared/apis";

// import usePostApiKey from "../../hooks/usePostApiKey";
// import { API_PROFILES } from "../../shared/apis";
// import { useEffect } from "react";
// import useLocalStorage from "../../hooks/useLocalStorage";

function ProfileInfoEdit() {
  const { apiKey } = usePostApiKey();
  const { accessToken } = useLocalStorage();
  const [isVenueFormShown, setIsVenueFormShown] = useState(false);

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
  console.log("profileData---------ProfileInfoEdit", profileData);
  // }

  const handleCreateVenueForm = () => {
    setIsVenueFormShown(!isVenueFormShown);
  };

  console.log(isVenueFormShown);

  const isValidUrl = (string) => {
    try {
      new URL(string);
    } catch (_) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // const { type, checked } = event.target;
    const avatarUrl = event.target.elements["avatar.url"].value;
    const bannerUrl = event.target.elements["banner.url"].value;

    if (!isValidUrl(avatarUrl) || !isValidUrl(bannerUrl)) {
      console.error("Image URL must be valid URL");
      return;
    }

    const updatedFormState = {
      ...formState,
      bio: event.target.elements.bio.value,
      avatar: {
        url: event.target.elements["avatar.url"].value,
        alt: event.target.elements["avatar.alt"].value,
      },
      banner: {
        url: event.target.elements["banner.url"].value,
        alt: event.target.elements["banner.alt"].value,
      },
      venueManager: event.target.querySelector('input[name="venueManager"]').checked,
    };
    console.log("Form submitted:", updatedFormState);
    setFormState(updatedFormState);

    try {
      const response = await fetch(API_PROFILES + "/" + profileData.name, {
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

  return (
    <div>
      <button className="btnStyle" onClick={handleCreateVenueForm}>
        Edit Profile
      </button>
      {isVenueFormShown && (
        <div>
          <h2>Create A Venue</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">User bio</label>
              <input type="text" name="bio" placeholder="User bio" minLength={3} aria-label="User bio" defaultValue={profileData.bio} />
            </div>
            <div>
              <label htmlFor="avatar.url">Venue avatar url</label>
              <input
                type="text"
                name="avatar.url"
                placeholder="User avatar url"
                minLength={3}
                aria-label="User avatar url"
                defaultValue={profileData.avatar.url}
              />
            </div>
            <div>
              <label htmlFor="avatar.alt">Venue avatar alternative text</label>
              <input
                type="text"
                name="avatar.alt"
                placeholder="User avatar alternative text"
                minLength={3}
                aria-label="User avatar alternative text"
                defaultValue={profileData.avatar.alt}
              />
            </div>
            <div>
              <label htmlFor="banner.url">Profile banner url</label>
              <input
                type="text"
                name="banner.url"
                placeholder="Profile banner url"
                minLength={3}
                aria-label="Profile banner url"
                defaultValue={profileData.banner.url}
              />
            </div>
            <div>
              <label htmlFor="banner.alt">Profile banner alternative text</label>
              <input
                type="text"
                name="banner.alt"
                placeholder="Profile banner alternative text"
                minLength={3}
                aria-label="Profile banner alternative text"
                defaultValue={profileData.banner.alt}
              />
            </div>
            <div>
              <label htmlFor="venueManager">Venue Manager</label>
              <input
                type="checkbox"
                name="venueManager"
                // placeholder="Venue Manager"
                aria-label="Venue Manager"
                defaultChecked={profileData.venueManager}
              />
            </div>
            <button type="submit" className="btnStyle">
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ProfileInfoEdit;
