import * as L from "leaflet"
import LatLon from 'geodesy/latlon-ellipsoidal-vincenty.js'

/*
    If you wish to know how this works,
    you must first create an Apple Pie from scratch
    (ask Carl Sagan about it)
*/

export function routePrediction(value: string, markerArray:L.Marker<any>[]){

    const valueArray:string[] = value.toUpperCase().split(" ")
    const sortedMarkerArray: (L.Marker<any> | L.Marker<any>[])[] = []
    for(const item of valueArray){
      const temp:L.Marker<any>[] = []
      for(const entry of markerArray){
        if(entry?.getPopup()?.getContent()?.toString().split("<br>")[0].toUpperCase().includes(item) || entry?.getPopup()?.getContent()?.toString().split("<br>")[0].toUpperCase().split(" ").includes(item)){ // place is plz first, then name
          temp.push(entry)
        }
      }
      temp.length === 1 ? sortedMarkerArray.push(temp[0]) : sortedMarkerArray.push(temp)
    }
  
    const arr: L.Marker<any>[] = []

    sortedMarkerArray.forEach((marker, index)=>{
        console.log(marker)
      if(index === 0){
        arr.push(marker as L.Marker<any>)
      } else {
        if(!Array.isArray(marker)){
          arr.push(marker)
        } 
        if(Array.isArray(marker)) {
          const p: L.Marker<any> = arr[index-1] as L.Marker<any>
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

    return arr
}