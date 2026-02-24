import './Image.css';

interface ImageProps{
    src?: string | null;
    alt?: string;
    size?: number;
}

export default function Image(props: ImageProps){
    const {src, alt} = props;
    return(
        <div className="image-container">
            {src && (
                <img src={src} alt={alt || "Image"} className="image-element" width={props.size} />
            )}
        </div>
    );
}