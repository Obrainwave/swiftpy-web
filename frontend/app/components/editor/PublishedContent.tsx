import { marked } from "marked";
import { codeToHtml } from "shiki";
import { sanitizeHtml } from "@/lib/editor/sanitize";
import PublishedCopyScript from "./PublishedCopyScript";

function decodeHtml(value: string): string {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

export default async function PublishedContent({ markdown }: { markdown: string }) {
  if (!markdown.trim()) return null;

  const parsed = marked.parse(markdown, { gfm: true });
  const source = sanitizeHtml(typeof parsed === "string" ? parsed : "");
  const withHighlightedCode = await Promise.all(
    Array.from(source.matchAll(/<pre><code(?: class="language-([^"]+)")?>([\s\S]*?)<\/code><\/pre>/g))
  ).then(async (matches) => {
    let rendered = source;
    for (const match of matches) {
      const [full, language = "text", encodedCode] = match;
      const code = decodeHtml(encodedCode);
      let highlighted: string;
      try {
        highlighted = await codeToHtml(code, {
          lang: language,
          themes: { light: "github-light", dark: "github-dark" },
        });
      } catch {
        highlighted = await codeToHtml(code, {
          lang: "text",
          themes: { light: "github-light", dark: "github-dark" },
        });
      }
      const escapedCode = code.replace(/&/g, "&amp;");
      rendered = rendered.replace(
        full,
        `<div class="overflow-hidden rounded-xl border border-slate-700" data-code-block data-code="${escapedCode.replace(/"/g, "&quot;").replace(/\n/g, "&#10;")}">
          <div class="flex items-center justify-between border-b border-slate-700 bg-slate-900 px-4 py-2 text-xs text-slate-300">
            <span>${language}</span>
            <button type="button" data-copy-code class="rounded px-2 py-1 hover:bg-slate-800">Copy</button>
          </div>
          ${highlighted}
        </div>`
      );
    }
    return rendered;
  });

  return (
    <>
      <PublishedCopyScript />
      <article
        className="published-content max-w-none"
        dangerouslySetInnerHTML={{ __html: withHighlightedCode }}
      />
    </>
  );
}
