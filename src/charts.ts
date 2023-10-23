import L from "leaflet"
import { ChartLayer } from "./interfaces"

export function getChart(layer:ChartLayer){
    return L.tileLayer(layer.url, {opacity: 1})
}