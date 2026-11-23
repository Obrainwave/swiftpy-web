import apiClient from "../../../api/interceptor";
import type {
  ApiResponse,
  DocContent,
  DocContentPayload,
  DocGroup,
  DocGroupPayload,
  DocVersion,
  DocVersionPayload,
} from "../types/docs.type";

async function getData<T>(path: string): Promise<T> {
  const { data } = await apiClient.get<ApiResponse<T>>(path);
  return data.data;
}

async function postData<T, P>(path: string, payload: P): Promise<T> {
  const { data } = await apiClient.post<ApiResponse<T>>(path, payload);
  return data.data;
}

async function putData<T, P>(path: string, payload: P): Promise<T> {
  const { data } = await apiClient.put<ApiResponse<T>>(path, payload);
  return data.data;
}

async function deleteData(path: string): Promise<boolean> {
  const { data } = await apiClient.delete<ApiResponse<boolean>>(path);
  return data.data;
}

export const getDocVersionsApi = () =>
  getData<DocVersion[]>("/admin/docs/versions");
export const getDocVersionApi = (id: number) =>
  getData<DocVersion>(`/admin/docs/versions/${id}`);
export const createDocVersionApi = (payload: DocVersionPayload) =>
  postData<DocVersion, DocVersionPayload>("/admin/docs/versions/create", payload);
export const updateDocVersionApi = ({
  id,
  ...payload
}: DocVersionPayload & { id: number }) =>
  putData<DocVersion, DocVersionPayload>(
    `/admin/docs/versions/${id}/update`,
    payload
  );
export const deleteDocVersionApi = (id: number) =>
  deleteData(`/admin/docs/versions/${id}/delete`);

export const getDocGroupsApi = () => getData<DocGroup[]>("/admin/docs/groups");
export const getDocGroupApi = (id: number) =>
  getData<DocGroup>(`/admin/docs/groups/${id}`);
export const createDocGroupApi = (payload: DocGroupPayload) =>
  postData<DocGroup, DocGroupPayload>("/admin/docs/groups/create", payload);
export const updateDocGroupApi = ({
  id,
  ...payload
}: DocGroupPayload & { id: number }) =>
  putData<DocGroup, DocGroupPayload>(`/admin/docs/groups/${id}/update`, payload);
export const deleteDocGroupApi = (id: number) =>
  deleteData(`/admin/docs/groups/${id}/delete`);

export const getDocContentsApi = () =>
  getData<DocContent[]>("/admin/docs/contents");
export const getDocContentApi = (id: number) =>
  getData<DocContent>(`/admin/docs/contents/${id}`);
export const createDocContentApi = (payload: DocContentPayload) =>
  postData<DocContent, DocContentPayload>("/admin/docs/contents/create", payload);
export const updateDocContentApi = ({
  id,
  ...payload
}: DocContentPayload & { id: number }) =>
  putData<DocContent, DocContentPayload>(
    `/admin/docs/contents/${id}/update`,
    payload
  );
export const deleteDocContentApi = (id: number) =>
  deleteData(`/admin/docs/contents/${id}/delete`);
