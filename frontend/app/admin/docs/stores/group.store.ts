import { create } from "zustand";

interface GroupState {
  search: string;
  versionId: string;
  setSearch: (search: string) => void;
  setVersionId: (versionId: string) => void;
}

const useGroupStore = create<GroupState>((set) => ({
  search: "",
  versionId: "all",
  setSearch: (search) => set({ search }),
  setVersionId: (versionId) => set({ versionId }),
}));

export default useGroupStore;