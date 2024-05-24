import { useState } from "react";
import { API_REGISTER_URL } from "../../shared/apis";
import useApiCall from "../../hooks/useApiCall";
import useVenues from "../../store/venueLocations";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";

function RegistrationPage() {
  const { validateField } = useVenues();
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [shown, setShown] = useState(false);
  const type = shown ? "text" : "password";
  const buttonText = shown ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />;

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    bio: "",
    avatar: {
      url: "",
      alt: "",
    },
    banner: {
      url: "",
      alt: "",
    },
    password: "",
    venueManager: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    bio: "",
    avatar: {
      url: "",
    },
    banner: {
      url: "",
    },
    password: "",
  });

  const apiCall = useApiCall();

  const handleBlur = (event) => {
    const { name, value } = event.target;
    const newErrors = { ...errors };

    switch (name) {
      case "name":
      case "bio":
        newErrors[name] = validateField(value, "inputLength") ? "" : "You must enter at least 1 characters";
        break;
      case "password":
        newErrors.password = validateField(value, "inputLengthPassword")
          ? ""
          : "Password must consist of minimum 8 characters and only use a-Z, 0-9, and _";
        break;
      case "email":
        newErrors.email = validateField(value, "email") ? "" : `Please enter a valid email ending with "@stud.noroff.no"`;
        break;
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("This form Please correct them.");
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
      name: event.target.elements.name.value,
      email: event.target.elements.email.value,
      bio: event.target.elements.bio.value,
      avatar: {
        url: avatarUrl,
        alt: avatarAlt,
      },
      banner: {
        url: bannerUrl,
        alt: bannerAlt,
      },
      password: event.target.elements.password.value,
      venueManager: event.target.querySelector('input[name="venueManager"]').checked,
    };
    setFormState(updatedFormState);

    console.log("This form Please correct them11111.");
    // const isValidForm = Object.values(errors).every((error) => !error);
    // if (isValidForm) {
    console.log("This form Please correct them33333.");
    console.log("Form submitted:", formState);
    console.log("Form submitted:", updatedFormState);

    apiCall(
      API_REGISTER_URL,
      "POST",
      {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      updatedFormState
    )
      .then((data) => {
        if (data.errors) {
          setErrorMessage(data.errors[0].message);
        } else {
          setSuccessMessage(true);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  return (
    <div className="registrationForm">
      <div className="registrationFormContainer formStyle justify-center items-center min-w-80 sm:w-box610 lg:w-box700">
        <h1 className="text-3xl font-semibold py-2">Registration</h1>
        <form onSubmit={handleSubmit} className="py-2.5">
          <div className="w-72 sm:w-form500">
            <label htmlFor="name">Full name</label>
            <input
              type="text"
              name="name"
              placeholder="Your full name"
              onBlur={handleBlur}
              minLength={1}
              maxLength={20}
              aria-label="Full Name"
              className="bg-greyBlur w-box280 sm:w-box490"
              required
            />
            <span className="error">{errors.name}</span>
          </div>
          <div className="w-72 sm:w-form500">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              placeholder="Your Email"
              onBlur={handleBlur}
              aria-label="Email"
              className="bg-greyBlur w-box280 sm:w-box490"
              required
            />
            <span className="error">{errors.email}</span>
          </div>
          <div className="w-72 sm:w-form500">
            <label htmlFor="bio">Bio</label>
            <textarea
              type="text"
              name="bio"
              placeholder="Bio description"
              onBlur={handleBlur}
              minLength={3}
              maxLength={160}
              aria-label="Bio"
              className="bg-greyBlur w-box280 h-36 sm:h-24 sm:w-box490"
              required
            />
            <span className="error">{errors.bio}</span>
          </div>
          <div className="w-72 sm:w-form500">
            <label htmlFor="avatar.url">Venue avatar url</label>
            <input
              type="text"
              name="avatar.url"
              placeholder="User avatar url"
              onBlur={handleBlur}
              aria-label="User avatar url"
              className="bg-greyBlur w-box280 sm:w-box490"
            />
            <span className="error">{errors.avatar.url}</span>
          </div>
          <div className="w-72 sm:w-form500">
            <label htmlFor="avatar.alt">Venue avatar alternative text</label>
            <input
              type="text"
              name="avatar.alt"
              placeholder="User avatar alternative text"
              minLength={3}
              aria-label="User avatar alternative text"
              className="bg-greyBlur w-box280 sm:w-box490"
            />
          </div>
          <div className="w-72 sm:w-form500">
            <label htmlFor="banner.url">Profile banner url</label>
            <input
              type="text"
              name="banner.url"
              placeholder="Profile banner url"
              onBlur={handleBlur}
              aria-label="Profile banner url"
              className="bg-greyBlur w-box280 sm:w-box490"
            />
            <span className="error">{errors.banner.url}</span>
          </div>
          <div className="w-72 sm:w-form500">
            <label htmlFor="banner.alt">Profile banner alternative text</label>
            <input
              type="text"
              name="banner.alt"
              placeholder="Profile banner alternative text"
              minLength={3}
              aria-label="Profile banner alternative text"
              className="bg-greyBlur w-box280 sm:w-box490"
            />
          </div>
          <div className="w-72 sm:w-form500">
            <label htmlFor="password">Password</label>
            <div className="PasswordInput">
              <input
                type={type}
                name="password"
                placeholder="Password content"
                minLength={8}
                onBlur={handleBlur}
                aria-label="Password"
                className="bg-greyBlur"
                required
              />
              <button type="button" className="w-7 text-xl" onClick={() => setShown(!shown)}>
                {buttonText}
              </button>
            </div>
            <span className="error">{errors.password}</span>
          </div>
          <div className="checkboxStyle">
            <label htmlFor="venueManager">Venue manager</label>
            <input type="hidden" name="venueManager" value="0" />
            <input type="checkbox" name="venueManager" />
          </div>
          <button type="submit" className="btnStyle w-32">
            Submit
          </button>
          {successMessage && (
            <div className="items-center p-3.5">
              <h2>Your user is registered</h2>
              <Link to="/login">
                <h2 className="hover:underline">you can now login on the login page.</h2>
              </Link>
            </div>
          )}
          {errorMessage && <span className="error self-center">{errorMessage}</span>}
        </form>
        <div className="items-center p-3.5">
          <h2>Already have a user?</h2>
          <Link to="/login">
            <h2 className="hover:underline">Login today!</h2>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;
