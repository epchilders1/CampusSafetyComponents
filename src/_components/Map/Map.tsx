import './Map.css'
import {
  APIProvider,
  Map,
  AdvancedMarker,
} from "@vis.gl/react-google-maps";
import { useState } from 'react';
import { Plus, PenTool, Square, Circle } from 'lucide-react';
import DrawingManager from "./DrawingManager";
import List from '../List/List';
import Input from '../Input/Input';
import { Polygon } from './Polygon';
import {PanHandler} from './PanHandler'

export interface MapShape {
  id: string;
  title: string;
  path: Array<{ lat: number; lng: number }>;
  color?: string;
  radius?: number;
  type?: string;
}
 const INITIAL_SHAPES: MapShape[] = [
        {
            id: "1",
            title: "Red Zone",
            color: "#E53D3D",
            path: [
            { lat: 33.2108, lng: -87.5661 },
            { lat: 33.2112, lng: -87.5655 },
            { lat: 33.2105, lng: -87.5650 },
            { lat: 33.2102, lng: -87.5658 },
            ]
        },
        {
            id: "2",
            title: "Blue Zone",
            color: "#3D85E5",
            path: [
            { lat: 33.2120, lng: -87.5600 },
            { lat: 33.2125, lng: -87.5590 },
            { lat: 33.2115, lng: -87.5585 },
            ]
        }
    ];

export default function MapComponent() {
    const [pin, setPin] = useState<{ lat: number; lng: number }>(); 
    const [openAreaOptions, setOpenAreaOptions] = useState(false);

    const [drawingMode, setDrawingMode] = useState("");
    const [shapes, setShapes] = useState<MapShape[]>(INITIAL_SHAPES);
    const [selectedMapShape, setSelectedMapShape] = useState<MapShape>();

    const handleMapClick = (event: any) => {
        console.log(event)
            const latLng = event.detail.latLng;

            if (!latLng) return;

            setPin( 
                {
                lat: latLng.lat,
                lng: latLng.lng
                }
            );
    };
    const handleShapeComplete = (event: any) => {
        let coords: Array<{ lat: number; lng: number }> = [];
        let radius: number | undefined;

        if (event.type === "polygon") {
            const path = event.overlay.getPath();
            for (let i = 0; i < path.getLength(); i++) {
            coords.push({ lat: path.getAt(i).lat(), lng: path.getAt(i).lng() });
            }
        } 
        
        else if (event.type === "rectangle") {
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
        
        else if (event.type === "circle") {
            const center = event.overlay.getCenter();
            radius = event.overlay.getRadius();
            coords = [{ lat: center.lat(), lng: center.lng() }];
        }

        const newShape: MapShape = {
            id: crypto.randomUUID(),
            title: `New Circle`,
            path: coords,
            radius: radius,
            type: event.type,
            color: "#8C8A8A"
        };


        setShapes(prev => [...prev, newShape]);
        handleShapeSelect(newShape.id);
    };

    const handleShapeSelect = (id: string) =>{
        setSelectedMapShape(shapes.find((shape)=>shape.id == id))
    }

return (
  <div className="page-wrapper">
    <div className="area-list-container">
      <List items={shapes} onSelect={handleShapeSelect}/>
    </div>

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
            {shapes.map((s) => (
                <Polygon
                    key={s.id}
                    paths={s.path}
                    strokeColor={s.color}
                    fillColor={s.color}
                    fillOpacity={0.4}
                />
            ))}
            <AdvancedMarker key="pin" position={pin} />
            <DrawingManager mode={drawingMode} onShapeComplete={handleShapeComplete} />
          </Map>
        </APIProvider>

        <div className="map-overlay-controls">
            <div className={openAreaOptions ? "area-options-container open" : "area-options-container"}>
                <button className="map-button" onClick={() => setOpenAreaOptions(!openAreaOptions)}>
                <Plus />
                </button>
                {openAreaOptions && (
                <div className="area-options-dropdown">
                    <button className="map-button" onClick={() => setDrawingMode("polygon")}><PenTool /></button>
                    <button className="map-button" onClick={() => setDrawingMode("rectangle")}><Square /></button>
                    <button className="map-button" onClick={() => setDrawingMode("circle")}><Circle /></button>
                </div>
                )}
            </div>
            </div>
        </div>
        {selectedMapShape && (
        <div className="input-section">
            <div className="input-group">
                <Input id="display-name" label="Display Name" value={selectedMapShape?.title}/>
            </div>
            <div className="input-group">
                <Input id="display-name" label="Shape Color" placeHolder='#FFFFFF' value={selectedMapShape?.color}/>
            </div>
        </div>
        )}
    </div>
  </div>
);
}
