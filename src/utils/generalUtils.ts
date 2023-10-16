import L from "leaflet"
import arc from "arc"
import "leaflet-arc"
import LatLon from 'geodesy/latlon-ellipsoidal-vincenty.js'

// This generates the coordinate array needed for great circle aware polylines
export function generateArcLine(polylineMarkerArray: L.Marker[]){
    const greatArcStart = {x: polylineMarkerArray[polylineMarkerArray.length-2].getLatLng().lng, y:polylineMarkerArray[polylineMarkerArray.length-2].getLatLng().lat}
      const greatArcEnd = {x: polylineMarkerArray[polylineMarkerArray.length-1].getLatLng().lng, y:polylineMarkerArray[polylineMarkerArray.length-1].getLatLng().lat}
      const generator = new arc.GreatCircle(greatArcStart, greatArcEnd)
      const line = generator.Arc(10,{offset:10})
      const lineCoordinates:L.LatLngExpression[][] = line.geometries[0].coords
      //Since lat and lng are switched in the generator, this function corrects that
      const lineC:L.LatLngExpression[][] = lineCoordinates.map(coords =>{
        return [coords[1], coords[0]]
      })
      return lineC
}

// This adds the relevant marker icons to the marker types
export function createIcon(type:string){
    const icon = L.icon({
        iconUrl: `/marker_${type}.png`,
        iconSize: [38, 38],
        iconAnchor: [14, 38],
        popupAnchor: [0, -40],
        shadowUrl: '',
        shadowSize: [68, 95],
        shadowAnchor: [22, 94]
    })
    return icon
}

export function calculateDist(depLat:number, depLng:number, destLat:number, destLng:number){
    const p1 = new LatLon(depLat, depLng)
    const p2 = new LatLon(destLat, destLng)
    return p1.distanceTo(p2)
}