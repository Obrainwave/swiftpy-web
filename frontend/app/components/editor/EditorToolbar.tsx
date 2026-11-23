"use client";

import type { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Table,
  Underline,
  Undo2,
} from "lucide-react";

interface EditorToolbarProps {
  editor: Editor;
  onInsertLink: () => void;
  onInsertImage: () => void;
}

function ToolButton({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-md p-2 transition ${
        active
          ? "bg-primary/12 text-primary"
          : "text-foreground-muted hover:bg-background-alt hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

export function EditorToolbar({ editor, onInsertLink, onInsertImage }: EditorToolbarProps) {
  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 border-b border-border bg-surface p-2">
      <ToolButton label="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
        <Undo2 className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
        <Redo2 className="h-4 w-4" />
      </ToolButton>
      <span className="mx-1 h-5 w-px bg-border" />
      <ToolButton label="Heading 1" active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
        <Heading1 className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <Heading2 className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        <Heading3 className="h-4 w-4" />
      </ToolButton>
      <span className="mx-1 h-5 w-px bg-border" />
      <ToolButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <Underline className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <Strikethrough className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Inline code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
        <Code2 className="h-4 w-4" />
      </ToolButton>
      <span className="mx-1 h-5 w-px bg-border" />
      <ToolButton label="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Blockquote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <Minus className="h-4 w-4" />
      </ToolButton>
      <span className="mx-1 h-5 w-px bg-border" />
      <ToolButton label="Align left" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
        <AlignLeft className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Align center" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
        <AlignCenter className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Align right" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
        <AlignRight className="h-4 w-4" />
      </ToolButton>
      <span className="mx-1 h-5 w-px bg-border" />
      <ToolButton label="Insert link" active={editor.isActive("link")} onClick={onInsertLink}>
        <LinkIcon className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Insert image" onClick={onInsertImage}>
        <ImageIcon className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Insert code block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().setNode("codeBlock", { language: "plaintext" }).run()}>
        <Code2 className="h-4 w-4" />
      </ToolButton>
      <ToolButton label="Insert table" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
        <Table className="h-4 w-4" />
      </ToolButton>
      {editor.isActive("table") && (
        <>
          <ToolButton label="Add column before" onClick={() => editor.chain().focus().addColumnBefore().run()}>CB</ToolButton>
          <ToolButton label="Add column after" onClick={() => editor.chain().focus().addColumnAfter().run()}>CA</ToolButton>
          <ToolButton label="Add row before" onClick={() => editor.chain().focus().addRowBefore().run()}>RB</ToolButton>
          <ToolButton label="Delete row" onClick={() => editor.chain().focus().deleteRow().run()}>DR</ToolButton>
          <ToolButton label="Delete table" onClick={() => editor.chain().focus().deleteTable().run()}>DT</ToolButton>
        </>
      )}
    </div>
  );
}
