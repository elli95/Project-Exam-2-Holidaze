import { useState } from "react";
import { API_LOGIN_URL } from "../../shared/apis";
import useApiCall from "../../hooks/useApiCall";
import useVenues from "../../store/venueLocations";

console.log("123123123@stud.noroff.no or robinTest@stud.noroff.no or robin@stud.noroff.no");

function LoginPage() {
  const { validateField } = useVenues();
  const [errorMessage, setErrorMessage] = useState("");

  const [shown, setShown] = useState(false);
  const type = shown ? "text" : "password";
  const buttonText = shown ? "Hide password" : "Show Password";

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
      <div className="loginFormContainer">
        <h1>Contact form:</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input type="text" name="email" placeholder="Your Email" onBlur={handleBlur} aria-label="Email" required />
            <span className="error">{errors.email}</span>
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input type={type} name="password" placeholder="Password" minLength={8} onBlur={handleBlur} aria-label="Password" required />
            <button type="button" onClick={() => setShown(!shown)}>
              {buttonText}
            </button>
            <span className="error">{errors.password}</span>
          </div>
          <button type="submit" className="btnStyle">
            Submit
          </button>
          {errorMessage && <span className="error">{errorMessage}</span>}
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
