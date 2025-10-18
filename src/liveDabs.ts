import { Feature, FeatureCollection, GeoJsonObject, GeoJsonProperties } from "geojson";
import L from "leaflet"
import { createIcon } from "./utils/generalUtils"
import { FAANOTAM } from "./interfaces";

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

function getNOTAMText(notam:FAANOTAM[], layer:string){
    const layerName = layer.split(" ")[0].replace("-", "") // LSR11
    return `${notam.filter(n => n.traditionalMessageFrom4thWord.split(" ")[1] === layerName)[0].icaoMessage.replaceAll("\n", "<br>").replaceAll(layerName, `<strong>${layerName}</strong>`)}`


}

export async function getLiveDabs(filtered:FAANOTAM[]){
    console.log("live dabs")
    const getLayer_rAreas = await fetch(`/Layer_Data/LSR.json`)
    const layer_rAreas = await getLayer_rAreas.json() as FeatureCollection

    const getLayer_dAreas = await fetch(`/Layer_Data/LSD.json`)
    const layer_dAreas = await getLayer_dAreas.json() as FeatureCollection

    const filteredNOTAM = filtered.map(notam => notam.traditionalMessageFrom4thWord.split(" ")[1])
console.log(filteredNOTAM)

    layer_rAreas.features = layer_rAreas.features.filter(feature => {
        const name = feature.properties?.name || feature.properties?.NAME || feature.properties?.id;
        if(filteredNOTAM.includes(name.split(" ")[0].replace("-", ""))){
            console.log(name)
        }
        return filteredNOTAM.includes(name.split(" ")[0].replace("-", "")); 
    });
    console.log(layer_rAreas)

    layer_dAreas.features = layer_dAreas.features.filter(feature => {
        const name = feature.properties?.name || feature.properties?.NAME || feature.properties?.id;
        if(filteredNOTAM.includes(name.split(" ")[0].replace("-", ""))){
            console.log(name)
        }
        return filteredNOTAM.includes(name.split(" ")[0].replace("-", "")); 
    });
    console.log(layer_dAreas)

    const combinedLayer: FeatureCollection = {
    type: "FeatureCollection",
    features: [...layer_rAreas.features, ...layer_dAreas.features]
};

/* 
This is absolutely ridiculous, hacky layerand sketchy as all hell, but it works.
Judging how wonky Leaflet is with npm and especially TypeScript, I'll take it, though.
*/

/*@ts-expect-error */
return L.GeoJSON = L.geoJSON(combinedLayer, {style: {color: "red", className: "layerItem"}, pointToLayer: function(geoJsonPoint:Feature, latlng:L.LatLng) {
    return L.marker(latlng, {icon: undefined});
}}).bindTooltip(function (layer) {
    /*@ts-expect-error */
     return getNOTAMText(filtered, layer.feature.properties.name)  
    },{sticky: true})
 
}

