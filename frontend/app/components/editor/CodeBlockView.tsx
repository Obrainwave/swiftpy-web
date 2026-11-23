"use client";

import { useEffect, useRef } from "react";
import type { NodeViewProps } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import { EditorView, basicSetup } from "codemirror";
import { Compartment, EditorState } from "@codemirror/state";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { php } from "@codemirror/lang-php";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { rust } from "@codemirror/lang-rust";
import { sql } from "@codemirror/lang-sql";

export const codeLanguages = [
  "plaintext", "python", "javascript", "typescript", "tsx", "jsx",
  "php", "java", "c", "cpp", "csharp", "go", "rust", "sql",
  "bash", "json", "html", "css",
];

function languageExtension(language: string) {
  switch (language) {
    case "python": return python();
    case "javascript":
    case "typescript":
    case "tsx":
    case "jsx": return javascript({ jsx: language === "jsx" || language === "tsx", typescript: language === "typescript" || language === "tsx" });
    case "html": return html();
    case "css": return css();
    case "json": return json();
    case "php": return php();
    case "java": return java();
    case "c":
    case "cpp":
    case "csharp": return cpp();
    case "rust": return rust();
    case "sql": return sql();
    default: return [];
  }
}

export default function CodeBlockView({ node, updateAttributes, getPos, editor }: NodeViewProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const languageRef = useRef(new Compartment());
  const initialTextRef = useRef(node.textContent);
  const initialLanguageRef = useRef(node.attrs.language);

  useEffect(() => {
    if (!hostRef.current) return;

    const view = new EditorView({
      state: EditorState.create({
        doc: initialTextRef.current,
        extensions: [
          basicSetup,
          EditorView.lineWrapping,
          EditorView.theme({
            "&": { minHeight: "8rem", backgroundColor: "#111827", color: "#e5e7eb" },
            ".cm-content": { fontFamily: "var(--font-geist-mono), monospace", padding: "1rem" },
            ".cm-gutters": { backgroundColor: "#111827", color: "#6b7280", border: "none" },
            "&.cm-focused": { outline: "none" },
          }),
          languageRef.current.of(languageExtension(initialLanguageRef.current)),
          EditorView.updateListener.of((update) => {
            if (!update.docChanged) return;
            const pos = getPos();
            if (typeof pos !== "number") return;
            const nextText = update.state.doc.toString();
            const currentNode = editor.state.doc.nodeAt(pos);
            if (!currentNode) return;
            const tr = editor.state.tr.replaceWith(pos + 1, pos + currentNode.nodeSize - 1, editor.schema.text(nextText));
            editor.view.dispatch(tr);
          }),
        ],
      }),
      parent: hostRef.current,
    });
    viewRef.current = view;
    return () => view.destroy();
  }, [editor, getPos]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.dispatch({
      effects: languageRef.current.reconfigure(languageExtension(node.attrs.language)),
    });
  }, [node.attrs.language]);

  return (
    <NodeViewWrapper className="my-4 overflow-hidden rounded-xl border border-slate-700 bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-700 px-3 py-2">
        <select
          aria-label="Code block language"
          value={node.attrs.language || "plaintext"}
          onChange={(event) => updateAttributes({ language: event.target.value })}
          className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200 outline-none"
        >
          {codeLanguages.map((language) => (
            <option key={language} value={language}>{language}</option>
          ))}
        </select>
      </div>
      <div ref={hostRef} className="overflow-x-auto" />
    </NodeViewWrapper>
  );
}
