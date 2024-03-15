import tippy from "tippy.js";
import { ReactRenderer } from "@tiptap/react";
import CommandList from "./command-list.tsx";

const commands = [
    {
        "id": "play",
        "description": "Play a song",
        command: () => {
            console.log("Play a song");
        }
    },
    {
        "id": "roll",
        "description": "Roll a dice",
        command: () => {
            console.log("Roll a dice");
        }
    }
]

export default {
    items: ({ query }: { query: string }) => {
        return [
            ...commands
        ]
            .filter((item) => item.id.toLowerCase().startsWith(query.toLowerCase()))
            .slice(0, 10);
    },

    render: () => {
        let component: any;
        let popup: any;

        return {
            onStart: (props: any) => {
                component = new ReactRenderer(CommandList, {
                    props,
                    editor: props.editor,
                });

                popup = tippy("body", {
                    getReferenceClientRect: props.clientRect,
                    appendTo: () => document.body,
                    content: component.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: "manual",
                    placement: "bottom-start",
                });
            },
            onUpdate(props: any) {
                component.updateProps(props);

                popup[0].setProps({
                    getReferenceClientRect: props.clientRect,
                });
            },
            onKeyDown(props: any) {
                if (props.event.key === "Escape") {
                    popup[0].hide();

                    return true;
                }

                return component.ref?.onKeyDown({
                    ...props,
                    component: component.element,
                });
            },
            onExit() {
                popup[0].destroy();
                component.destroy();
            },
        };
    },
};
