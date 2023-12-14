import L from "leaflet"
import { ChartLayer } from "./interfaces"
import { chartArray, map } from "./main"

function getChart(layer:ChartLayer){
    return L.tileLayer(layer.url, {opacity: 1})
}

export function toggleCharts(layer:ChartLayer){
    const chart: L.TileLayer = getChart(layer)
    /*@ts-expect-error */
    const check:string[] = chartArray.map(chart => chart._url)
    if(chartArray.length === 0 || !check.includes(layer.url)){
      chartArray.push(chart)
      chart.addTo(map)
    }
    if(check.includes(layer.url)){
      chartArray.forEach((chart, index) =>{
        /*@ts-expect-error */
        if(chart._url === layer.url){
          chart.removeFrom(map)
          chartArray.splice(index, 1)
        }
      })
    }
}