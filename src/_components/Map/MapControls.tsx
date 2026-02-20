import { useMap } from "@vis.gl/react-google-maps";
import { useEffect, useRef } from 'react';
import { Plus, PenTool, Square} from 'lucide-react';

interface MapControlsProps{
    openAreaOptions: boolean;
    setOpenAreaOptions: (open: boolean) => void;
    setDrawingMode: (mode: string) => void;
}

export default function MapControls(props: MapControlsProps) {
    const { openAreaOptions, setOpenAreaOptions, setDrawingMode } = props;
    const map = useMap();
    const controlDivRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!map || !controlDivRef.current) return;

        // Add your control to the map's control array
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(controlDivRef.current);

        return () => {
            // Cleanup on unmount
            const index = map.controls[google.maps.ControlPosition.TOP_LEFT].getArray()
                .indexOf(controlDivRef.current!);
            if (index > -1) {
                map.controls[google.maps.ControlPosition.TOP_LEFT].removeAt(index);
            }
        };
    }, [map]);

    return (
        <div className="map-overlay-controls">
            <div className={openAreaOptions ? "area-options-container open" : "area-options-container"}>
                <button className="map-button" onClick={() => setOpenAreaOptions(!openAreaOptions)}>
                    <Plus />
                </button>
                {openAreaOptions && (
                    <div className="area-options-dropdown">
                        <button className="map-button" onClick={() => setDrawingMode("polygon")}><PenTool /></button>
                        <button className="map-button" onClick={() => setDrawingMode("rectangle")}><Square /></button>
                        {/* <button className="map-button" onClick={() => setDrawingMode("circle")}><Circle /></button> */}
                    </div>
                )}
            </div>
        </div>
    );
}