import * as L from "leaflet"
import LatLon from 'geodesy/latlon-ellipsoidal-vincenty.js'

export function routePrediction(value: string, markerArray:L.Marker<any>[]){
    console.log(value)
    console.log(markerArray)
  
    const valueArray:string[] = value.toUpperCase().split(" ")
    console.log(valueArray)
    const sortedMarkerArray: (L.Marker<any> | L.Marker<any>[])[] = []
    for(const item of valueArray){
      const temp:L.Marker<any>[] = []
      for(const entry of markerArray){
        if(entry?.getPopup()?.getContent()?.toString().split("<br>")[0].includes(item)){
          temp.push(entry)
        }
      }
      temp.length === 1 ? sortedMarkerArray.push(temp[0]) : sortedMarkerArray.push(temp)
    }
  
    console.log(sortedMarkerArray)
    const arr: L.Marker<any>[] = []
    sortedMarkerArray.forEach((marker, index)=>{
      if(index === 0){
        arr.push(marker as L.Marker<any>)
      } else {
        if(!Array.isArray(marker)){
          arr.push(marker)
        } 
        if(Array.isArray(marker)) {
          const p: L.Marker<any> = arr[index-1] as L.Marker<any>
          console.log(p)
          const p1: LatLon = new LatLon(p.getLatLng().lat, p.getLatLng().lng)
          const dists:number[] = []
          marker.map(item=>{
            const p2:LatLon = new LatLon(item.getLatLng().lat, item.getLatLng().lng)
            const dist:number = p1.distanceTo(p2)
            dists.push(dist)
          })
          const min:number = Math.min(...dists)
          const distIndex = dists.indexOf(min)
          arr.push(marker[distIndex])
        }
      } 
    })
    console.log(arr)
    return arr
}