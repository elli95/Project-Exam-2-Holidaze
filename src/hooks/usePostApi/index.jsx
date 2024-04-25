import { useState } from "react";
import { API_REGISTER_URL } from "../../shared/apis";

async function useApiPost(formData) {
  const [errorMessage, setErrorMessage] = useState("");

  try {
    const response = await fetch(API_REGISTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      setErrorMessage("There was an error: " + data.errors[0].message);
      throw new Error(response.status);
    } else {
      // Handle success (e.g., show a success message)
      console.log("User registered successfully!");
    }
  } catch (error) {
    console.error("Error during registration:", error);
  }

  return <div></div>;
}

export default useApiPost;
