import sanitizeHtmlLib from "sanitize-html";

const safeUrlProtocols = ["http", "https", "mailto", "tel"];

export function sanitizeHtml(html: string): string {
  return sanitizeHtmlLib(html, {
    allowedTags: [
      "p", "br", "strong", "b", "em", "i", "u", "s", "del", "code",
      "pre", "h1", "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li", "blockquote", "hr", "a", "img",
      "table", "thead", "tbody", "tr", "th", "td",
    ],
    allowedAttributes: {
      "*": ["class", "style"],
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      pre: ["data-language"],
      th: ["colspan", "rowspan"],
      td: ["colspan", "rowspan"],
    },
    allowedStyles: {},
    allowedSchemes: safeUrlProtocols,
    allowedSchemesByTag: {
      img: ["http", "https", "data"],
    },
    allowProtocolRelative: false,
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          rel: "noopener noreferrer",
        },
      }),
    },
  });
}

export function isSafeUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;

  if (trimmed.startsWith("/") || trimmed.startsWith("#")) return true;

  try {
    const url = new URL(trimmed);
    return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol);
  } catch {
    return false;
  }
}
