import { create } from "zustand";
import { API_VENUES, API_REGISTER_URL } from "../shared/apis";
// import useApiCall from "../hooks/useApiCall";

const useVenues = create((set) => ({
  venues: [],
  fetchVenues: async () => {
    const response = await fetch(API_VENUES + "?_bookings=true&_owner=true");
    const json = await response.json();
    set((state) => ({ ...state, venues: json.data }));
  },
  registerUser: async () => {
    const response = await fetch(API_REGISTER_URL);
    const json = await response.json();
    console.log("register", json);
  },
  // fetchUserProfiles: () => {
  //   const { apiKey } = usePostApiKey();
  //   const { accessToken, userInfo } = useLocalStorage();
  //   const [venueBookingData, setVenueBookingData] = useState([]);
  //   useApiCall(API_PROFILES + "/" + userInfo.name + "/?_bookings=true&_venues=true", "GET", {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${accessToken}`,
  //     "X-Noroff-API-Key": apiKey.key,
  //   })
  //     .then((data) => setVenueBookingData(data.data))
  //     .catch((error) => console.error("Error fetching data:", error));
  // },
  validateField: (value, rule) => {
    switch (rule) {
      case "email":
        return /^[a-zA-Z0-9._%+-]+@stud\.noroff\.no$/.test(value);
      case "imgUrl":
        return (
          value === "" || /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?/.test(value)
        );
      case "inputLength":
        return value.length >= 1 && value.length <= 20;
      case "inputLengthPassword":
        const validCharacters = /^[A-Za-z0-9_]+$/;
        return value.length >= 8 && validCharacters.test(value);
      case "date":
        const date = new Date(value);
        return !isNaN(date.getTime());
      // return !isNaN(Date.parse(value));
      case "numbersOnly":
        return /^\d+$/.test(value);
      default:
        return true;
    }
  },
}));

export default useVenues;
