"use client"
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  tablePlugin,
  MDXEditor,
  type MDXEditorMethods,
} from '@mdxeditor/editor'

import {
    BlockTypeSelect,
  BoldItalicUnderlineToggles,
  StrikeThroughSupSubToggles,
  UndoRedo,
  CreateLink,
  InsertTable,
  ListsToggle,
  InsertImage,
  Separator
} from '@mdxeditor/editor'

import '@mdxeditor/editor/style.css'
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
        <div>
            <form>
                <input onChange={handleChange} value={inputValue} placeholder="Enter headline" className="headline-input"/>
                <MDXEditor
                    onChange={(e) => onChange(e)}
                    ref={editorRef}
                    markdown={markdown}
                    plugins={[
                        toolbarPlugin({
                        toolbarContents: () => (
                            <>
                            <UndoRedo />
                            <BoldItalicUnderlineToggles />
                            <BlockTypeSelect />
                            <StrikeThroughSupSubToggles />
                            <Separator />
                            <CreateLink />
                            <InsertImage />
                            <InsertTable />
                            <ListsToggle />
                            </>
                        )
                        }),
                        headingsPlugin(), 
                        listsPlugin(), 
                        quotePlugin(), 
                        thematicBreakPlugin(), 
                        markdownShortcutPlugin(),
                        tablePlugin()
                    ]}
                />
            </form>
        </div>
    );
};