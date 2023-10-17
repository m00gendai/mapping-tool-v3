import * as EB from "./Layer_Data/EB.json"
import * as ED from "./Layer_Data/ED.json"
import * as LD from "./Layer_Data/LD.json"
import { GeoJsonObject, GeoJsonProperties } from "geojson";
import { LayerGroup_layer } from "./interfaces"

function getCountry(string:string){
    if(string === "EB"){
        return EB as GeoJsonObject
    }
    if(string === "ED"){
        return ED as GeoJsonObject
    }
    if(string === "LD"){
        return LD as GeoJsonObject
    }
}
function getColor(type:string){
    if(type === "TMA"){
        return "blue"
    }
    if(type ==="CTR"){
        return "gold"
    }
    if(type==="FIR"){
        return "magenta"
    }
    return "black"
}

export function getLayer(layer:LayerGroup_layer){
    const country:GeoJsonObject | undefined = getCountry(layer.id.substring(0,2))
    const type:string = layer.id.substring(4,)
/* 
This is absolutely ridiculous, hacky and sketchy as all hell, but it works.
Judging how wonky Leaflet is with npm and especially TypeScript, I'll take it, though.
*/
/*@ts-expect-error */
return L.GeoJSON = L.geoJSON(country, {style: {color: getColor(type)}, filter: function(feature:GeoJsonProperties, layer:L.Layer) {
    if(feature?.properties.Type == type){
        return feature.properties.Type
    }}}).bindTooltip(function(layer){
      /*@ts-expect-error */
      return `${layer.feature.properties.ICAO}<br>${layer.feature.properties.Name}`
    },{sticky: true})
}