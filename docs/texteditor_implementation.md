# Implementation Plan — Tiptap Editor for Next.js

## Objective

Implement a professional, extensible content editor in our existing Next.js application using **Tiptap**.

The editor must support rich-text editing, Markdown compatibility, programming code blocks, and professional content rendering suitable for a modern blogging, documentation, educational, and technical publishing platform.

Do not build a basic editor demo. This should be a reusable, production-quality content editing system.

## 1. Initial Assessment

Before writing any code:

- Inspect the existing Next.js project structure.
- Identify the Next.js version, React version, TypeScript configuration, styling system, existing UI components, and dependencies.
- Identify existing content creation/editing flows, API integrations, and content storage format.
- Check for existing editor, Markdown, syntax highlighting, and rendering packages to avoid unnecessary duplication.
- Respect the project's existing architecture, naming conventions, and UI design.
- Provide a brief implementation plan before making changes.

Do not unnecessarily modify unrelated components or dependencies.

## 2. Technology Stack

Use the following technologies where appropriate:

- **Tiptap** — rich-text editor framework.
- **React** — editor UI and integration.
- **TypeScript** — strict typing.
- **CodeMirror** — code editing inside code blocks, including language selection and editing experience.
- **Shiki** — syntax highlighting for published content.
- **Tailwind CSS** — styling, if already configured in the project.
- **Tailwind Typography** — professional article typography using `prose`, if compatible with the existing styling setup.
- **Markdown** — import, export, and portable content representation.

Use compatible package versions and verify peer dependencies before installation.

## 3. Editor Architecture

Build the editor as reusable components rather than putting all functionality into one large component.

Suggested structure (adapt to the existing project structure):

```text
src/
├── components/
│   └── editor/
│       ├── RichTextEditor.tsx
│       ├── EditorToolbar.tsx
│       ├── EditorMenuBar.tsx
│        ├── EditorBubbleMenu.tsx
│       ├── EditorSlashMenu.tsx
│       ├── EditorContent.tsx
│       ├── extensions/
│       │   ├── editor-extensions.ts
│       │   ├── CodeBlockExtension.ts
│       │   └── SlashCommandExtension.ts
│       └── nodes/
│           ├── CodeBlockNode.tsx
│           └── ImageNode.tsx
├── lib/
│   └── editor/
│       ├── markdown.ts
│       ├── html.ts
│       ├── shiki.ts
│       └── editor-config.ts
└── styles/
    └── editor.css
```

This is a proposed structure, not a requirement to blindly create all these files. Keep the implementation modular without overengineering.

## 4. Rich-Text Features

Implement support for the following editing capabilities.

### Text formatting

- Bold
- Italic
- Underline
- Strikethrough
- Inline code
- Text alignment
- Text formatting shortcuts

### Headings

- Heading 1
- Heading 2
- Heading 3
- Heading 4
- Paragraph

### Content blocks

- Bullet lists
- Numbered lists
- Nested lists
- Blockquotes
- Horizontal rules
- Tables
- Links
- Images
- Code blocks

### Editing experience

- Undo and redo
- Keyboard shortcuts
- Placeholder when the editor is empty
- Selection-aware formatting
- Bubble menu for selected text
- Responsive toolbar
- Clean paste behavior
- Link insertion/editing
- Image insertion through a reusable interface
- Table editing controls
- Accessible tooltips and labels

Toolbar buttons must correctly reflect the current selection and active formatting state.

## 5. Markdown Support

Markdown is an important requirement.

Implement reliable Markdown import and export.

The editor should:

- Accept existing Markdown content.
- Convert Markdown into editable content.
- Export edited content back to Markdown.
- Preserve headings, paragraphs, lists, links, blockquotes, tables, images, inline code, fenced code blocks, and other supported structures.
- Avoid unnecessary formatting changes when importing and exporting.
- Handle empty content correctly.
- Avoid silently dropping unsupported content.

Provide clear separation between Markdown conversion logic and editor components.

Do not assume that HTML output is equivalent to Markdown output.

If Tiptap Markdown functionality is experimental or beta in the selected version, assess the risks and implement a stable, tested conversion strategy.

## 6. Code Block System

Code blocks are a major feature and must receive special attention.

Implement a professional code block experience for technical content.

### Editor code blocks

Each code block should support:

- Language selection.
- Common programming languages such as Python, JavaScript, TypeScript, PHP, Java, C, C++, C#, Go, Rust, SQL, Bash, JSON, HTML, CSS, TSX, JSX and others.
- Code editing without disrupting the surrounding editor.
- Monospaced font.
- Appropriate indentation.
- Tab handling.
- Horizontal scrolling.
- A clean dark editor surface.
- Optional line numbers.
- Language label.
- Consistent spacing and border radius.

Integrate CodeMirror where appropriate to provide a proper code editing experience.

Do not use a plain textarea as the final code editing experience.

### Published code blocks

The published article renderer must use Shiki or an equivalent high-quality syntax highlighting engine.

Code blocks should visually include:

- Dark background.
- Syntax-highlighted code.
- Language label in the header.
- Copy-code button.
- Optional line numbers.
- Horizontal scrolling.
- Professional spacing and typography.
- Responsive behavior on mobile.
- Consistent appearance across programming languages.

Syntax highlighting must not depend on the editor being mounted.

The published content renderer should be independently usable on article pages, documentation pages, previews, and other read-only content surfaces.

## 7. Published Content Renderer

Create a dedicated rendering system for published content.

Do not reuse the editor's editable DOM or toolbar as the published content view.

The published renderer must support:

- Proper typography.
- Headings and anchor compatibility.
- Paragraph spacing.
- Lists and nested lists.
- Blockquotes.
- Tables.
- Images.
- Links.
- Inline code.
- Code blocks with syntax highlighting.
- Horizontal rules.
- Responsive content layout.
- Dark and light themes if the existing application supports them.

Use Tailwind Typography or a comparable styling solution if compatible with the project.

Ensure article content is readable on mobile, tablet, and desktop.

## 8. Security

Treat editor content as untrusted input.

- Sanitize HTML when importing or rendering HTML.
- Prevent XSS.
- Do not execute embedded scripts or arbitrary HTML.
- Validate URLs used in links and images.
- Avoid unsafe `dangerouslySetInnerHTML` usage unless sanitized and necessary.
- Ensure Markdown parsing and code highlighting do not execute user content.
- Consider security implications of image URLs and pasted content.

Security must be considered for both editing and published rendering.

## 9. Performance

- Use client-side rendering only where required by Tiptap.
- Avoid unnecessary re-renders.
- Avoid recreating editor extensions on every render.
- Lazy-load heavy editor dependencies where appropriate.
- Ensure Shiki highlighting does not block initial article rendering unnecessarily.
- Avoid loading all language grammars if they are not needed.
- Keep published article rendering compatible with Next.js server rendering.

## 10. Integration

Integrate the editor into the existing content creation and editing flow.

Support:

- Creating new content.
- Editing existing content.
- Initial content loading.
- Markdown loading.
- Markdown output.
- Saving changes.
- Handling empty content.
- Handling loading and saving states.
- Error handling.
- Dirty-state tracking where appropriate.

Do not implement fake saving behavior. Use the project's existing API and state management patterns. If the API is not yet available, create a clearly isolated integration interface without inventing endpoints.

## 11. User Interface Quality

The editor should feel like a modern professional writing application.

Avoid:

- Overcrowded toolbars.
- Excessive buttons.
- Poor spacing.
- Default browser styling.
- Unstyled code blocks.
- Unnecessary borders everywhere.
- Editor content being too narrow.
- Toolbar controls that do not work.

Prefer:

- Clean toolbar grouping.
- Subtle borders.
- Good whitespace.
- Consistent icons.
- Responsive layout.
- Keyboard accessibility.
- Clear hover and active states.
- Professional visual hierarchy.

Use the existing project's UI component library and icon library if available. Avoid introducing new UI dependencies without a reason.

## 12. Testing and Verification

After implementation:

- Verify all formatting controls.
- Verify headings.
- Verify lists and nested lists.
- Verify tables.
- Verify links and images.
- Verify Markdown import.
- Verify Markdown export.
- Verify code blocks and language selection.
- Verify code block editing.
- Verify syntax highlighting for multiple languages.
- Verify copy-code behavior.
- Verify empty editor state.
- Verify existing content editing.
- Verify responsive behavior.
- Verify dark/light mode where supported.
- Verify XSS handling.
- Run linting, type checking, and existing tests.

Fix errors introduced by the implementation.

## 13. Implementation Rules

1. Do not replace existing architecture unnecessarily.
2. Do not create duplicate components or utilities.
3. Do not install packages blindly; verify compatibility first.
4. Do not leave nonfunctional toolbar buttons.
5. Do not use mock content as the actual integration.
6. Do not sacrifice Markdown portability.
7. Do not mix editor logic, Markdown conversion, and published rendering into one component.
8. Do not leave unfinished TODOs for essential features.
9. Do not compromise security for convenience.
10. Prefer maintainable, reusable, typed implementations over shortcuts.

## 14. Deliverables

Upon completion, provide:

- Summary of the architecture implemented.
- Files created and modified.
- Dependencies added and their purpose.
- Editor features implemented.
- Markdown strategy and limitations.
- Code block editing and highlighting strategy.
- Published renderer implementation.
- Integration details.
- Testing and validation results.
- Remaining limitations, if any.

Implement this incrementally. First assess the existing application, then present the plan, and proceed with implementation without changing unrelated areas.

The final result must be a reusable, polished, production-quality editing system—not a simple rich-text input.
