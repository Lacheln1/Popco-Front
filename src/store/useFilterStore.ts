import { PostFilterRequest } from "@/types/Search.types";
import { create } from "zustand";

interface FilterStore {
  filter: PostFilterRequest;
  setFilter: (val: PostFilterRequest) => void;
  resetFilter: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  filter: {
    genres: [],
    platforms: [],
    personaFilter: {},
    popcorithmFilter: {},
    ageGroupFilter: {},
  },
  setFilter: (val) => set({ filter: val }),
  resetFilter: () =>
    set({
      filter: {
        genres: [],
        platforms: [],
        personaFilter: {},
        popcorithmFilter: {},
        ageGroupFilter: {},
      },
    }),
}));
