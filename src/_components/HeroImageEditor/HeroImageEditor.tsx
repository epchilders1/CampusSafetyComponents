"use client";

import { useRef, useState, useEffect } from "react";
import "./HeroImageEditor.css";
import { Image, Pencil } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import Button from "../Button/Button";

interface HeroImageEditorProps {
    currentImage?: string | null;
    saveImage: (file: File | null) => Promise<void>;
}

export default function HeroImageEditor(props: HeroImageEditorProps) {
    const {currentImage, saveImage} = props;
    const [newImage, setNewImage] = useState<File | null>(null);
    const [newImageUrl, setNewImageUrl] = useState<string | null>(null);

    const [hasChanges, setHasChanges] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;

        if (file) {
            setNewImage(file);
            setNewImageUrl(URL.createObjectURL(file));
            setHasChanges(true);
        }
    };

    const handleSaveChanges = async () => {
        try {
            await saveImage(newImage);
            toast.success("Image saved successfully!");
            setHasChanges(false);
        } catch (error) {
            if(error instanceof Error){
                toast.error(error.message || "Failed to save image. Please try again.");
            }
        }
    }
    const handleDiscardChanges = () => {
        setNewImage(null);
        setNewImageUrl(null);
        setHasChanges(false);
    }

    const handleRemoveImage = () => {
        setNewImage(null);
        setNewImageUrl("");
        setHasChanges(true);
    }

    const displayImage = newImageUrl ?? currentImage;

    return (
        <div>
            <Toaster/>
            <button
                type="button"
                className={`hero-image-selector ${displayImage ? "has-image" : ""}`}
                onClick={() => inputRef.current?.click()}
                style={displayImage ? { backgroundImage: `url(${displayImage})` } : undefined}
            >
                {!displayImage && (
                    <div className="hero-image-placeholder">
                        <Image className="hero-image-icon" />
                        <span>Upload Image</span>
                    </div>
                )}
                {displayImage && (
                    <div className="hero-image-preview-container">
                        <Pencil className="change-image-overlay"/>
                        <img src={displayImage} alt="Selected Hero" className="hero-image-preview" />
                    </div>
                )}
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    hidden
                />
            </button>
            {hasChanges && (
                <div className="hero-image-actions">
                    <Button
                        variant="gray"
                        onClick={handleDiscardChanges}
                    >
                        Discard Changes
                    </Button>
                    <Button
                        variant="blue"
                        onClick={handleSaveChanges}
                    >
                        Save Changes
                    </Button>
                </div>
            )}
            {displayImage && (
                <Button
                    variant="red"
                    className="remove-button"
                    onClick={handleRemoveImage}
                >
                    Remove Image
                </Button>
            )}
        </div>
    );
}