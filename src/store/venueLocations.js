import { create } from "zustand";
import { API_VENUES } from "../shared/apis";

const useVenues = create((set) => ({
  venues: [],
  fetchVenues: async () => {
    const response = await fetch(API_VENUES);
    const json = await response.json();
    set((state) => ({ ...state, venues: json.data }));
  },
}));

export default useVenues;
