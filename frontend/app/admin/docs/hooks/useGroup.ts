import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDocGroupApi,
  deleteDocGroupApi,
  getDocGroupsApi,
  updateDocGroupApi,
} from "../api/docs.api";
import useGroupStore from "../stores/group.store";
import type { DocGroupPayload } from "../types/docs.type";

export function useGroups() {
  const queryClient = useQueryClient();
  const search = useGroupStore((state) => state.search);
  const versionId = useGroupStore((state) => state.versionId);
  const setSearch = useGroupStore((state) => state.setSearch);
  const setVersionId = useGroupStore((state) => state.setVersionId);
  const groupsQuery = useQuery({
    queryKey: ["admin-docs", "groups"],
    queryFn: getDocGroupsApi,
  });
  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-docs"] });

  const createGroup = useMutation({
    mutationFn: createDocGroupApi,
    onSuccess: refresh,
  });
  const updateGroup = useMutation({
    mutationFn: updateDocGroupApi,
    onSuccess: refresh,
  });
  const deleteGroup = useMutation({
    mutationFn: deleteDocGroupApi,
    onSuccess: refresh,
  });

  return {
    ...groupsQuery,
    groups: groupsQuery.data ?? [],
    search,
    versionId,
    setSearch,
    setVersionId,
    createGroup,
    updateGroup,
    deleteGroup,
  };
}

export type GroupFormValues = DocGroupPayload;