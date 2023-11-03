import { Feature, GeoJsonObject, GeoJsonProperties } from "geojson";
import { LayerGroup_layer } from "./interfaces"
import L from "leaflet"
import { createIcon } from "./utils/generalUtils"

async function getCountry(string:string){
    const getLayer = await fetch(`/Layer_Data/${string}.json`)
    const layer = await getLayer.json()
    return layer as GeoJsonObject
}

function getColor(type:string){
    if(type === "TMA"){
        return "blue"
    }
    if(type ==="CTR"){
        return "orange"
    }
    if(type==="FIR"){
        return "darkmagenta"
    }
    if(type==="Schutzgebiete"){
        return "green"
    }
    if(type==="Sperrgebiete"){
        return "red"
    }
    if(type==="uebrige"){
        return "red"
    }
    return "black"
}

export async function getLayer(layer:LayerGroup_layer){

    const type:string = layer.id.substring(4,)
    const country:GeoJsonObject | undefined = type === "REP" ? 
                                                    await getCountry(`${layer.id.substring(0,2)}REP`) : 
                                                type === "BDRY" ? 
                                                await getCountry(`${layer.id.substring(0,2)}BDRY`) :
                                                type === "DRONE" ?
                                                await getCountry(`${layer.id.substring(0,2)}DRONE`) :
                                                await getCountry(layer.id.substring(0,2))
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
    type ==="DRONE" ?
    /*@ts-expect-error */
L.GeoJSON = L.geoJSON(country, {
    /*@ts-expect-error */
    style: function(feature:GeoJsonProperties){
        return {color: getColor(feature?.properties.name)}},
    filter: function(feature:GeoJsonProperties) {
            return feature?.properties.name
        
    }}).bindTooltip(function(layer){"name"
      /*@ts-expect-error */
      return `<strong>${layer.feature.properties.Name_DE}</strong><br><br><strong>Restriktionen:</strong><br>${layer.feature.properties.Restr_DE}<br><strong>Bewilligungen:</strong><br>${layer.feature.properties.Bew_St_DE}`
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

