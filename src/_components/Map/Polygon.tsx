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

    polygonRef.current = new google.maps.Polygon({
      ...props,
      paths: props.paths,
    });

    polygonRef.current.setMap(map);
    if (polygonRef.current) {
        polygonRef.current.setOptions({ strokeColor: props.strokeColor, fillColor: props.fillColor });
    }
    return () => {
      if (polygonRef.current) {
        polygonRef.current.setMap(null);
      }
    };
  }, [map, props.paths, props.strokeColor, props.fillColor,]);

  return null;
};