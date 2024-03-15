import { EditorContent, useEditor } from "@tiptap/react";
import { History } from "@tiptap/extension-history";
import { Document } from '@tiptap/extension-document'
import { Text } from '@tiptap/extension-text'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Node } from "@tiptap/core";
import Commands from "@/pages/rooms/components/editor/slash/commands.ts";
import suggestion from "@/pages/rooms/components/editor/slash/suggestion.ts";

const OneLiner = Node.create({
    name: "oneLiner",
    topNode: true,
    content: "block",
});

const RichTextEditor = () => {
    const editor = useEditor({
        editorProps: {
            attributes: {
                class:
                    "h-full w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-auto",
            },
        },
        extensions: [
            //OneLiner,
            Paragraph.configure(),
            Text.configure(),
            Document.configure(),
            History.configure({
                depth: 10,
            }),
            Commands.configure({
                suggestion,
            }),
        ],
        content: "<h1>Teste</h1>",
    });

    if(!editor) {
        return null
    };

    return (
        <div className="relative w-full h-full">
            <EditorContent editor={editor}  />
        </div>
    );
};


export { RichTextEditor as InputCommand}
