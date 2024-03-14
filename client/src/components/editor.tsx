import { createPlugins, Plate, PlateLeaf } from '@udecode/plate-common';
import { createParagraphPlugin, ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import { createHeadingPlugin } from '@udecode/plate-heading';
import { createLinkPlugin } from '@udecode/plate-link';
import { createImagePlugin, createMediaEmbedPlugin, ELEMENT_IMAGE, ELEMENT_MEDIA_EMBED } from '@udecode/plate-media';
import { createMentionPlugin, ELEMENT_MENTION, ELEMENT_MENTION_INPUT } from '@udecode/plate-mention';
import {
    createBoldPlugin,
    createItalicPlugin,
    createUnderlinePlugin,
    createStrikethroughPlugin,
    MARK_SUPERSCRIPT,
    MARK_UNDERLINE,
    MARK_SUBSCRIPT, MARK_STRIKETHROUGH, MARK_ITALIC, MARK_BOLD
} from '@udecode/plate-basic-marks';
import { createFontColorPlugin, createFontBackgroundColorPlugin, createFontSizePlugin } from '@udecode/plate-font';
import { createHighlightPlugin } from '@udecode/plate-highlight';
import { createAlignPlugin } from '@udecode/plate-alignment';
import { createIndentPlugin } from '@udecode/plate-indent';
import { createIndentListPlugin } from '@udecode/plate-indent-list';
import { createLineHeightPlugin } from '@udecode/plate-line-height';
import { createAutoformatPlugin } from '@udecode/plate-autoformat';
import { createNodeIdPlugin } from '@udecode/plate-node-id';
import { createResetNodePlugin } from '@udecode/plate-reset-node';
import { createDeletePlugin } from '@udecode/plate-select';
import { createSoftBreakPlugin } from '@udecode/plate-break';
import { createTabbablePlugin } from '@udecode/plate-tabbable';
import { createTrailingBlockPlugin } from '@udecode/plate-trailing-block';

import { MediaEmbedElement } from '@/components/plate-ui/media-embed-element';
import { MentionElement } from '@/components/plate-ui/mention-element';
import { MentionInputElement } from '@/components/plate-ui/mention-input-element';
import { Editor } from "@/components/plate-ui/editor.tsx";
import { autoformatMarks } from "@/components/editor/format-rules.ts";
import { withProps } from '@udecode/cn';
import { ImageElement } from "@/components/plate-ui/image-element.tsx";

export const plugins = createPlugins(
    [
        createParagraphPlugin(),
        createHeadingPlugin(),
        createLinkPlugin(),
        createImagePlugin(),
        createMediaEmbedPlugin(),
        createMentionPlugin(),
        createBoldPlugin(),
        createItalicPlugin(),
        createUnderlinePlugin(),
        createStrikethroughPlugin(),
        createFontColorPlugin(),
        createFontBackgroundColorPlugin(),
        createFontSizePlugin(),
        createHighlightPlugin(),
        createAlignPlugin({
            inject: {
                props: {
                    validTypes: [
                        ELEMENT_PARAGRAPH,
                        // ELEMENT_H1, ELEMENT_H2, ELEMENT_H3
                    ],
                },
            },
        }),
        createIndentPlugin({
            inject: {
                props: {
                    validTypes: [
                        ELEMENT_PARAGRAPH,
                        // ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, ELEMENT_BLOCKQUOTE, ELEMENT_CODE_BLOCK
                    ],
                },
            },
        }),
        createIndentListPlugin({
            inject: {
                props: {
                    validTypes: [
                        ELEMENT_PARAGRAPH,
                        // ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, ELEMENT_BLOCKQUOTE, ELEMENT_CODE_BLOCK
                    ],
                },
            },
        }),
        createLineHeightPlugin({
            inject: {
                props: {
                    defaultNodeValue: 1.5,
                    validNodeValues: [1, 1.2, 1.5, 2, 3],
                    validTypes: [
                        ELEMENT_PARAGRAPH,
                        // ELEMENT_H1, ELEMENT_H2, ELEMENT_H3
                    ],
                },
            },
        }),
        createAutoformatPlugin({
            options: {
                rules: [
                    ...autoformatMarks
                ],
                enableUndoOnDelete: true,
            },
        }),
        createNodeIdPlugin(),
        createResetNodePlugin({
            options: {
                rules: [
                    // Usage: https://platejs.org/docs/reset-node
                ],
            },
        }),
        createDeletePlugin(),
        createSoftBreakPlugin({
            options: {
                rules: [
                    { hotkey: 'shift+enter' },
                    {
                        hotkey: 'enter',
                        query: {
                            allow: [
                                // ELEMENT_CODE_BLOCK, ELEMENT_BLOCKQUOTE, ELEMENT_TD
                            ],
                        },
                    },
                ],
            },
        }),
        createTabbablePlugin(),
        createTrailingBlockPlugin({
            options: { type: ELEMENT_PARAGRAPH },
        }),
    ],
    {
        components: {
            [ELEMENT_IMAGE]: ImageElement,
            // [ELEMENT_H1]: withProps(HeadingElement, { variant: 'h1' }),
            // [ELEMENT_H2]: withProps(HeadingElement, { variant: 'h2' }),
            // [ELEMENT_H3]: withProps(HeadingElement, { variant: 'h3' }),
            // [ELEMENT_H4]: withProps(HeadingElement, { variant: 'h4' }),
            // [ELEMENT_H5]: withProps(HeadingElement, { variant: 'h5' }),
            // [ELEMENT_H6]: withProps(HeadingElement, { variant: 'h6' }),
            [ELEMENT_MEDIA_EMBED]: MediaEmbedElement,
            [ELEMENT_MENTION]: MentionElement,
            [ELEMENT_MENTION_INPUT]: MentionInputElement,
            [MARK_BOLD]: withProps(PlateLeaf, { as: 'strong' }),
            [MARK_ITALIC]: withProps(PlateLeaf, { as: 'em' }),
            [MARK_STRIKETHROUGH]: withProps(PlateLeaf, { as: 's' }),
            [MARK_SUBSCRIPT]: withProps(PlateLeaf, { as: 'sub' }),
            [MARK_SUPERSCRIPT]: withProps(PlateLeaf, { as: 'sup' }),
            [MARK_UNDERLINE]: withProps(PlateLeaf, { as: 'u' }),
        },
    }
);


export function PlateEditor() {
    return (
        <Plate plugins={plugins}>
            <Editor placeholder="Type your message here." />
        </Plate>
    );
}
