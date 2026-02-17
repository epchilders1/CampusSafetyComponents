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

        if (polygonRef.current) {
            polygonRef.current.setMap(null);
            polygonRef.current = null;
        }

        polygonRef.current = new google.maps.Polygon({
            ...props,
            paths: props.paths,
            strokeColor: props.strokeColor,
            fillColor: props.fillColor,
            fillOpacity: props.fillOpacity,
            map,
        });

        return () => {
            if (polygonRef.current) {
                polygonRef.current.setMap(null);
                polygonRef.current = null;
            }
        };
    }, [map, props.paths, props.strokeColor, props.fillColor, props.fillOpacity]);

    return null;
};