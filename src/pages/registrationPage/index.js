import { useState } from "react";
// import useApiPost from "../../hooks/usePostApi";
import { API_REGISTER_URL } from "../../shared/apis";

function RegistrationPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    bio: "",
    // avatar: "",
    password: "",
    venueManager: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    bio: "",
    // avatar: "",
    password: "",
  });

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/;
    return emailRegex.test(email);
  };

  const validateInputLength = (textValue) => {
    const inputLength = textValue.length >= 3;
    return inputLength;
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === "text") {
      setFormState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else if (type === "checkbox") {
      setFormState((prevState) => ({
        ...prevState,
        [name]: checked,
      }));
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    const newErrors = { ...errors };

    switch (name) {
      case "name":
      case "bio":
      case "password":
        newErrors[name] = validateInputLength(value) ? "" : `You must enter at least 3 characters`;
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
      // useApiPost(formState);
      try {
        const response = await fetch(API_REGISTER_URL, {
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
          console.log("User registered successfully!");
        }

        console.log("Form submitted:", data);
      } catch (error) {
        console.error("Error during registration:", error);
      }
    } else {
      console.log("This form has errors. Please correct them.");
    }
  };

  return (
    <div className="registrationForm">
      <div className="registrationFormContainer">
        <h1>Contact form:</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Full name</label>
            <input
              type="text"
              name="name"
              value={formState.name}
              placeholder="Your full name"
              onChange={handleInputChange}
              onBlur={handleBlur}
              minLength={3}
              aria-label="Full Name"
              required
            />
            <span className="error">{errors.name}</span>
          </div>
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
            <label htmlFor="bio">Bio</label>
            <input
              type="text"
              name="bio"
              value={formState.bio}
              placeholder="Bio description"
              onChange={handleInputChange}
              onBlur={handleBlur}
              minLength={3}
              aria-label="Bio"
              required
            />
            <span className="error">{errors.bio}</span>
          </div>
          {/* <div>
            <label htmlFor="avatar">Avatar</label>
            <input
              type="text"
              name="avatar"
              value={formState.avatar}
              placeholder="Avatar content"
              onChange={handleInputChange}
              minLength={3}
              onBlur={handleBlur}
              aria-label="Avatar"
              required
            />
            <span className="error">{errors.avatar}</span>
          </div> */}
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="text"
              name="password"
              value={formState.password}
              placeholder="Password content"
              onChange={handleInputChange}
              minLength={3}
              onBlur={handleBlur}
              aria-label="Password"
              required
            />
            <span className="error">{errors.password}</span>
          </div>
          <div className="flex flex-row">
            <label htmlFor="venueManager">Venue manager</label>
            <input type="hidden" name="venueManager" value="0" />
            <input type="checkbox" name="venueManager" onChange={handleInputChange} />
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

export default RegistrationPage;
