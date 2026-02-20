"use client"
import {useState, useEffect} from "react";
import "./Input.css";
interface InputProps {
    id?: string;
    value?: any;
    type?: string;
    autoFocus?: boolean;
    label?: string;
    placeHolder?: string;
    onChange?: (value: any) => void;
}

export default function Input(props: InputProps) {
    const {
        id,
        value,
        type = "text",
        autoFocus = false,
        label, 
        placeHolder, 
        onChange} = props;
    const [inputValue, setInputValue] = useState(value || "");

    useEffect(() => {
        setInputValue(value || "");
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = type === "checkbox" ? e.target.checked : e.target.value;
        setInputValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    const isCheckbox = type === "checkbox";

    return (
        <div className="input-container">
            {!isCheckbox && label && (
                <label
                    htmlFor={id}
                    className="input-label"
                >
                    {label}
                </label>
            )}
            <div className={isCheckbox ? "input-field-checkbox-wrapper" : ""}>
                {isCheckbox && label && (
                    <label
                        htmlFor={id}
                        className="input-label-checkbox"
                    >
                        {label}
                    </label>
                )}
                <input
                    id={id}
                    name={id}
                    placeholder={placeHolder}
                    className={isCheckbox ? "input-checkbox" : "input-field peer"}
                    value={type === "checkbox" ? undefined : inputValue}
                    checked={type === "checkbox" ? inputValue : undefined}
                    onChange={handleChange}
                    type={type}
                    autoFocus={autoFocus}
                />
            </div>
        </div>
    );
}