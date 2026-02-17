import { useEffect } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import type { MapShape } from './Map';

interface Coordinate{
    lat: number;
    lng: number;
}
const EARTH_RADIUS = 6371000; // Earth Radius in meters

function toMeters(coord: Coordinate, origin: Coordinate): { x: number; y: number } {
    //projects spherical lat/lon coordinates to cartesian coordinates
  const x = ((coord.lng - origin.lng) * Math.PI / 180) * EARTH_RADIUS * Math.cos(origin.lat * Math.PI / 180);
  const y = ((coord.lat - origin.lat) * Math.PI / 180) * EARTH_RADIUS;
  return { x, y };
}


function deriveShapeArea(pointList: Coordinate[]){
    //finds approximated area of the polygon with polygon area method
    let n = pointList.length
    const origin = pointList[0]
    const projected = pointList.map(point=>toMeters(point, origin))

    let area = 0

    for(let i = 0; i < n; i++){
        let j = (i+1) % n
        let leftSide = projected[i].x * projected[j].y
        let rightSide = projected[j].x * projected[i].y
        area = area + (leftSide - rightSide) 
    }
    return Math.abs(area) / 2
}

const maxAreaLog = Math.log2(510000000000000)
const minZoomLevel = 1
const maxZoomLevel = 25
const difference = maxZoomLevel - minZoomLevel

export function PanHandler({ selectedShape }: { selectedShape: MapShape | undefined }) {
  const map = useMap();
  const areaLog = Math.log2(deriveShapeArea(selectedShape?.path || []))
  const zoomLevel = Math.abs(maxZoomLevel - difference * areaLog/maxAreaLog )
  
  useEffect(() => {
    if (!map || !selectedShape || !selectedShape.path || selectedShape.path.length === 0) {
      return;
    }
    const bounds = new google.maps.LatLngBounds();
    selectedShape.path.forEach((point) => bounds.extend(point));
    const center = bounds.getCenter();
    map.panTo(center);
    map.setZoom(zoomLevel);
  }, [selectedShape, map]);

  return null;
}