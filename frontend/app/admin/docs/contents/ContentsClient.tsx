"use client";

import { useMemo, useState, type FormEvent } from "react";
import { FileText, Pencil, Plus, Search, Trash2 } from "lucide-react";
import {
  DocsError,
  DocsModal,
  DocsPageHeader,
  DocsPanel,
  DocsStatus,
  FormActions,
  inputClassName,
} from "../components/DocsUi";
import { useContents, useGroups, useVersions } from "../hooks";
import type { DocContent, DocContentPayload } from "../types/docs.type";
import RichTextEditor from "@/app/components/editor/RichTextEditor";

export default function DocContentsPage() {
  const {
    contents,
    isLoading,
    error,
    search,
    versionId,
    groupId,
    setSearch,
    setVersionId,
    setGroupId,
    createContent,
    updateContent,
    deleteContent,
  } = useContents();
  const {
    groups,
    isLoading: groupsLoading,
    error: groupsError,
  } = useGroups();
  const {
    versions,
    isLoading: versionsLoading,
    error: versionsError,
  } = useVersions();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<DocContent | null>(null);
  const [formVersionId, setFormVersionId] = useState("");
  const [formGroupId, setFormGroupId] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formContentError, setFormContentError] = useState("");

  const filteredGroups =
    versionId === "all"
      ? groups
      : groups.filter((group) => group.doc_version_id === Number(versionId));
  const formGroups = groups.filter(
    (group) => group.doc_version_id === Number(formVersionId)
  );
  const filteredContents = useMemo(() => {
    const term = search.trim().toLowerCase();
    return contents.filter((content) => {
      const group = groups.find((candidate) => candidate.id === content.doc_group_id);
      const matchesVersion =
        versionId === "all" ||
        (group?.doc_version_id ?? content.doc_version_id) === Number(versionId);
      const matchesGroup = groupId === "all" || content.doc_group_id === Number(groupId);
      const matchesSearch = `${content.title} ${content.slug} ${content.content}`
        .toLowerCase()
        .includes(term);
      return matchesVersion && matchesGroup && matchesSearch;
    });
  }, [contents, groupId, groups, search, versionId]);

  const openForm = (content?: DocContent) => {
    const contentGroup = content
      ? groups.find((group) => group.id === content.doc_group_id)
      : undefined;
    const nextVersionId = String(
      contentGroup?.doc_version_id ??
        (versionId === "all" ? versions[0]?.id ?? "" : versionId)
    );
    const nextGroups = groups.filter(
      (group) => group.doc_version_id === Number(nextVersionId)
    );
    setEditing(content ?? null);
    setFormVersionId(nextVersionId);
    setFormGroupId(
      String(content?.doc_group_id ?? nextGroups[0]?.id ?? "")
    );
    setFormContent(content?.content ?? "");
    setFormContentError("");
    createContent.reset();
    updateContent.reset();
    setModalOpen(true);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formContent.trim()) {
      setFormContentError("Content is required.");
      return;
    }
    setFormContentError("");
    const form = new FormData(event.currentTarget);
    const payload: DocContentPayload = {
      title: String(form.get("title") ?? "").trim(),
      slug: String(form.get("slug") ?? "").trim() || null,
      content: formContent,
      doc_group_id: Number(formGroupId),
      is_active: form.get("is_active") === "on",
    };

    if (editing) {
      updateContent.mutate(
        { id: editing.id, ...payload },
        { onSuccess: () => setModalOpen(false) }
      );
    } else {
      createContent.mutate(payload, { onSuccess: () => setModalOpen(false) });
    }
  };

  const mutationError = createContent.error ?? updateContent.error;
  const errorMessage =
    error instanceof Error ? error.message : "Unable to load documentation contents.";

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <DocsPageHeader
        title="Documentation contents"
        description="Write and maintain the pages in your documentation."
        action={
          <button
            type="button"
            onClick={() => openForm()}
            disabled={groups.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Add content
          </button>
        }
      />

      {groups.length === 0 &&
        !groupsLoading &&
        !versionsLoading &&
        !error &&
        !groupsError &&
        !versionsError && (
        <p className="rounded-xl border border-secondary/30 bg-secondary/5 px-4 py-3 text-sm text-foreground-muted">
          Create a documentation group before adding content.
        </p>
      )}
      {error && <DocsError message={errorMessage} />}
      {groupsError && (
        <DocsError
          message={
            groupsError instanceof Error
              ? groupsError.message
              : "Unable to load documentation groups."
          }
        />
      )}
      {versionsError && (
        <DocsError
          message={
            versionsError instanceof Error
              ? versionsError.message
              : "Unable to load documentation versions."
          }
        />
      )}
      {mutationError && (
        <DocsError message={mutationError.message || "Unable to save the content."} />
      )}
      {deleteContent.error && (
        <DocsError
          message={deleteContent.error.message || "Unable to delete the content."}
        />
      )}

      <DocsPanel>
        <div className="flex flex-col gap-3 border-b border-border p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-foreground">All content</h2>
              <p className="mt-0.5 text-xs text-foreground-muted">
                {filteredContents.length} shown · {contents.length} total
              </p>
            </div>
            <label className="relative block w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search content..."
                className={`${inputClassName} pl-9`}
                aria-label="Search documentation content"
              />
            </label>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <label>
              <span className="sr-only">Filter by version</span>
              <select
                value={versionId}
                onChange={(event) => setVersionId(event.target.value)}
                className={inputClassName}
              >
                <option value="all">All versions</option>
                {versions.map((version) => (
                  <option key={version.id} value={version.id}>
                    {version.version}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="sr-only">Filter by group</span>
              <select
                value={groupId}
                onChange={(event) => setGroupId(event.target.value)}
                className={inputClassName}
              >
                <option value="all">All groups</option>
                {filteredGroups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-background-alt text-xs uppercase tracking-wide text-foreground-muted">
              <tr>
                <th className="px-5 py-3 font-semibold">Page</th>
                <th className="px-5 py-3 font-semibold">Version</th>
                <th className="px-5 py-3 font-semibold">Group</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading || groupsLoading || versionsLoading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-foreground-muted">
                    Loading content...
                  </td>
                </tr>
              ) : filteredContents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-foreground-muted">
                    {search || versionId !== "all" || groupId !== "all"
                      ? "No content matches these filters."
                      : "No content pages yet."}
                  </td>
                </tr>
              ) : (
                filteredContents.map((content) => {
                  const group = groups.find(
                    (candidate) => candidate.id === content.doc_group_id
                  );
                  const version = versions.find(
                    (candidate) => candidate.id === content.doc_version_id
                  );
                  return (
                    <tr key={content.id} className="transition hover:bg-background-alt/60">
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 rounded-lg bg-primary/10 p-2 text-primary">
                            <FileText className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground">{content.title}</p>
                            <p className="mt-1 max-w-md truncate text-xs text-foreground-muted">
                              {content.slug || "No slug"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-foreground-muted">
                        {version?.version ?? "—"}
                      </td>
                      <td className="px-5 py-4 text-foreground-muted">
                        {group?.name ?? "—"}
                      </td>
                      <td className="px-5 py-4">
                        <DocsStatus active={content.is_active} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openForm(content)}
                            aria-label={`Edit ${content.title}`}
                            className="rounded-lg p-2 text-foreground-muted transition hover:bg-background-alt hover:text-foreground"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete "${content.title}"?`)) {
                                deleteContent.mutate(content.id);
                              }
                            }}
                            aria-label={`Delete ${content.title}`}
                            disabled={deleteContent.isPending}
                            className="rounded-lg p-2 text-foreground-muted transition hover:bg-red-500/10 hover:text-red-500 disabled:opacity-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </DocsPanel>

      {modalOpen && (
        <DocsModal
          title={editing ? "Edit content" : "Add content"}
          onClose={() => setModalOpen(false)}
          wide
        >
          <form onSubmit={submit} className="space-y-4 p-5">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Title</span>
              <input
                name="title"
                required
                minLength={5}
                defaultValue={editing?.title ?? ""}
                className={inputClassName}
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-1.5">
                <span className="text-sm font-medium">Version</span>
                <select
                  value={formVersionId}
                  onChange={(event) => {
                    const selectedVersionId = event.target.value;
                    setFormVersionId(selectedVersionId);
                    setFormGroupId(
                      String(
                        groups.find(
                          (group) =>
                            group.doc_version_id === Number(selectedVersionId)
                        )?.id ?? ""
                      )
                    );
                  }}
                  className={inputClassName}
                >
                  {versions.map((version) => (
                    <option key={version.id} value={version.id}>
                      {version.version}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium">Group</span>
                <select
                  value={formGroupId}
                  onChange={(event) => setFormGroupId(event.target.value)}
                  required
                  className={inputClassName}
                >
                  {formGroups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Slug</span>
              <input
                name="slug"
                defaultValue={editing?.slug ?? ""}
                className={inputClassName}
                placeholder="installation"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Content</span>
              <RichTextEditor
                value={formContent}
                onChange={setFormContent}
                placeholder="Write the documentation page content..."
              />
              {formContentError && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {formContentError}
                </p>
              )}
            </label>
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                name="is_active"
                defaultChecked={editing?.is_active ?? true}
                className="h-4 w-4 accent-primary"
              />
              Active
            </label>
            <FormActions
              onCancel={() => setModalOpen(false)}
              pending={createContent.isPending || updateContent.isPending}
            />
          </form>
        </DocsModal>
      )}
    </div>
  );
}
