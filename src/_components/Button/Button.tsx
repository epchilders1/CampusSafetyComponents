"use client";
import "./Button.css";

interface ButtonProps {
    variant?: string;
    size?: string;
    onClick?: () => void;
    disabled?: boolean;
    children?: React.ReactNode;
    className?: string;
    rounded?: boolean;
}

export default function Button(props: ButtonProps) {
    const {variant, size, onClick, disabled, children, className, rounded} = props;
    const variants: { [id: string]: string } = {
        blue: "blue-button",
        yellow: "yellow-button",
        red: "red-button",
        gray: "gray-button",
        green: "green-button",
    };
    const sizes: { [id: string]: string } = {
        small: "small-button",
        medium: "medium-button",
        large: "large-button",
    };

    const selectedVariant = variant ? variants[variant] : variants["normal"];
    const selectedSize = size ? sizes[size] : sizes["medium"];

    return (
        <button 
        className={`${selectedVariant} ${selectedSize} ${className || ""} ${rounded && "round-corners"}`}
        onClick={onClick}
        disabled={disabled}
        >
            {children}
        </button>
    );
}