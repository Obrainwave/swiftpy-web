import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import CodeBlockView from "./CodeBlockView";

export const CodeBlockExtension = Node.create({
  name: "codeBlock",
  group: "block",
  code: true,
  defining: true,

  addAttributes() {
    return {
      language: {
        default: "plaintext",
        parseHTML: (element) =>
          element.getAttribute("data-language") ??
          element.querySelector("code")?.getAttribute("class")?.replace(/^language-/, "") ??
          "plaintext",
        renderHTML: (attributes) => ({ "data-language": attributes.language }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "pre" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["pre", mergeAttributes(HTMLAttributes), ["code", 0]];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockView);
  },

  addCommands() {
    return {
      setCodeBlock:
        (attributes: { language?: string } = {}) =>
        ({ commands }) =>
          commands.setNode(this.name, attributes),
    };
  },
});
