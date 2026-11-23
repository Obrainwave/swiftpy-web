import { create } from "zustand";

interface ContentState {
  search: string;
  versionId: string;
  groupId: string;
  setSearch: (search: string) => void;
  setVersionId: (versionId: string) => void;
  setGroupId: (groupId: string) => void;
}

const useContentStore = create<ContentState>((set) => ({
  search: "",
  versionId: "all",
  groupId: "all",
  setSearch: (search) => set({ search }),
  setVersionId: (versionId) => set({ versionId, groupId: "all" }),
  setGroupId: (groupId) => set({ groupId }),
}));

export default useContentStore;