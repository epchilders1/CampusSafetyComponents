import './Map.css'
import {
  APIProvider,
  Map,
  AdvancedMarker,
} from "@vis.gl/react-google-maps";
import { useState, useEffect, useMemo } from 'react';
import { SaveIcon, Trash } from 'lucide-react';
// import {Circle} from 'lucide-react';
import DrawingManager from "./DrawingManager";
import List from '../List/List';
import Input from '../Input/Input';
import { Polygon } from './Polygon';
import { PanHandler } from './PanHandler'
import Button from '../Button/Button';
import {toast,Toaster} from 'react-hot-toast'
import MapControls from './MapControls';

export interface MapShape {
  id: string;
  title: string;
  path: Array<{ lat: number; lng: number }>;
  color?: string;
  radius?: number;
  type?: string;
}

type MapMode = "pin" | "area";



interface MapProps{
    type: MapMode;
    areas?: MapShape[];
}

export default function MapComponent(props:MapProps) {
    const {
        areas = [],
        type = "pin"
    } = props;

    const [pin, setPin] = useState<{ lat: number; lng: number }>();

    const [openAreaOptions, setOpenAreaOptions] = useState(false);
    const [drawingMode, setDrawingMode] = useState("");
    const [shapes, setShapes] = useState<MapShape[]>(areas);
    const [localShapes, setLocalShapes] = useState<MapShape[]>(areas);
    const [hasChanges, setHasChanges] = useState(false);
    const [selectedShapeId, setSelectedShapeId] = useState<string>();
    const selectedMapShape = useMemo(
        () => localShapes.find(s => s.id === selectedShapeId),
        [localShapes, selectedShapeId]
    );

    const handleMapClick = (event: any) => {
        if (type !== "pin") return;
        const latLng = event.detail.latLng;
        if (!latLng) return;
        setPin({ lat: latLng.lat, lng: latLng.lng });
    };

    const handleShapeComplete = (event: any) => {
        let coords: Array<{ lat: number; lng: number }> = [];
        let radius: number | undefined;

        if (event.type === "polygon") {
            const path = event.overlay.getPath();
            for (let i = 0; i < path.getLength(); i++) {
                coords.push({ lat: path.getAt(i).lat(), lng: path.getAt(i).lng() });
            }
        } else if (event.type === "rectangle") {
            const bounds = event.overlay.getBounds();
            const ne = bounds.getNorthEast();
            const sw = bounds.getSouthWest();
            coords = [
                { lat: ne.lat(), lng: ne.lng() },
                { lat: ne.lat(), lng: sw.lng() },
                { lat: sw.lat(), lng: sw.lng() },
                { lat: sw.lat(), lng: ne.lng() }
            ];
        } 
        // else if (event.type === "circle") {
        //     const center = event.overlay.getCenter();
        //     radius = event.overlay.getRadius();
        //     coords = [{ lat: center.lat(), lng: center.lng() }];
        // }

        const newShape: MapShape = {
            id: crypto.randomUUID(),
            title: `New ${event.type}`,
            path: coords,
            radius,
            type: event.type,
            color: "#8C8A8A"
        };

        setLocalShapes(prev => [...prev, newShape]);
        setSelectedShapeId(newShape.id);
        setDrawingMode("");
    };

    const handleShapeSelect = (id: string) => {
        setSelectedShapeId(id);
    };

    const updateLocalShape = (id: string, field: keyof MapShape, value: string) => {
        setLocalShapes(prev => prev.map(shape =>
            shape.id === id ? { ...shape, [field]: value } : shape
        ));
    };

    const handleSaveChanges = () => {
        const deepCopy = JSON.parse(JSON.stringify(localShapes));
        setShapes(deepCopy);
        setHasChanges(false);
        toast.success("Campus Areas saved successfully!");
    };

    const handleDiscardChanges = () => {
        const deepCopy = JSON.parse(JSON.stringify(shapes));
        setLocalShapes(deepCopy);
        setSelectedShapeId(undefined);
        setHasChanges(false);
    };

    useEffect(() => {
        const isDifferent = JSON.stringify(shapes) !== JSON.stringify(localShapes);
        setHasChanges(isDifferent);
    }, [shapes, localShapes]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            const fullscreenElement = document.fullscreenElement;
            const controls = document.querySelector('.map-overlay-controls');
            
            if (fullscreenElement && controls) {
                fullscreenElement.appendChild(controls);
            } else if (controls) {
                document.querySelector('.map-view-container')?.appendChild(controls);
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    return (
        <div className="page-wrapper">
            <Toaster/>
            {type === "area" && (
                <div className="area-list-container">
                    <List items={localShapes} onSelect={handleShapeSelect} />
                </div>
            )}
            <div className="main-content">
                <div className="map-view-container">
                    <APIProvider libraries={["drawing", "geometry"]} apiKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}>
                        <Map
                            defaultCenter={{ lat: 33.2103, lng: -87.5659 }}
                            defaultZoom={16}
                            mapId="DEMO_MAP_ID"
                            onClick={handleMapClick}
                        >
                            <PanHandler selectedShape={selectedMapShape} />

                            {localShapes.map((s) => (
                                <Polygon
                                    key={s.id}
                                    paths={s.path}
                                    strokeColor={s.color}
                                    fillColor={s.color}
                                    fillOpacity={0.4}
                                />
                            ))}
                            {type === "pin" && (
                                <AdvancedMarker key="pin" position={pin} />
                            )}

                            {type === "area" && (
                                <DrawingManager mode={drawingMode} onShapeComplete={handleShapeComplete} />
                            )}
                        </Map>
                    </APIProvider>

                    {type === "area" && (
                        <MapControls 
                            openAreaOptions={openAreaOptions}
                            setOpenAreaOptions={setOpenAreaOptions}
                            setDrawingMode={setDrawingMode}
                        />
                    )}
                </div>

                {type === "area" && selectedMapShape && (
                    <div className="input-section">
                        <div className="input-group">
                            <Input
                                id="display-name"
                                label="Display Name"
                                value={localShapes.find(s => s.id === selectedMapShape.id)?.title || ""}
                                onChange={(value: string) => updateLocalShape(selectedMapShape.id, 'title', value)}
                            />
                        </div>
                        <div className="input-group">
                            <Input
                                id="shape-color"
                                label="Shape Color"
                                type="color"
                                value={localShapes.find(s => s.id === selectedMapShape.id)?.color || ""}
                                onChange={(value: string) => updateLocalShape(selectedMapShape.id, 'color', value)}
                            />
                        </div>
                    </div>
                )}

                {type === "area" && hasChanges && (
                    <div className="save-section">
                        <Button variant='red' rounded={true} size="small" onClick={handleDiscardChanges}>
                            <div className="save-button">
                                <Trash />
                                <p>Discard Changes</p>
                            </div>
                        </Button>
                        <Button variant='blue' rounded={true} size="small" onClick={handleSaveChanges}>
                            <div className="save-button">
                                <SaveIcon />
                                <p>Save Changes</p>
                            </div>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}