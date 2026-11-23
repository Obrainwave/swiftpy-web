import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDocContentApi,
  deleteDocContentApi,
  getDocContentsApi,
  updateDocContentApi,
} from "../api/docs.api";
import useContentStore from "../stores/content.store";
import type { DocContentPayload } from "../types/docs.type";

export function useContents() {
  const queryClient = useQueryClient();
  const search = useContentStore((state) => state.search);
  const versionId = useContentStore((state) => state.versionId);
  const groupId = useContentStore((state) => state.groupId);
  const setSearch = useContentStore((state) => state.setSearch);
  const setVersionId = useContentStore((state) => state.setVersionId);
  const setGroupId = useContentStore((state) => state.setGroupId);
  const contentsQuery = useQuery({
    queryKey: ["admin-docs", "contents"],
    queryFn: getDocContentsApi,
  });
  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-docs"] });

  const createContent = useMutation({
    mutationFn: createDocContentApi,
    onSuccess: refresh,
  });
  const updateContent = useMutation({
    mutationFn: updateDocContentApi,
    onSuccess: refresh,
  });
  const deleteContent = useMutation({
    mutationFn: deleteDocContentApi,
    onSuccess: refresh,
  });

  return {
    ...contentsQuery,
    contents: contentsQuery.data ?? [],
    search,
    versionId,
    groupId,
    setSearch,
    setVersionId,
    setGroupId,
    createContent,
    updateContent,
    deleteContent,
  };
}

export type ContentFormValues = DocContentPayload;