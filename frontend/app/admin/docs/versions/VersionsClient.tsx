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
import { useVersions } from "../hooks";
import type { DocVersion, DocVersionPayload } from "../types/docs.type";
import { GradientButton } from "@/app/components/utils";
import RichTextEditor from "@/app/components/editor/RichTextEditor";

export default function DocVersionsPage() {
  const {
    versions,
    isLoading,
    error,
    search,
    setSearch,
    createVersion,
    updateVersion,
    deleteVersion,
  } = useVersions();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<DocVersion | null>(null);
  const [formDescription, setFormDescription] = useState("");

  const filteredVersions = useMemo(() => {
    const term = search.trim().toLowerCase();
    return versions.filter((version) =>
      `${version.version} ${version.slug} ${version.description ?? ""}`
        .toLowerCase()
        .includes(term)
    );
  }, [search, versions]);

  const openCreate = () => {
    setEditing(null);
    setFormDescription("");
    createVersion.reset();
    updateVersion.reset();
    setModalOpen(true);
  };

  const openEdit = (version: DocVersion) => {
    setEditing(version);
    setFormDescription(version.description ?? "");
    createVersion.reset();
    updateVersion.reset();
    setModalOpen(true);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload: DocVersionPayload = {
      version: String(form.get("version") ?? "").trim(),
      slug: String(form.get("slug") ?? "").trim() || null,
      description: formDescription.trim() || null,
      sort_order: Number(form.get("sort_order") ?? 0),
      is_active: form.get("is_active") === "on",
    };

    if (editing) {
      updateVersion.mutate(
        { id: editing.id, ...payload },
        { onSuccess: () => setModalOpen(false) }
      );
    } else {
      createVersion.mutate(payload, {
        onSuccess: () => setModalOpen(false),
      });
    }
  };

  const mutationError = createVersion.error ?? updateVersion.error;
  const errorMessage =
    error instanceof Error ? error.message : "Unable to load documentation versions.";

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <DocsPageHeader
        title="Documentation versions"
        description="Manage the releases available in the documentation."
        action={
          <GradientButton
            size="sm"
            rounded="sm"
            onClick={openCreate}
            className="flex-row items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
          >
            <div className="flex items-center justify-center gap-1">
              <Plus className="h-4 w-4" />
              <span>Add version</span>
            </div>
          </GradientButton>
        }
      />

      <DocsPanel>
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-foreground">All versions</h2>
            <p className="mt-0.5 text-xs text-foreground-muted">
              {versions.length} total
            </p>
          </div>
          <label className="relative block w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search versions..."
              className={`${inputClassName} pl-9`}
              aria-label="Search versions"
            />
          </label>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-background-alt text-xs uppercase tracking-wide text-foreground-muted">
              <tr>
                <th className="px-5 py-3 font-semibold">Version</th>
                <th className="px-5 py-3 font-semibold">Slug</th>
                <th className="px-5 py-3 font-semibold">Order</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-foreground-muted">
                    Loading versions...
                  </td>
                </tr>
              ) : filteredVersions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-foreground-muted">
                    {search ? "No versions match your search." : "No versions yet."}
                  </td>
                </tr>
              ) : (
                filteredVersions.map((version) => (
                  <tr key={version.id} className="transition hover:bg-background-alt/60">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-foreground">{version.version}</p>
                      {version.description && (
                        <p className="mt-1 max-w-md truncate text-xs text-foreground-muted">
                          {version.description}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 text-foreground-muted">
                      {version.slug || "—"}
                    </td>
                    <td className="px-5 py-4 text-foreground-muted">
                      {version.sort_order}
                    </td>
                    <td className="px-5 py-4">
                      <DocsStatus active={version.is_active} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(version)}
                          aria-label={`Edit ${version.version}`}
                          className="rounded-lg p-2 text-foreground-muted transition hover:bg-background-alt hover:text-foreground"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete "${version.version}"?`)) {
                              deleteVersion.mutate(version.id);
                            }
                          }}
                          aria-label={`Delete ${version.version}`}
                          disabled={deleteVersion.isPending}
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
          title={editing ? "Edit version" : "Add version"}
          onClose={() => setModalOpen(false)}
          wide
        >
          <div className="items-center px-6 pt-4">
          {error && <DocsError message={errorMessage} />}
          {mutationError && (
            <DocsError message={mutationError.message || "Unable to save the version."} />
          )}
          {deleteVersion.error && (
            <DocsError
              message={deleteVersion.error.message || "Unable to delete the version."}
            />
          )}
          </div>
          <form onSubmit={submit} className="space-y-4 p-5">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Version name</span>
              <input
                name="version"
                required
                minLength={5}
                defaultValue={editing?.version ?? ""}
                className={inputClassName}
                placeholder="e.g. SwiftPY 2.0"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Slug</span>
              <input
                name="slug"
                defaultValue={editing?.slug ?? ""}
                className={inputClassName}
                placeholder="swiftpy-2"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium">Description</span>
              <RichTextEditor
                key={`version-description-${editing?.id ?? "new"}`}
                value={formDescription}
                onChange={setFormDescription}
                placeholder="Describe this documentation version..."
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-1.5">
                <span className="text-sm font-medium">Sort order</span>
                <input
                  type="number"
                  name="sort_order"
                  min={0}
                  defaultValue={editing?.sort_order ?? 0}
                  className={inputClassName}
                />
              </label>
              <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium">
                <input
                  type="checkbox"
                  name="is_active"
                  defaultChecked={editing?.is_active ?? true}
                  className="h-4 w-4 accent-primary"
                />
                Active
              </label>
            </div>
            <FormActions
              onCancel={() => setModalOpen(false)}
              pending={createVersion.isPending || updateVersion.isPending}
            />
          </form>
        </DocsModal>
      )}
    </div>
  );
}
