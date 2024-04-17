import { useState } from "react";

function LoginPage() {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateEmail = (email) => {
    const emailRegex = /\S+@\S+\.\S+/;
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
            <textarea
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
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
