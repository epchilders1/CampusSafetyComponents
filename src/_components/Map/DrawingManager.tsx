import { useEffect } from "react";
import { useMap } from "@vis.gl/react-google-maps";

export default function DrawingManager({ mode, onShapeComplete }: any) {
  const map = useMap();

  useEffect(() => {
    if (!map || !window.google) return;

    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: mode,
      drawingControl: false
    });

    drawingManager.setMap(map);

    google.maps.event.addListener(
      drawingManager,
      "overlaycomplete",
      (event: any) => {
        onShapeComplete(event);
        drawingManager.setDrawingMode(null); // exit drawing mode
      }
    );

    return () => {
      drawingManager.setMap(null);
    };
  }, [map, mode]);

  return null;
}
