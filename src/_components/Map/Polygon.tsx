import { useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

interface PolygonProps extends google.maps.PolygonOptions {
  paths: google.maps.LatLngLiteral[] | google.maps.LatLngLiteral[][];
}

export const Polygon = (props: PolygonProps) => {
  const map = useMap();
  const polygonRef = useRef<google.maps.Polygon | null>(null);

  useEffect(() => {
    if (!map) return;

    // Initialize the native Google Maps Polygon
    polygonRef.current = new google.maps.Polygon({
      ...props,
      paths: props.paths,
    });

    polygonRef.current.setMap(map);

    // Clean up when the component unmounts
    return () => {
      if (polygonRef.current) {
        polygonRef.current.setMap(null);
      }
    };
  }, [map, props.paths, props.strokeColor, props.fillColor]);

  return null; // This component doesn't render DOM elements
};