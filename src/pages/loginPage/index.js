import { useState } from "react";
import { API_LOGIN_URL } from "../../shared/apis";
import useApiCall from "../../hooks/useApiCall";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import useValidation from "../../util/useValidation";

/**
 * LoginPage component handles user login functionality.
 * It allows users to input their email and password,
 * validate the input fields, and submit the login form.
 * Upon successful login, it redirects the user to the profile page.
 * @returns {JSX.Element} LoginPage component
 */

function LoginPage() {
  const { validateField } = useValidation();
  const [errorMessage, setErrorMessage] = useState("");

  const [shown, setShown] = useState(false);
  const type = shown ? "text" : "password";
  const buttonText = shown ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />;
  const buttonAriaLabel = shown ? "Hide password" : "Show password";

  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const apiCall = useApiCall();

  /**
   * Handles onBlur event for form input fields.
   * Validates the input value based on the field name.
   * Updates the error state if validation fails.
   * @param {Event} event - The onBlur event object
   */
  const handleBlur = (event) => {
    const { name, value } = event.target;
    const newErrors = { ...errors };

    switch (name) {
      case "email":
        newErrors.email = validateField(value, "email") ? "" : `Please enter a valid email ending with "@stud.noroff.no"`;
        break;
      case "password":
        newErrors.password = validateField(value, "inputLengthPassword")
          ? ""
          : `Please enter a valid password, consist of minimum 8 characters and and only use a-Z, 0-9, and _`;
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  /**
   * Handles form submission event.
   * Sends a POST request to the login API endpoint with user credentials.
   * If login is successful, it stores the access token and user profile data in localStorage.
   * Redirects the user to the profile page.
   * If login fails, sets the error message state.
   * @param {Event} event - The form submission event object
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    const updatedFormState = {
      ...formState,
      email: event.target.elements.email.value,
      password: event.target.elements.password.value,
    };
    setFormState(updatedFormState);

    apiCall(
      API_LOGIN_URL,
      "POST",
      {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      updatedFormState
    )
      .then((data) => {
        if (!data.errors) {
          const { accessToken, ...userProfile } = data.data;
          localStorage.setItem("token", accessToken);
          localStorage.setItem("profile", JSON.stringify(userProfile));
          window.location.href = "/profilePage";
        } else {
          setErrorMessage(data.errors[0].message);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  return (
    <div className="mainDiv imgCover logImg">
      <div className="loginForm">
        <div className="loginFormContainer formStyle justify-center items-center min-w-80 min-h-96 sm:w-box610 lg:w-box700">
          <h1 className="text-3xl font-semibold pt-2">Login</h1>
          <form onSubmit={handleSubmit} className="py-2.5">
            <div className="w-72 sm:w-form500">
              <label htmlFor="email" className="text-xl">
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
              <span className="error text-lg">{errors.email}</span>
            </div>
            <div className="w-72 sm:w-form500">
              <label htmlFor="password" className="text-xl">
                Password
              </label>
              <div className="PasswordInput">
                <input
                  type={type}
                  id="password"
                  name="password"
                  placeholder="Password"
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
              <span className="error text-lg">{errors.password}</span>
            </div>
            <button type="submit" className="btnStyle text-xl w-32">
              Submit
            </button>
            {errorMessage && <span className="error text-xl self-center">{errorMessage}</span>}
          </form>
          <div className="items-center text-xl p-3.5">
            <h2>Don't have a user?</h2>
            <Link to="/registration">
              <h2 className="hover:underline">Register a one today!</h2>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
