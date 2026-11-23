"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import {
  DocsError,
  DocsModal,
  DocsPageHeader,
  DocsPanel,
  DocsStatus,
  FormActions,
  inputClassName,
} from "../components/DocsUi";
import { useGroups, useVersions } from "../hooks";
import type { DocGroup, DocGroupPayload } from "../types/docs.type";
import GradientButton from "@/app/components/utils/GradientButton";
import RichTextEditor from "@/app/components/editor/RichTextEditor";

export default function DocGroupsPage() {
  const {
    groups,
    isLoading,
    error,
    search,
    versionId,
    setSearch,
    setVersionId,
    createGroup,
    updateGroup,
    deleteGroup,
  } = useGroups();
  const {
    versions,
    isLoading: versionsLoading,
    error: versionsError,
  } = useVersions();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<DocGroup | null>(null);
  const [formVersionId, setFormVersionId] = useState("");
  const [formDescription, setFormDescription] = useState("");

  const filteredGroups = useMemo(() => {
    const term = search.trim().toLowerCase();
    return groups.filter((group) => {
      const matchesVersion =
        versionId === "all" || group.doc_version_id === Number(versionId);
      const matchesTerm = `${group.name} ${group.slug} ${group.description ?? ""}`
        .toLowerCase()
        .includes(term);
      return matchesVersion && matchesTerm;
    });
  }, [groups, search, versionId]);

  const openForm = (group?: DocGroup) => {
    setEditing(group ?? null);
    setFormDescription(group?.description ?? "");
    setFormVersionId(
      String(group?.doc_version_id ?? (versionId === "all" ? versions[0]?.id ?? "" : versionId))
    );
    createGroup.reset();
    updateGroup.reset();
    setModalOpen(true);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parentValue = String(form.get("parent_id") ?? "");
    const payload: DocGroupPayload = {
      name: String(form.get("name") ?? "").trim(),
      slug: String(form.get("slug") ?? "").trim() || null,
      doc_version_id: Number(form.get("doc_version_id")),
      parent_id: parentValue ? Number(parentValue) : null,
      description: formDescription.trim() || null,
      sort_order: Number(form.get("sort_order") ?? 0),
      example_link: String(form.get("example_link") ?? "").trim() || null,
      is_active: form.get("is_active") === "on",
    };

    if (editing) {
      updateGroup.mutate(
        { id: editing.id, ...payload },
        { onSuccess: () => setModalOpen(false) }
      );
    } else {
      createGroup.mutate(payload, { onSuccess: () => setModalOpen(false) });
    }
  };

  const mutationError = createGroup.error ?? updateGroup.error;
  const errorMessage =
    error instanceof Error ? error.message : "Unable to load documentation groups.";
  const parentGroups = groups.filter(
    (group) =>
      group.id !== editing?.id &&
      group.doc_version_id === Number(formVersionId)
  );

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <DocsPageHeader
        title="Documentation groups"
        description="Organize documentation into versioned sections and topics."
        action={
          <GradientButton
            size="sm"
            rounded="sm"
            onClick={() => openForm()}
            className="flex-row items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
          >
            <div className="flex items-center justify-center gap-1">
              <Plus className="h-4 w-4" />
              <span>Add Group</span>
            </div>
          </GradientButton>
        }
      />

      {versions.length === 0 &&
        !isLoading &&
        !versionsLoading &&
        !error &&
        !versionsError && (
        <p className="rounded-xl border border-secondary/30 bg-secondary/5 px-4 py-3 text-sm text-foreground-muted">
          Create a documentation version before adding a group.
        </p>
      )}
      {error && <DocsError message={errorMessage} />}
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
        <DocsError message={mutationError.message || "Unable to save the group."} />
      )}
      {deleteGroup.error && (
        <DocsError
          message={deleteGroup.error.message || "Unable to delete the group."}
        />
      )}

      <DocsPanel>
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-foreground">All groups</h2>
            <p className="mt-0.5 text-xs text-foreground-muted">
              {filteredGroups.length} shown · {groups.length} total
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label>
              <span className="sr-only">Filter by version</span>
              <select
                value={versionId}
                onChange={(event) => setVersionId(event.target.value)}
                className={`${inputClassName} sm:w-44`}
              >
                <option value="all">All versions</option>
                {versions.map((version) => (
                  <option key={version.id} value={version.id}>
                    {version.version}
                  </option>
                ))}
              </select>
            </label>
            <label className="relative block sm:w-60">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search groups..."
                className={`${inputClassName} pl-9`}
                aria-label="Search groups"
              />
            </label>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-background-alt text-xs uppercase tracking-wide text-foreground-muted">
              <tr>
                <th className="px-5 py-3 font-semibold">Group</th>
                <th className="px-5 py-3 font-semibold">Version</th>
                <th className="px-5 py-3 font-semibold">Parent</th>
                <th className="px-5 py-3 font-semibold">Contents</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading || versionsLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-foreground-muted">
                    Loading groups...
                  </td>
                </tr>
              ) : filteredGroups.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-foreground-muted">
                    {search || versionId !== "all"
                      ? "No groups match these filters."
                      : "No groups yet."}
                  </td>
                </tr>
              ) : (
                filteredGroups.map((group) => (
                  <tr key={group.id} className="transition hover:bg-background-alt/60">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-foreground">{group.name}</p>
                      <p className="mt-1 text-xs text-foreground-muted">
                        {group.slug || "No slug"}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-foreground-muted">
                      {versions.find((version) => version.id === group.doc_version_id)
                        ?.version ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-foreground-muted">
                      {groups.find((candidate) => candidate.id === group.parent_id)
                        ?.name ?? "—"}
                    </td>
                    <td className="px-5 py-4 text-foreground-muted">
                      {group.docs?.length ?? 0}
                    </td>
                    <td className="px-5 py-4">
                      <DocsStatus active={group.is_active} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openForm(group)}
                          aria-label={`Edit ${group.name}`}
                          className="rounded-lg p-2 text-foreground-muted transition hover:bg-background-alt hover:text-foreground"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete "${group.name}"?`)) {
                              deleteGroup.mutate(group.id);
                            }
                          }}
                          aria-label={`Delete ${group.name}`}
                          disabled={deleteGroup.isPending}
                          className="rounded-lg p-2 text-foreground-muted transition hover:bg-red-500/10 hover:text-red-500 disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </DocsPanel>

      {modalOpen && (
        <DocsModal
          title={editing ? "Edit group" : "Add group"}
          onClose={() => setModalOpen(false)}
          wide
        >
          <form onSubmit={submit} className="space-y-4 p-5">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Group name</span>
              <input
                name="name"
                required
                minLength={3}
                defaultValue={editing?.name ?? ""}
                className={inputClassName}
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-1.5">
                <span className="text-sm font-medium">Version</span>
                <select
                  name="doc_version_id"
                  required
                  value={formVersionId}
                  onChange={(event) => setFormVersionId(event.target.value)}
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
                <span className="text-sm font-medium">Parent group</span>
                <select
                  name="parent_id"
                  defaultValue={editing?.parent_id ?? ""}
                  className={inputClassName}
                >
                  <option value="">None</option>
                  {parentGroups.map((group) => (
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
                placeholder="getting-started"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Description</span>
              <RichTextEditor
                key={`group-description-${editing?.id ?? "new"}`}
                value={formDescription}
                onChange={setFormDescription}
                placeholder="Describe this documentation group..."
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-1.5">
                <span className="text-sm font-medium">Example link</span>
                <input
                  name="example_link"
                  type="url"
                  defaultValue={editing?.example_link ?? ""}
                  className={inputClassName}
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-medium">Sort order</span>
                <input
                  name="sort_order"
                  type="number"
                  min={0}
                  defaultValue={editing?.sort_order ?? 0}
                  className={inputClassName}
                />
              </label>
            </div>
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
              pending={createGroup.isPending || updateGroup.isPending}
            />
          </form>
        </DocsModal>
      )}
    </div>
  );
}
