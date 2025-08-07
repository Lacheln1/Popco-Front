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
    platform: [],
    personaFilter: {},
    popcorithmFilter: {},
    ageGroupFilter: {},
  },
  isTouched: false,
  setFilter: (val, touch = true) => set({ filter: val, isTouched: touch }),
  resetFilter: () =>
    set({
      filter: {
        contentType: "",
        genres: [],
        platform: [],
        personaFilter: {},
        popcorithmFilter: {},
        ageGroupFilter: {},
      },
      isTouched: false,
    }),
  markTouched: () => set({ isTouched: true }),
  resetTouched: () => set({ isTouched: false }),
}));
