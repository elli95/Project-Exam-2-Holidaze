import { useState } from "react";
import { API_REGISTER_URL } from "../../shared/apis";
import useApiCall from "../../hooks/useApiCall";
import useVenues from "../../store/venueLocations";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";

/**
 * RegistrationPage component renders a registration form for users to sign up.
 * It includes input fields for name, email, avatar URL, password, and a checkbox for venue manager.
 * Upon successful registration, it displays a success message and a link to the login page.
 *
 * @component
 * @returns {JSX.Element} The rendered registration form component.
 */

function RegistrationPage() {
  const { validateField } = useVenues();
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [shown, setShown] = useState(false);
  const type = shown ? "text" : "password";
  const buttonText = shown ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />;
  const buttonAriaLabel = shown ? "Hide password" : "Show password";

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    avatar: {
      url: "",
      alt: "",
    },
    password: "",
    venueManager: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    avatar: {
      url: "",
    },
    password: "",
  });

  const apiCall = useApiCall();

  /**
   * Handles input blur events and validates the input fields.
   * Updates the errors state based on validation results.
   *
   * @param {Event} event - The blur event object.
   */
  const handleBlur = (event) => {
    const { name, value } = event.target;
    const newErrors = { ...errors };

    switch (name) {
      case "name":
        newErrors[name] = validateField(value, "inputLength") ? "" : "Please enter a name";
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
      case "avatar.alt":
        newErrors.avatar.alt = validateField(value, "minInputLength") ? "" : "Please enter alternative text";
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  /**
   * Handles form submission events.
   * Performs form data validation and sends a POST request to register the user.
   * Displays success or error messages based on the registration outcome.
   *
   * @param {Event} event - The form submission event object.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("This form Please correct them.");
    let avatarUrl = event.target.elements["avatar.url"].value;
    let avatarAlt = event.target.elements["avatar.alt"].value;
    if (!avatarUrl) {
      avatarUrl = "https://images.unsplash.com/photo-1579547945413-497e1b99dac0";
    }
    if (!avatarAlt) {
      avatarAlt = "Profile Avatar";
    }

    const updatedFormState = {
      ...formState,
      name: event.target.elements.name.value,
      email: event.target.elements.email.value,
      avatar: {
        url: avatarUrl,
        alt: avatarAlt,
      },
      password: event.target.elements.password.value,
      venueManager: event.target.querySelector('input[name="venueManager"]').checked,
    };
    setFormState(updatedFormState);

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
    <div className="mainDiv imgCover regImg mt-16 py-10 lg:m-0">
      <div className="registrationForm">
        <div className="registrationFormContainer formStyle justify-center items-center min-w-80 sm:w-box610 lg:w-box700">
          <h1 className="text-3xl font-semibold py-2">Registration</h1>
          <form onSubmit={handleSubmit} className="py-2.5">
            <div className="w-72 sm:w-form500">
              <label htmlFor="name" for="name" className="text-xl">
                Full name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your full name"
                onBlur={handleBlur}
                minLength={1}
                maxLength={20}
                aria-label="Full Name"
                className="text-lg bg-greyBlur w-box280 sm:w-box490"
                required
              />
              <span className="error">{errors.name}</span>
            </div>
            <div className="w-72 sm:w-form500">
              <label htmlFor="email" for="email" className="text-xl">
                Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                placeholder="Your Email"
                onBlur={handleBlur}
                aria-label="Email"
                className="text-lg bg-greyBlur w-box280 sm:w-box490"
                required
              />
              <span className="error">{errors.email}</span>
            </div>
            <div className="w-72 sm:w-form500">
              <label htmlFor="avatar.url" for="avatar.url" className="text-xl">
                Avatar url
              </label>
              <input
                type="text"
                id="avatar.url"
                name="avatar.url"
                placeholder="User avatar url"
                onBlur={handleBlur}
                aria-label="User avatar url"
                className="text-lg bg-greyBlur w-box280 sm:w-box490"
              />
              <span className="error">{errors.avatar.url}</span>
            </div>
            <div className="w-72 sm:w-form500">
              <label htmlFor="avatar.alt" for="avatar.alt" className="text-xl">
                Avatar alternative text
              </label>
              <input
                type="text"
                id="avatar.alt"
                name="avatar.alt"
                placeholder="User avatar alternative text"
                minLength={3}
                aria-label="User avatar alternative text"
                className="text-lg bg-greyBlur w-box280 sm:w-box490"
              />
            </div>
            <div className="w-72 sm:w-form500">
              <label htmlFor="password" for="password" className="text-xl">
                Password
              </label>
              <div className="PasswordInput">
                <input
                  type={type}
                  id="password"
                  name="password"
                  placeholder="Password content"
                  minLength={8}
                  onBlur={handleBlur}
                  aria-label="Password"
                  className="text-lg bg-greyBlur"
                  required
                />
                <button type="button" className="w-7 text-xl" onClick={() => setShown(!shown)} aria-label={buttonAriaLabel}>
                  {buttonText}
                </button>
              </div>
              <span className="error">{errors.password}</span>
            </div>
            <div className="checkboxStyle">
              <label htmlFor="venueManager" for="venueManager" className="text-xl">
                Venue manager
              </label>
              <input type="hidden" name="venueManager" value="0" />
              <input type="checkbox" id="venueManager" name="venueManager" className="text-xl" />
            </div>
            <button type="submit" className="btnStyle text-xl w-32">
              Submit
            </button>
            {successMessage && (
              <div className="items-center text-xl p-3.5">
                <h2>Your user is registered</h2>
                <Link to="/login">
                  <h2 className="hover:underline">you can now login on the login page.</h2>
                </Link>
              </div>
            )}
            {errorMessage && <span className="error text-xl self-center">{errorMessage}</span>}
          </form>
          <div className="items-center text-xl p-3.5">
            <h2>Already have a user?</h2>
            <Link to="/login">
              <h2 className="hover:underline">Login today!</h2>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;
