"use client";
import { useState, useEffect } from "react";
import "./TextArea.css"

interface TextAreaProps{
    id?: string;
    value?: any;
    autoFocus?: boolean;
    label?: string;
    placeHolder?: string;
    onChange?: (value: any) => void;
    lockXExpansion?: boolean;
    lockYExpansion?: boolean;
}

export default function TextArea(props: TextAreaProps){
    const {
           id,
           value,
           autoFocus = false,
           label, 
           placeHolder, 
           onChange,
           lockXExpansion = false,
           lockYExpansion = false
        } = props;
       const [inputValue, setInputValue] = useState(value || "");
   
       useEffect(() => {
           setInputValue(value || "");
       }, [value]);
   
       const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
           const newValue = e.target.value;
           setInputValue(newValue);
           if (onChange) {
               onChange(newValue);
           }
       };
   
   
       return (
           <div className="input-container">
                   <label
                       htmlFor={id}
                       className="input-label"
                   >
                       {label}
                   </label>
                   <textarea
                       id={id}
                       name={id}
                       placeholder={placeHolder}
                       className={`input-field peer ${lockXExpansion && 'no-resize-x'} ${lockYExpansion && 'no-resize-y'}`}
                       value={inputValue}
                       onChange={handleChange}
                       autoFocus={autoFocus}
                   />
           </div>
       );
}