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

interface MarkdownEditorProps {
    headline: string;
  markdown: string;
  editorRef?: React.RefObject<MDXEditorMethods | null>;
  onChange?: Function
}

export default function MarkdownEditor({ 
  markdown = '',
  editorRef,
  headline,
}: MarkdownEditorProps) {
    return (
        <div>
            <form>
                <input value={headline} placeholder="Enter headline" className="headline-input"/>
                <MDXEditor
                    onChange={(e) => console.log(e)}
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