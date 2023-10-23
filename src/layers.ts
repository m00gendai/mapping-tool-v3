import * as EB from "./Layer_Data/EB.json"
import * as ED from "./Layer_Data/ED.json"
import * as LD from "./Layer_Data/LD.json"
import * as LF from "./Layer_Data/LF.json"
import * as LI from "./Layer_Data/LI.json"
import * as LS from "./Layer_Data/LS.json"
import * as LY from "./Layer_Data/LY.json"
import * as LA from "./Layer_Data/LA.json"
import * as EH from "./Layer_Data/EH.json"
import * as BI from "./Layer_Data/BI.json"
import * as EI from "./Layer_Data/EI.json"
import * as EG from "./Layer_Data/EG.json"
import * as LE from "./Layer_Data/LE.json"
import * as LJREP from "./Layer_Data/LJREP.json"
import * as LDREP from "./Layer_Data/LDREP.json"
import * as LSBDRY from "./Layer_Data/LSBDRY.json"
import * as LIBDRY from "./Layer_Data/LIBDRY.json"
import * as LSDRONE from "./Layer_Data/LSDRONE.json"
import { Feature, GeoJsonObject, GeoJsonProperties } from "geojson";
import { LayerGroup_layer } from "./interfaces"
import L from "leaflet"
import { createIcon } from "./utils/generalUtils"

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
    if(string === "LF"){
        return LF as GeoJsonObject
    }
    if(string === "LI"){
        return LI as GeoJsonObject
    }
    if(string === "LS"){
        return LS as GeoJsonObject
    }
    if(string === "LY"){
        return LY as GeoJsonObject
    }
    if(string === "LA"){
        return LA as GeoJsonObject
    }
    if(string === "EH"){
        return EH as GeoJsonObject
    }
    if(string === "BI"){
        return BI as GeoJsonObject
    }
    if(string === "EI"){
        return EI as GeoJsonObject
    }
    if(string === "EG"){
        return EG as GeoJsonObject
    }
    if(string === "LE"){
        return LE as GeoJsonObject
    }
    if(string === "LJREP"){
        return LJREP as GeoJsonObject
    }
    if(string === "LDREP"){
        return LDREP as GeoJsonObject
    }
    if(string === "LSBDRY"){
        return LSBDRY as GeoJsonObject
    }
    if(string === "LIBDRY"){
        return LIBDRY as GeoJsonObject
    }
    if(string === "LSDRONE"){
        return LSDRONE as GeoJsonObject
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
    if(type==="DRONE"){
        return "lime"
    }
    return "black"
}

export function getLayer(layer:LayerGroup_layer){

    const type:string = layer.id.substring(4,)
    const country:GeoJsonObject | undefined = type === "REP" ? 
                                                    getCountry(`${layer.id.substring(0,2)}REP`) : 
                                                type === "BDRY" ? 
                                                    getCountry(`${layer.id.substring(0,2)}BDRY`) :
                                                type === "DRONE" ?
                                                    getCountry(`${layer.id.substring(0,2)}DRONE`) :
                                                getCountry(layer.id.substring(0,2))
/* 
This is absolutely ridiculous, hacky layerand sketchy as all hell, but it works.
Judging how wonky Leaflet is with npm and especially TypeScript, I'll take it, though.
*/

return type==="REP" ? 
/*@ts-expect-error */
L.GeoJSON = L.geoJSON(country, {style: {color: ""}, pointToLayer: function(geoJsonPoint:Feature, latlng:L.LatLng) {
    return L.marker(latlng, {icon: createIcon(`${layer.id.substring(0,2)}REP`)});
}}).bindTooltip(function (layer) {
    /*@ts-expect-error */
     return `${layer.feature.properties.Name}`  
    },{sticky: true})
    :
/*@ts-expect-error */
L.GeoJSON = L.geoJSON(country, {style: {color: getColor(type)}, filter: function(feature:GeoJsonProperties, layer:L.Layer) {
    if(feature?.properties.Type == type){
        return feature.properties.Type
    }}}).bindTooltip(function(layer){
      /*@ts-expect-error */
      return `${layer.feature.properties.ICAO}<br>${layer.feature.properties.Name}`
    },{sticky: true})
}

