import { useEffect } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import type { MapShape } from './Map';

export function PanHandler({ selectedShape }: { selectedShape: MapShape | undefined }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !selectedShape || !selectedShape.path || selectedShape.path.length === 0) {
      return;
    }
    const bounds = new google.maps.LatLngBounds();
    selectedShape.path.forEach((point) => bounds.extend(point));
    const center = bounds.getCenter();
    map.panTo(center);
    map.setZoom(16);
  }, [selectedShape, map]);

  return null;
}