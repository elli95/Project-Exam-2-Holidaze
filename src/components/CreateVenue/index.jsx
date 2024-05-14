import { useState } from "react";
import { API_VENUES } from "../../shared/apis";
import useLocalStorage from "../../hooks/useLocalStorage";
import usePostApiKey from "../../hooks/usePostApiKey";

function CreateVenue() {
  const { apiKey } = usePostApiKey();
  const { accessToken } = useLocalStorage();
  // console.log(accessToken, apiKey);
  const [isVenueFormShown, setIsVenueFormShown] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    media: [
      {
        url: "",
        alt: "",
      },
    ],
    price: "",
    maxGuests: "",
    rating: "",
    meta: {
      wifi: false,
      parking: false,
      breakfast: false,
      pets: false,
    },
    location: {
      address: "",
      city: "",
      zip: "",
      country: "",
      continent: "",
      lat: "",
      lng: "",
    },
  });

  const handleCreateVenueForm = () => {
    setIsVenueFormShown(!isVenueFormShown);
  };

  const handleAddImage = () => {
    setFormState({
      ...formState,
      media: [...formState.media, { url: "", alt: "" }],
    });
  };

  const handleRemoveImage = (index) => {
    if (formState.media.length > 1) {
      const newMedia = [...formState.media];
      newMedia.splice(index, 1);
      setFormState({ ...formState, media: newMedia });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const media = [];
    for (let element of event.target.elements) {
      if (element.name.startsWith("media.url.")) {
        const index = parseInt(element.name.replace("media.url.", ""), 10);
        if (!media[index]) {
          media[index] = { url: "", alt: "" };
        }
        media[index].url = element.value;
      } else if (element.name.startsWith("media.alt.")) {
        const index = parseInt(element.name.replace("media.alt.", ""), 10);
        if (!media[index]) {
          media[index] = { url: "", alt: "" };
        }
        media[index].alt = element.value;
      }
    }

    const updatedFormState = {
      ...formState,
      name: event.target.elements.name.value,
      description: event.target.elements.description.value,
      media,
      // media: [
      //   {
      //     url: event.target.elements["media.url"].value,
      //     alt: event.target.elements["media.alt"].value,
      //   },
      // ],
      price: Number(event.target.elements.price.value),
      maxGuests: Number(event.target.elements.maxGuests.value),
      rating: Number(event.target.elements.rating.value),
      meta: {
        wifi: event.target.querySelector('input[name="meta.wifi"]').checked,
        parking: event.target.querySelector('input[name="meta.parking"]').checked,
        breakfast: event.target.querySelector('input[name="meta.breakfast"]').checked,
        pets: event.target.querySelector('input[name="meta.pets"]').checked,
      },
      location: {
        address: event.target.elements["location.address"].value,
        city: event.target.elements["location.city"].value,
        zip: event.target.elements["location.zip"].value,
        country: event.target.elements["location.country"].value,
        continent: event.target.elements["location.continent"].value,
        lat: Number(event.target.elements["location.lat"].value),
        lng: Number(event.target.elements["location.lng"].value),
      },
    };
    console.log("Venue form submitted:", updatedFormState);
    setFormState(updatedFormState);
    try {
      const response = await fetch(API_VENUES, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": apiKey.key,
        },
        body: JSON.stringify(updatedFormState),
      });

      const data = await response.json();
      if (!response.ok) {
        console.log("error", data.errors[0].message);
      } else {
        console.log("User registered successfully!");
      }

      console.log("Form submitted:", data);
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <div>
      <button className="btnStyle" onClick={handleCreateVenueForm}>
        Create new Venue
      </button>
      {isVenueFormShown && (
        <div>
          <h2>Create A Venue</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Venue name</label>
              <input type="text" name="name" placeholder="Venue name" minLength={3} aria-label="Venue Name" required />
            </div>
            <div>
              <label htmlFor="Venue description">Venue description</label>
              <input type="text" name="description" placeholder="Venue description" minLength={3} aria-label="Venue description" required />
            </div>
            {formState.media.map((mediaItem, index) => (
              <div key={index}>
                <label htmlFor={`media.url.${index}`}>Venue media url</label>
                <input
                  type="text"
                  name={`media.url.${index}`}
                  placeholder="User media url"
                  minLength={3}
                  aria-label="User media url"
                  defaultValue="https://images.unsplash.com/photo-1579547945413-497e1b99dac0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=400&w=400"
                />
                <label htmlFor={`media.alt.${index}`}>Venue media alt</label>
                <input
                  type="text"
                  name={`media.alt.${index}`}
                  placeholder="User media alt"
                  minLength={3}
                  aria-label="User media alt"
                  defaultValue={"Venue image"}
                />
                <button type="button" className="btnStyle" onClick={() => handleRemoveImage(index)}>
                  Remove
                </button>
              </div>
            ))}
            <button type="button" className="btnStyle" onClick={handleAddImage}>
              Add Image
            </button>
            {/* <div>
              <label htmlFor="media.url">Venue media url</label>
              <input
                type="text"
                name="media.url"
                placeholder="User media url"
                minLength={3}
                aria-label="User media url"
                defaultValue="https://images.unsplash.com/photo-1579547945413-497e1b99dac0?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=80&h=400&w=400"
              />
            </div>
            <div>
              <label htmlFor="media.alt">Venue media alternative text</label>
              <input type="text" name="media.alt" placeholder="User media alternative text" minLength={3} aria-label="User media alternative text" />
            </div> */}
            <div>
              <label htmlFor="price">Venue price</label>
              <input type="number" name="price" placeholder="Venue price" aria-label="Venue price" required />
            </div>
            <div className="flex flex-row">
              <label htmlFor="maxGuests">Max guests</label>
              <input type="number" name="maxGuests" min={1} max={100} aria-label="Max guests" required />
            </div>
            <div className="flex flex-row">
              <label htmlFor="rating">Venue rating</label>
              <input type="number" name="rating" aria-label="Venue rating" />
            </div>
            <h2>Amenities</h2>
            <div>
              <label htmlFor="meta.wifi">Wifi availability</label>
              <input type="checkbox" name="meta.wifi" aria-label="Wifi availability" />
            </div>
            <div>
              <label htmlFor="meta.parking">Parking availability</label>
              <input type="checkbox" name="meta.parking" aria-label="Parking availability" />
            </div>
            <div>
              <label htmlFor="meta.breakfast">Breakfast availability</label>
              <input type="checkbox" name="meta.breakfast" aria-label="Breakfast availability" />
            </div>
            <div>
              <label htmlFor="meta.pets">Pets availability</label>
              <input type="checkbox" name="meta.pets" aria-label="Pets availability" />
            </div>
            <h2>Venue location</h2>
            <div>
              <label htmlFor="location.address">Venue address</label>
              <input type="text" name="location.address" placeholder="Venue address" minLength={3} aria-label="Venue address" />
            </div>
            <div>
              <label htmlFor="location.city">Venue city</label>
              <input type="text" name="location.city" placeholder="Venue city" minLength={3} aria-label="Venue city" />
            </div>
            <div>
              <label htmlFor="location.zip">Venue zip</label>
              <input type="number" name="location.zip" placeholder="Venue zip" minLength={3} aria-label="Venue zip" />
            </div>
            <div>
              <label htmlFor="location.country">Venue country</label>
              <input type="text" name="location.country" placeholder="Venue country" minLength={3} aria-label="Venue country" />
            </div>
            <div>
              <label htmlFor="location.continent">Venue continent</label>
              <input type="text" name="location.continent" placeholder="Venue continent" minLength={3} aria-label="Venue continent" />
            </div>
            <div>
              <label htmlFor="location.lat">Venue latitude</label>
              <input type="number" name="location.lat" placeholder="Venue latitude" min={-90} max={90} aria-label="Venue latitude" />
            </div>
            <div>
              <label htmlFor="location.lng">Venue longitude </label>
              <input type="number" name="location.lng" placeholder="Venue longitude" min={-90} max={90} aria-label="Venue longitude" />
            </div>
            <button type="submit" className="btnStyle">
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default CreateVenue;

// const handleInputChange = (event) => {
//   const { name, value, type, checked } = event.target;
//   if (type === "checkbox" && name.startsWith("meta.")) {
//     const metaProperty = name.substring(5);
//     setFormState((prevState) => ({
//       ...prevState,
//       meta: {
//         ...prevState.meta,
//         [metaProperty]: checked,
//       },
//     }));
//   } else if (type === "text" || type === "number") {
//     const [parentName, childName] = name.split(".");
//     if (parentName === "media" || parentName === "location") {
//       setFormState((prevState) => ({
//         ...prevState,
//         [parentName]: {
//           ...prevState[parentName],
//           [childName]: value,
//         },
//       }));
//     } else {
//       setFormState((prevState) => ({
//         ...prevState,
//         [name]: value,
//       }));
//     }
//   }
// };
