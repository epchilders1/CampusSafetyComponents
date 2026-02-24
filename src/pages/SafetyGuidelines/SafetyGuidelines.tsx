import './SafetyGuidelines.css';
import {Toaster, toast} from "react-hot-toast"
import MarkdownEditor from '../../_components/MarkdownEditor/MarkdownEditor';
import type { MarkdownEditorProps } from '../../_components/MarkdownEditor/MarkdownEditor';
import { useState, useRef, useEffect, useCallback } from 'react';
import type { MDXEditorMethods } from '@mdxeditor/editor';
import DOMPurify from 'dompurify';
import HeroImageEditor from '../../_components/HeroImageEditor/HeroImageEditor';
import Image from '../../_components/Image/Image';
import Button from '../../_components/Button/Button';
import { SaveIcon, Trash } from 'lucide-react';

interface SafetyGuidelinesProps {
    markdownInfo: MarkdownEditorProps;
    heroImage?: string;
}
const STORAGE_KEY = "safety_guidelines";


export default function SafetyGuidelines(props:SafetyGuidelinesProps){
    const {markdownInfo, } = props;
    const editorRef = useRef<MDXEditorMethods>(null);
    const debounceTimerRef = useRef<NodeJS.Timeout>(null);
    const [htmlContent, setHtmlContent] = useState<string | null>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [heroImage, setHeroImage] = useState<string | null>(props.heroImage || null);

    const [headline, setHeadline] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            return parsed.headline || markdownInfo.headline;
        }
        return markdownInfo.headline || "";
    });
    
    const [markdown, setMarkdown] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            return parsed.markdown || markdownInfo.markdown;
        }
        return markdownInfo.markdown || "";
    });

        const handleMarkdownChange = useCallback((newMarkdown: string) => {
    if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
            const html = getHTMLContent();
            if (html) {
                setHtmlContent(DOMPurify.sanitize(html));
            }
            setMarkdown(newMarkdown);
        }, 300);
    }, []);
    const getHTMLContent = () => {
        if (editorRef.current) {
            const markdown = editorRef.current.getContentEditableHTML();
            return markdown;
        }
    };
    const normalizeMarkdown = (md: string) => {
        return md
            .replace(/^\* /gm, '- ') 
            .trim();
    };

    const handleHeadlineChange = useCallback((newHeadline: string) => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = setTimeout(() => {
            setHeadline(newHeadline);
        }, 300);
    }, []);

    const handleSaveChanges = () => {
        localStorage.removeItem(STORAGE_KEY);
        toast.success("Changes saved successfully!");
    }

    const handleDiscardChanges = () => {
        localStorage.removeItem(STORAGE_KEY);
        setMarkdown(markdownInfo.markdown);
        setHeadline(markdownInfo.headline);
        if (editorRef.current) {
            editorRef.current.setMarkdown(markdownInfo.markdown);
        }
        handleMarkdownChange(markdownInfo.markdown);
        toast.success("Changes discarded successfully!");
    }


    const handleSaveHeroImage = async (file: File | null) => {
        try{

            // Some sort of procedure to save file to cloud storage, archive previous file etc.
            setHeroImage(file ? URL.createObjectURL(file) : null);
        }
        catch(error){
        if(error instanceof Error){
            throw new Error(`Failed to save ${file?.name}. ${error.message}`);
        }
        }
    };

    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);
    useEffect(() => {
        const html = getHTMLContent();
        if (html) {
            setHtmlContent(DOMPurify.sanitize(html));
        }
    }, []);
    useEffect(() => {
        const draft = { headline, markdown };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    }, [headline, markdown]);

    useEffect(() => {
        const normalizedCurrent = normalizeMarkdown(markdown);
        const normalizedOriginal = normalizeMarkdown(markdownInfo.markdown);
        
        const isDifferent = 
            headline !== markdownInfo.headline || 
            normalizedCurrent !== normalizedOriginal ||
            heroImage !== props.heroImage;
        
        setHasChanges(isDifferent);
    }, [headline, markdown, markdownInfo, heroImage]);
    return(
        <div className="safety-guidelines-container">
            <Toaster/>
            <h1>Safety Guidelines Page</h1>
            <div className="content">
                <div className="input-section">
                    <div className="hero-image-editor-wrapper">
                        <HeroImageEditor 
                            currentImage={heroImage}
                            saveImage={handleSaveHeroImage}
                        />
                    </div>
                    <MarkdownEditor 
                        editorRef={editorRef} 
                        headline={headline}
                        markdown={markdown} 
                        onChange={handleMarkdownChange}
                        onHeadlineChange={handleHeadlineChange}
                    />
                </div>
                <div className="divider"></div>
                <div className="preview-section">
                    <div className="preview-box">
                        <Image src={heroImage || undefined} alt="Hero Image" size={500}/>
                        <h1>{headline}</h1>
                        <div className="preview-separator"/>
                        <div className="markdown-preview">
                        {htmlContent && (
                            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                        )}
                        </div>
                    </div>
                                    {hasChanges && (
                    <div className="save-section">
                        <Button variant='red' rounded={true} size="small" onClick={handleDiscardChanges}>
                            <div className="save-button">
                                <Trash />
                                <p>Discard</p>
                            </div>
                        </Button>
                        <Button variant='blue' rounded={true} size="small" onClick={handleSaveChanges}>
                            <div className="save-button">
                                <SaveIcon />
                                <p>Save</p>
                            </div>
                        </Button>
                    </div>
                )}
                </div>
            </div>
        </div>
    );
}