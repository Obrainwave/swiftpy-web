import { marked } from "marked";
import TurndownService from "turndown";
import { gfm } from "@joplin/turndown-plugin-gfm";
import { sanitizeHtml } from "./sanitize";

export function markdownToHtml(markdown: string): string {
  if (!markdown.trim()) return "";

  const rendered = marked.parse(markdown, { gfm: true, breaks: false });
  return typeof rendered === "string" ? sanitizeHtml(rendered) : "";
}

export function htmlToMarkdown(html: string): string {
  if (!html.trim()) return "";

  const turndown = new TurndownService({
    headingStyle: "atx",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
    emDelimiter: "*",
  });

  turndown.use(gfm);
  turndown.addRule("fencedCodeBlock", {
    filter: (node) => node.nodeName === "PRE",
    replacement: (_content, node) => {
      const pre = node as HTMLPreElement;
      const code = pre.querySelector("code");
      const languageClass =
        code?.getAttribute("class")?.match(/language-([\w+-]+)/)?.[1] ??
        pre.getAttribute("data-language") ??
        "";
      const source = code?.textContent ?? pre.textContent ?? "";
      return `\n\n\`\`\`${languageClass}\n${source.replace(/\n$/, "")}\n\`\`\`\n\n`;
    },
  });

  return turndown.turndown(sanitizeHtml(html)).trim();
}
