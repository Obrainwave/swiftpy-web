import { create } from "zustand";

interface VersionState {
  search: string;
  setSearch: (search: string) => void;
}

const useVersionStore = create<VersionState>((set) => ({
  search: "",
  setSearch: (search) => set({ search }),
}));

export default useVersionStore;