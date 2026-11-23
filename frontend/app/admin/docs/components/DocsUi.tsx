import type { FormEvent, ReactNode } from "react";
import { X } from "lucide-react";

export const inputClassName =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

export function DocsPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          Documentation
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-1 text-sm text-foreground-muted">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function DocsPanel({ children }: { children: ReactNode }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-xs">
      {children}
    </section>
  );
}

export function DocsError({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-500/25 bg-red-500/5 px-4 py-3 text-sm text-red-600 dark:text-red-400"
    >
      {message}
    </div>
  );
}

export function DocsStatus({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        active
          ? "bg-accent/10 text-accent"
          : "bg-background-alt text-foreground-muted"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

export function DocsModal({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="docs-modal-title"
        className={`max-h-[90vh] w-full overflow-y-auto rounded-2xl border border-border bg-surface shadow-2xl ${
          wide ? "max-w-6xl" : "max-w-xl"
        }`}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-surface px-5 py-4">
          <h2 id="docs-modal-title" className="text-lg font-bold text-foreground">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-foreground-muted transition hover:bg-background-alt hover:text-foreground"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

export function FormActions({
  onCancel,
  pending,
}: {
  onCancel: () => void;
  pending: boolean;
}) {
  return (
    <div className="flex justify-end gap-2 border-t border-border pt-4">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground-muted transition hover:bg-background-alt"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save"}
      </button>
    </div>
  );
}

export function getFormValues(event: FormEvent<HTMLFormElement>) {
  return new FormData(event.currentTarget);
}
