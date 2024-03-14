import { PlateEditor, plugins } from "@/components/editor.tsx";
import { Plate } from "@udecode/plate-common";
import { Editor } from "@/components/plate-ui/editor.tsx";

const commands = [
    "/skip",
    "/pause",
    "/resume",
    "/queue",
    "/volume",
    "/clear",
    "/roll",
    "/play"
]


export function InputCommand() {
    return (
        <Plate plugins={plugins} onChange={console.log} normalizeInitialValue={true}>
            <Editor
                placeholder="Type your message here."
                variant="outline"
                size="md"
            />
        </Plate>
    );
}
