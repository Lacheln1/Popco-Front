import { PostFilterRequest } from "@/types/Search.types";
import { create } from "zustand";

interface FilterStore {
  contentType?: undefined;
  filter: PostFilterRequest;
  setFilter: (val: PostFilterRequest) => void;
  resetFilter: () => void;
  isTouched: boolean;
  markTouched: () => void;
  resetTouched: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  filter: {
    contentType: undefined,
    genres: [],
    platforms: [],
    personaFilter: {},
    popcorithmFilter: {},
    ageGroupFilter: {},
  },
  isTouched: false,
  setFilter: (val) => set({ filter: val, isTouched: true }),
  resetFilter: () =>
    set({
      filter: {
        contentType: "",
        genres: [],
        platforms: [],
        personaFilter: {},
        popcorithmFilter: {},
        ageGroupFilter: {},
      },
      isTouched: false,
    }),
  markTouched: () => set({ isTouched: true }),
  resetTouched: () => set({ isTouched: false }),
}));
