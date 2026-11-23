import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDocVersionApi,
  deleteDocVersionApi,
  getDocVersionsApi,
  updateDocVersionApi,
} from "../api/docs.api";
import useVersionStore from "../stores/version.store";
import type { DocVersionPayload } from "../types/docs.type";

const queryKey = ["admin-docs", "versions"];

export function useVersions() {
  const queryClient = useQueryClient();
  const search = useVersionStore((state) => state.search);
  const setSearch = useVersionStore((state) => state.setSearch);
  const versionsQuery = useQuery({ queryKey, queryFn: getDocVersionsApi });
  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-docs"] });

  const createVersion = useMutation({
    mutationFn: createDocVersionApi,
    onSuccess: refresh,
  });
  const updateVersion = useMutation({
    mutationFn: updateDocVersionApi,
    onSuccess: refresh,
  });
  const deleteVersion = useMutation({
    mutationFn: deleteDocVersionApi,
    onSuccess: refresh,
  });

  return {
    ...versionsQuery,
    versions: versionsQuery.data ?? [],
    search,
    setSearch,
    createVersion,
    updateVersion,
    deleteVersion,
  };
}

export type VersionFormValues = DocVersionPayload;