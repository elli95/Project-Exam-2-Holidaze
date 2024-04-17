import { useState } from "react";

function RegistrationPage() {
  const [formState, setFormState] = useState({
    fullName: "",
    email: "",
    bio: "",
    avatar: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    bio: "",
    avatar: "",
  });

  const validateEmail = (email) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };

  const validateInputLength = (textValue) => {
    const inputLength = textValue.length >= 3;
    return inputLength;
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
      case "fullName":
      case "bio":
      case "avatar":
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

  const handleSubmit = (event) => {
    event.preventDefault();
    const isValidForm = Object.values(errors).every((error) => !error);
    if (isValidForm) {
      console.log("Form submitted:", formState);
    } else {
      console.log("This form has errors. Please correct them.");
    }
  };

  return (
    <div className="contactForm">
      <div className="contactFormContainer">
        <h1>Contact form:</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="fullName">Full name</label>
            <input
              type="text"
              name="fullName"
              value={formState.fullName}
              placeholder="Your full name"
              onChange={handleInputChange}
              onBlur={handleBlur}
              minLength={3}
              aria-label="Full Name"
              required
            />
            <span className="error">{errors.fullName}</span>
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
          <div>
            <label htmlFor="avatar">Avatar</label>
            <textarea
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
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default RegistrationPage;
