import { useState } from "react";
import { API_LOGIN_URL } from "../../shared/apis";
import useApiCall from "../../hooks/useApiCall";
import useVenues from "../../store/venueLocations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

console.log("123123123@stud.noroff.no or robinTest@stud.noroff.no or robin@stud.noroff.no");

function LoginPage() {
  const { validateField } = useVenues();
  const [errorMessage, setErrorMessage] = useState("");

  const [shown, setShown] = useState(false);
  const type = shown ? "text" : "password";
  const buttonText = shown ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />;

  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const apiCall = useApiCall();

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const updatedFormState = {
      ...formState,
      email: event.target.elements.email.value,
      password: event.target.elements.password.value,
    };
    setFormState(updatedFormState);
    // const isValidForm = Object.values(errors).every((error) => !error);
    // if (isValidForm) {
    //   console.log("Form submitted:", formState);

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
          console.log("data", data);
          window.location.href = "/profilePage";
        } else {
          setErrorMessage(data.errors[0].message);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  return (
    <div className="loginForm">
      <div className="loginFormContainer formStyle justify-center items-center min-w-80 min-h-96 sm:w-box610 lg:w-box700">
        <h1 className="text-3xl font-semibold pt-2">Login</h1>
        <form onSubmit={handleSubmit} className="py-2.5">
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
            <label htmlFor="password">Password</label>
            <div className="PasswordInput">
              <input
                type={type}
                name="password"
                placeholder="Password"
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
          <button type="submit" className="btnStyle w-32">
            Submit
          </button>
          {errorMessage && <span className="error self-center">{errorMessage}</span>}
        </form>
        <div className="items-center p-3.5">
          <h2>Don't have a user?</h2>
          <Link to="/registration">
            <h2 className="hover:underline">Register a one today!</h2>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
