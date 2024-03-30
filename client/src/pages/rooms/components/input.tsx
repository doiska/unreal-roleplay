import {
  Editor,
  EditorContent,
  useEditor
} from "@tiptap/react";
import { History } from "@tiptap/extension-history";
import { Document } from "@tiptap/extension-document";
import { Text } from "@tiptap/extension-text";
import { Paragraph } from "@tiptap/extension-paragraph";
import { HardBreak } from "@tiptap/extension-hard-break";
import {
  Extension,
} from "@tiptap/core";
import Commands from "@/pages/rooms/components/editor/slash/commands.ts";
import suggestion from "@/pages/rooms/components/editor/slash/suggestion.ts";
import { AddImagePrompt } from "@/pages/rooms/components/add-image-prompt.tsx";
import { Image as ImageExtension } from "@tiptap/extension-image";

// const OneLiner = Node.create({
//   name: "oneLiner",
//   topNode: true,
//   content: "block",
// });

const KeyboardHandler = Extension.create({
  name: "keyboardHandler",
  addKeyboardShortcuts() {
    return {
      Enter: () => {
        if ("onKeyPressed" in this.options) {
          this.options.onKeyPressed(this.editor);
        }

        return this.editor.commands.clearContent();
      },
      "Shift-Enter": () => {
        return this.editor.commands.setHardBreak();
      }
    };
  }
});

export const CustomImage = ImageExtension.extend({
  name: "custom-image",
  parseHTML() {
    return [
      {
        tag: "custom-image",
      }
    ];
  },
});

export const extensions = [
  //OneLiner,
  Paragraph.configure(),
  Text.configure(),
  Document.configure(),
  History.configure({
    depth: 10,
  }),
  CustomImage.configure({
    inline: true,
    HTMLAttributes: {
      class: "h-48 w-auto rounded-md"
    }
  }),
  HardBreak.configure(),
  Commands.configure({
    suggestion,
  }),
];

export const RichTextEditor = ({ handleSubmit }: {
  handleSubmit: (text: string, type: "command" | "message") => void
}) => {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: "h-full w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-auto"
      }
    },
    extensions: [
      ...extensions,
      KeyboardHandler.configure({
        onKeyPressed: (editor: Editor) => {
          const firstCommand = editor.getText();
          const isCommand = firstCommand?.trim().startsWith("/");

          if(isCommand) {
            handleSubmit(firstCommand, "command");
          } else {
            handleSubmit(JSON.stringify(editor.getJSON()), "message");
          }
        }
      }),
    ],
    content: "<div></div>",
  });

  if (!editor) {
    return null;
  }

  return (
      <div className="relative flex gap-2 w-full h-full">
        <EditorContent
            className="flex-1"
            editor={editor}
        />
        <AddImagePrompt
            handleSubmit={image => {
              editor.chain()
                  .focus()
                  .setImage({ src: image })
                  .run();
            }}
        />
      </div>
  );
};
