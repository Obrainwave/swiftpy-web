"use client";

import { useEffect, useState } from "react";
import {
  EditorContent,
  useEditor,
} from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { EditorToolbar } from "./EditorToolbar";
import { CodeBlockExtension } from "./CodeBlockExtension";
import { markdownToHtml, htmlToMarkdown } from "@/lib/editor/markdown";
import { isSafeUrl } from "@/lib/editor/sanitize";

interface RichTextEditorProps {
  value: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write documentation content...",
}: RichTextEditorProps) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkValue, setLinkValue] = useState("");
  const [imageOpen, setImageOpen] = useState(false);
  const [imageValue, setImageValue] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false, autolink: true, defaultProtocol: "https" }),
      Image.configure({ allowBase64: false }),
      Placeholder.configure({ placeholder }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      CodeBlockExtension,
    ],
    content: markdownToHtml(value),
    editorProps: {
      attributes: {
        class: "rich-text-editor min-h-[18rem] px-5 py-4 outline-none",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(htmlToMarkdown(currentEditor.getHTML()));
    },
  });

  useEffect(() => {
    if (!editor) return;
    const currentMarkdown = htmlToMarkdown(editor.getHTML());
    if (currentMarkdown !== value) {
      editor.commands.setContent(markdownToHtml(value), { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) {
    return (
      <div className="min-h-[22rem] animate-pulse rounded-lg border border-border bg-background-alt" />
    );
  }

  const applyLink = () => {
    if (!isSafeUrl(linkValue)) return;
    if (linkValue) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkValue }).run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    setLinkOpen(false);
  };

  const applyImage = () => {
    if (!isSafeUrl(imageValue)) return;
    editor.chain().focus().setImage({ src: imageValue }).run();
    setImageOpen(false);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface">
      <EditorToolbar
        editor={editor}
        onInsertLink={() => {
          setLinkValue(editor.getAttributes("link").href ?? "");
          setLinkOpen(true);
        }}
        onInsertImage={() => setImageOpen(true)}
      />
      <BubbleMenu
        editor={editor}
        className="flex items-center gap-1 rounded-lg border border-border bg-surface p-1 shadow-lg"
      >
        <button type="button" aria-label="Bold" onClick={() => editor.chain().focus().toggleBold().run()} className="rounded p-1.5 hover:bg-background-alt">
          <b>B</b>
        </button>
        <button type="button" aria-label="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} className="rounded p-1.5 hover:bg-background-alt">
          <i>I</i>
        </button>
        <button type="button" aria-label="Link" onClick={() => setLinkOpen(true)} className="rounded px-2 py-1 text-xs hover:bg-background-alt">
          Link
        </button>
      </BubbleMenu>
      <EditorContent editor={editor} />

      {linkOpen && (
        <div className="border-t border-border p-3">
          <label className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center">
            <span className="font-medium">Link URL</span>
            <input
              autoFocus
              value={linkValue}
              onChange={(event) => setLinkValue(event.target.value)}
              placeholder="https://example.com"
              className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary"
            />
            <button type="button" onClick={applyLink} className="rounded-lg bg-primary px-3 py-2 font-semibold text-white">
              Apply
            </button>
            <button type="button" onClick={() => setLinkOpen(false)} className="rounded-lg border border-border px-3 py-2">
              Cancel
            </button>
          </label>
        </div>
      )}

      {imageOpen && (
        <div className="border-t border-border p-3">
          <label className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center">
            <span className="font-medium">Image URL</span>
            <input
              autoFocus
              value={imageValue}
              onChange={(event) => setImageValue(event.target.value)}
              placeholder="https://example.com/image.png"
              className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-primary"
            />
            <button type="button" onClick={applyImage} className="rounded-lg bg-primary px-3 py-2 font-semibold text-white">
              Insert
            </button>
            <button type="button" onClick={() => setImageOpen(false)} className="rounded-lg border border-border px-3 py-2">
              Cancel
            </button>
          </label>
        </div>
      )}
    </div>
  );
}
