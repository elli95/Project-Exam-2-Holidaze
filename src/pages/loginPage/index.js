import { useState } from "react";
import { API_LOGIN_URL } from "../../shared/apis";

console.log("123123123@stud.noroff.no or robinTest@stud.noroff.no");

function LoginPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordInput = password.length > 0;
    return passwordInput;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    const newErrors = { ...errors };

    switch (name) {
      case "password":
        newErrors.password = validatePassword(value) ? "" : `Please enter a valid password`;
        break;
      case "email":
        newErrors.email = validateEmail(value) ? "" : "Please enter a valid email";
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isValidForm = Object.values(errors).every((error) => !error);
    if (isValidForm) {
      console.log("Form submitted:", formState);
      try {
        const response = await fetch(API_LOGIN_URL, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formState),
        });

        const data = await response.json();

        if (!response.ok) {
          console.log("error", data.errors[0].message);
          setErrorMessage(data.errors[0].message);
        } else {
          const apiData = data.data;
          const { accessToken, ...userProfile } = apiData;

          localStorage.setItem("token", accessToken);
          localStorage.setItem("profile", JSON.stringify(userProfile));

          console.log("Form submitted localStorage:", localStorage);
          window.location.href = "/";
        }

        // if (!response.ok) {
        //   console.log("error2", data.errors[0].message);
        //   // console.log("error", response);
        //   // throw new Error(response.status);
        // } else {
        //   console.log("User registered successfully!");
        //   // window.location.href = "/";
        // }
      } catch (error) {
        console.error("Error during login:", error);
      }
    } else {
      console.log("This form has errors. Please correct them.");
    }
  };

  return (
    <div className="loginForm">
      <div className="loginFormContainer">
        <h1>Contact form:</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              value={formState.email}
              placeholder="Your Email"
              onChange={handleInputChange}
              onBlur={handleBlur}
              aria-label="Email"
              required
            />
            <span className="error">{errors.email}</span>
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={formState.password}
              placeholder="Password"
              onChange={handleInputChange}
              onBlur={handleBlur}
              aria-label="Password"
              required
            />
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
