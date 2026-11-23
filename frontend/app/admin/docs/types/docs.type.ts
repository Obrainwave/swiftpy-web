export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export interface DocVersion {
  id: number;
  version: string;
  slug: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  groups?: DocGroup[];
}

export interface DocVersionPayload {
  version: string;
  slug: string | null;
  description: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface DocGroup {
  id: number;
  name: string;
  slug: string;
  doc_version_id: number;
  parent_id: number | null;
  description: string | null;
  sort_order: number;
  image: string | null;
  example_link: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  version?: DocVersion;
  docs?: DocContent[];
}

export interface DocGroupPayload {
  name: string;
  slug: string | null;
  doc_version_id: number;
  parent_id: number | null;
  description: string | null;
  sort_order: number;
  example_link: string | null;
  is_active: boolean;
}

export interface DocContent {
  id: number;
  title: string;
  slug: string;
  content: string;
  doc_version_id: number;
  doc_group_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  version?: DocVersion;
  group?: DocGroup;
}

export interface DocContentPayload {
  title: string;
  slug: string | null;
  content: string;
  doc_group_id: number;
  is_active: boolean;
}