import * as L from "leaflet"
import LatLon from 'geodesy/latlon-ellipsoidal-vincenty.js'

/*
    If you wish to know how this works,
    you must first create an Apple Pie from scratch
    (ask Carl Sagan about it)

    Basically, it works by comparing the current potential waypoints with the previous waypoint in regards to their distance between each other.
    Take the route LSZG - ZUE - LSZR for example.
    Since ZUE exists twice, once in Zurich, once in Libya, the markerArray is grouped as follows:
    [ LSZH, [ ZUE (Zurich), ZUE (Libya) ], LSZR ]
    
    Now, the algorhythm takes LSZH as its entry point. It then encounters an array of similar waypoints.
    It then chekcs the distance from LSZH to each of the ZUE entries, and since the ZUE in Zurich is closer to LSZH, it selects this as the valid waypoint.
    It then proceeds to LSZR.

    LSZH
        - ZUE Zurich [x] > distance to LSZH:    13.6NM
        - ZUE Libya  [ ] > distance to LSZH: 1125.93NM
    ZUE Zurich
    LSZR

    In a more complex scenario, the route
    LSZG - KLO - TRA - SONGI - ZUE - LSZR, it resolves to:
    [ LSZH, [ KLO (Zurich), KLO (Philippines) ], TRA, SONGI, [ ZUE (Zurich), ZUE (Libya) ], LSZR]
    It again determines the closest possible waypoint in regards to the previous one.

    LSZH
        - KLO Zurich [ ] > distance to LSZH:
        - KLO Philippines [ ] > distance to LSZH:
    KLO Zurich
    TRA
    SONGI
        - ZUE Zurich [x] > distance to SONGI:    13.6NM
        - ZUE Libya  [ ] > distance to SONGI: 1125.93NM
    ZUE Zurich
    LSZR

    This also means that a route
    HESH - ZUE - OMRK resolves to
    [ HESH, [ ZUE (Zurich), ZUE (Libya) ], OMRK ]
    And since the ZUE in Libya is closer to HESH, it selects this.

    HESH
        - ZUE Zurich [ ] > distance to HESH: 1676.72NM
        - ZUE Libya  [x] > distance to HESH:  769.95NM
    ZUE Libya
    OMRK

    NOTE that in the hypothetical scenario of the routing 
    HLBR - ZUE - LSZR, it will only select the ZUE in Libya to render, as its closest to HLBR, and neglect the ZUE in Zurich, since it in hte next step compares ZUE Libya to LSZR.

    HLBR
        - ZUE Zurich [ ] > distance to HLBR: 1132.76NM
        - ZUE Libya  [X] > distance to HLBR:  158.51NM
    ZUE Libya
    LSZR

    A route like
    HLBR - ZUE - SRN - ZUE - LSZR will plot both ZUE, as the Libya ZUE is selected compared to HLBR, and the Zurich ZUE is selected compared to SRN.

    HLBR
        - ZUE Zurich [ ] > distance to HLBR: 1132.76NM
        - ZUE Libya  [X] > distance to HLBR:  158.51NM
    ZUE Libya
    SRN
        - ZUE Zurich [x] > distance to SRN:  117.08NM
        - ZUE Libya  [ ] > distance to SRN: 1024.18NM
    ZUE Zurich
    LSZR


    Since this strictly checks distances from markerArray[index] to markerArray[index-1], it yields a purely theoretical result.
    Especially when it factors in geographic place names, as it just selects the closest one that fits according to the coordinates,
    not necessarily the correct one.

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