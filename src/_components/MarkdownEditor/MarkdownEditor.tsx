"use client";

import "@mdxeditor/editor/style.css";
import {
    MDXEditor,
    headingsPlugin,
    listsPlugin,
    quotePlugin,
    thematicBreakPlugin,
    markdownShortcutPlugin,
    linkPlugin,
    linkDialogPlugin,
    codeBlockPlugin,
    codeMirrorPlugin,
    imagePlugin,
    diffSourcePlugin,
    toolbarPlugin,
    BoldItalicUnderlineToggles,
    UndoRedo,
    BlockTypeSelect,
    CreateLink,
    ListsToggle,
    InsertThematicBreak,
    InsertImage,
    Separator,
    DiffSourceToggleWrapper,
} from "@mdxeditor/editor";

import {
  type MDXEditorMethods,
} from '@mdxeditor/editor'

import './MarkdownEditor.css';
import { useEffect, useState } from 'react';
export interface MarkdownEditorProps {
    headline: string;
    markdown: string;
    editorRef?: React.RefObject<MDXEditorMethods | null>;
    onChange: Function;
    onHeadlineChange?: Function;
}


export default function MarkdownEditor({ 
  markdown = '',
  editorRef,
  headline,
  onChange,
  onHeadlineChange,
}: MarkdownEditorProps) {
    const [inputValue, setInputValue] = useState(headline || "");
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        if (onHeadlineChange) {
            onHeadlineChange(newValue);
        }
    };
    useEffect(() => {
        setInputValue(headline);
    }, [headline]);
    return (
        <div style={{ width: '100%' }}>
            <form style={{ width: '100%' }}>
                <input onChange={handleChange} value={inputValue} placeholder="Enter headline" className="headline-input"/>
                <MDXEditor
                        className="markdown-editor"
                        markdown={markdown}
                        ref={editorRef}
                        onChange={(e) => onChange(e)}
                        plugins={[
                            toolbarPlugin({
                                toolbarContents: () => (
                                    <DiffSourceToggleWrapper>
                                        <UndoRedo />
                                        <Separator />
                                        <BoldItalicUnderlineToggles />
                                        <Separator />
                                        <BlockTypeSelect />
                                        <Separator />
                                        <ListsToggle />
                                        <Separator />
                                        <CreateLink />
                                        <InsertThematicBreak />
                                    </DiffSourceToggleWrapper>
                                ),
                            }),
                            headingsPlugin(),
                            listsPlugin(),
                            quotePlugin(),
                            thematicBreakPlugin(),
                            linkPlugin(),
                            linkDialogPlugin(),
                            diffSourcePlugin({ viewMode: "rich-text" }),
                            markdownShortcutPlugin(),
                        ]}
                    />
            </form>
        </div>
    );
};