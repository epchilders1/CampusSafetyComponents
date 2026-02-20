import './CampusNow.css';
import MarkdownEditor from '../../_components/MarkdownEditor/MarkdownEditor';
import type { MarkdownEditorProps } from '../../_components/MarkdownEditor/MarkdownEditor';
import Input from '../../_components/Input/Input';
import InputDropDown from '../../_components/InputDropdown/InputDropdown';
import Button from '../../_components/Button/Button';
import {useState, useEffect, useRef, useCallback} from 'react';
import type { MDXEditorMethods } from '@mdxeditor/editor';
import DOMPurify from 'dompurify';
import { SaveIcon, Trash } from 'lucide-react';
import {Toaster, toast} from "react-hot-toast"
interface CampusNowProps{

    markdownInfo:MarkdownEditorProps;
    forecastOptions:{
        showTodaysForecast: boolean;
        show7DayForecast: boolean;
    }
}

const STORAGE_KEY = "campus_now";

export default function CampusNow(props: CampusNowProps){
    const {markdownInfo, forecastOptions} = props;

    const editorRef = useRef<MDXEditorMethods>(null);
    const debounceTimerRef = useRef<NodeJS.Timeout>(null);
    
    const [showTodaysForecast, setShowTodaysForecast] = useState(forecastOptions.showTodaysForecast);
    const [show7DayForecast, setShow7DayForecast] = useState(forecastOptions.show7DayForecast);
    const [htmlContent, setHtmlContent] = useState<string | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

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

    const sampleDropdownItems=[
        {id: "1", value: 1},
        {id: "2", value: 2}
    ]
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
        setMarkdown(markdownInfo.markdown);
        setHeadline(markdownInfo.headline);
        toast.success("Changes discarded successfully!");
    }

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
            showTodaysForecast !== forecastOptions.showTodaysForecast ||
            show7DayForecast !== forecastOptions.show7DayForecast;
        
        setHasChanges(isDifferent);
    }, [headline, markdown, markdownInfo, forecastOptions, showTodaysForecast, show7DayForecast]);

    return(
        <div className="campus-now-container">
            <Toaster/>
            <h1>Campus Now Editor</h1>
            <div className="content">
                <div className="input-section">
                    <Input onChange={setShowTodaysForecast} value={showTodaysForecast} type="checkbox" label="Today's Forecast"/>
                    <Input onChange={setShow7DayForecast} value={show7DayForecast} type="checkbox" label="7 Day Forecast"/>
                    <InputDropDown label="Minimum Visible Notification Priority" includeNoneOption={true} options={sampleDropdownItems}/>
                    <Input type="number" label="Maximum Visible Alerts"/>
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
                            <div className="weather-container">
                                {showTodaysForecast && (
                                    <p>This is where today's forecast would go</p>
                                )}
                                {show7DayForecast &&(
                                    <p>This is where the 7 day forecast would go</p>
                                )}
                                <h1>{headline}</h1>
                                <div className="preview-separator"/>
                                <div className="markdown-preview">
                                {htmlContent && (
                                    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                                )}
                                </div>
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