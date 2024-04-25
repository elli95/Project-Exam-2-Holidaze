import { create } from "zustand";
import { API_VENUES, API_REGISTER_URL } from "../shared/apis";
// import useLocalStorage from "../hooks/useLocalStorage";

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
  // fetchProfile: async () => {
  //   const accessToken = useLocalStorage();
  //   try {
  //     const response = await fetch(API_PROFILES, {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });
  //     const data = await response.json();
  //     console.log("profile", data);
  //     return data;
  //   } catch (error) {
  //     console.error("Error fetching profiles:", error);
  //     throw error;
  //   }
  // },
}));

export default useVenues;

// fetchProfile: async () => {
//   const response = await fetch(API_PROFILES);
//   const json = await response.json();
//   set((state) => ({ ...state, venues: json.data }));
// },
