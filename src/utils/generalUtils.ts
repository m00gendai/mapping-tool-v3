import L from "leaflet"
import arc from "arc"
import "leaflet-arc"
import LatLon from 'geodesy/latlon-ellipsoidal-vincenty.js'
import { State } from "../interfaces"

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

export function createSVG(flag:string, state:State){
  if(flag === "query"){
    return `<svg fill="${state.darkmode ? '#fff' : '#000'}" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M50,10.417c-15.581,0-28.201,12.627-28.201,28.201c0,6.327,2.083,12.168,5.602,16.873L45.49,86.823 c0.105,0.202,0.21,0.403,0.339,0.588l0.04,0.069l0.011-0.006c0.924,1.278,2.411,2.111,4.135,2.111c1.556,0,2.912-0.708,3.845-1.799 l0.047,0.027l0.179-0.31c0.264-0.356,0.498-0.736,0.667-1.155L72.475,55.65c3.592-4.733,5.726-10.632,5.726-17.032 C78.201,23.044,65.581,10.417,50,10.417z M49.721,52.915c-7.677,0-13.895-6.221-13.895-13.895c0-7.673,6.218-13.895,13.895-13.895 s13.895,6.222,13.895,13.895C63.616,46.693,57.398,52.915,49.721,52.915z"></path> </g> </g></svg>`
  }
  if(flag === "conversion"){
    return `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="${state.darkmode ? '#fff' : '#000'}"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>calculator-solid</title> <g id="Layer_2" data-name="Layer 2"> <g id="invisible_box" data-name="invisible box"> <rect width="48" height="48" fill="none"></rect> </g> <g id="icons_Q2" data-name="icons Q2"> <g> <path d="M42,25.5H27.5a2,2,0,0,0-2,2V42a2,2,0,0,0,2,2H42a2,2,0,0,0,2-2V27.5A2,2,0,0,0,42,25.5ZM40,39H30V36H40Zm0-5H30V31H40Z"></path> <path d="M20.5,4H6A2,2,0,0,0,4,6V20.5a2,2,0,0,0,2,2H20.5a2,2,0,0,0,2-2V6A2,2,0,0,0,20.5,4ZM18,14.5H14.5V18h-3V14.5H8v-3h3.5V8h3v3.5H18Z"></path> <path d="M20.5,25.5H6a2,2,0,0,0-2,2V42a2,2,0,0,0,2,2H20.5a2,2,0,0,0,2-2V27.5A2,2,0,0,0,20.5,25.5Zm-2.9,12-2.1,2.1L13,37.1l-2.5,2.5L8.4,37.5,10.9,35,8.4,32.5l2.1-2.1L13,32.9l2.5-2.5,2.1,2.1L15.1,35Z"></path> <path d="M42,4H27.5a2,2,0,0,0-2,2V20.5a2,2,0,0,0,2,2H42a2,2,0,0,0,2-2V6A2,2,0,0,0,42,4ZM40,14.5H30v-3H40Z"></path> </g> </g> </g> </g></svg>`
  }
  if(flag === "layerGroup"){
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--gis" preserveAspectRatio="xMidYMid meet" fill="${state.darkmode ? '#fff' : '#000'}"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M50.049 9.51a4.725 2.593 0 0 0-3.39.76L1.382 35.115a4.725 2.593 0 0 0 0 3.668L46.658 63.63a4.725 2.593 0 0 0 6.684 0l45.275-24.846a4.725 2.593 0 0 0 0-3.668L53.342 10.27a4.725 2.593 0 0 0-3.293-.76zM50 15.77l38.596 21.18L50 58.128l-38.594-21.18zM4.727 46.332l-3.344 1.834a4.725 2.593 0 0 0 0 3.668L46.658 76.68a4.725 2.593 0 0 0 6.684 0l45.275-24.846a4.725 2.593 0 0 0-.002-3.668l-3.342-1.834l-6.683 3.666l.004.002L50 71.18L11.404 50l.004-.002zm0 13.05l-3.344 1.835a4.725 2.593 0 0 0 0 3.668L46.658 89.73a4.725 2.593 0 0 0 6.684 0l45.275-24.846a4.725 2.593 0 0 0-.002-3.668l-3.342-1.834l-6.683 3.666l.004.002L50 84.23L11.404 63.05l.004-.002z" fill="${state.darkmode ? '#fff' : '#000'}"></path></g></svg>`
  }
  return ""
}

export function calculateDist(depLat:number, depLng:number, destLat:number, destLng:number){
    const p1 = new LatLon(depLat, depLng)
    const p2 = new LatLon(destLat, destLng)
    return p1.distanceTo(p2)
}

export function buildTable(polylineMarkerArray:L.Marker[], state:State){
    const lineFeed: HTMLTableRowElement = document.createElement("tr")
      lineFeed.className="polylineField_lineFeed"
      document.getElementById("polylineField_table_body")!.appendChild(lineFeed)

      const tdDep:HTMLTableCellElement = document.createElement("td")
      const tdDist:HTMLTableCellElement = document.createElement("td")
      const tdDest:HTMLTableCellElement = document.createElement("td")
      const tdTime:HTMLTableCellElement = document.createElement("td")

      tdTime.className = "polylineField_table_body_time"
      tdTime.id= `polylineField_table_body_time_${state.markerClicks}`
      const tdTotalDist:HTMLTableCellElement = document.createElement("td")
      const tdTotalTime:HTMLTableCellElement = document.createElement("td")
      tdTotalTime.className = "polylineField_table_body_totalTime"
      tdTotalTime.id=`polylineField_table_body_totalTime_${state.markerClicks}`
      lineFeed.appendChild(tdDep)
      lineFeed.appendChild(tdDist)
      lineFeed.appendChild(tdDest)
      lineFeed.appendChild(tdTime)
      lineFeed.appendChild(tdTotalDist)
      lineFeed.appendChild(tdTotalTime)
      state.setDep = `${polylineMarkerArray[polylineMarkerArray.length-2].getPopup()!.getContent()!.toString().split("<br>")[0]}`
      tdDep.innerText = state.setDep
      state.setDist = [...state.setDist, (calculateDist(
        polylineMarkerArray[polylineMarkerArray.length-2].getLatLng().lat, 
        polylineMarkerArray[polylineMarkerArray.length-2].getLatLng().lng, 
        polylineMarkerArray[polylineMarkerArray.length-1].getLatLng().lat, 
        polylineMarkerArray[polylineMarkerArray.length-1].getLatLng().lng, 
        )/1852)]
      tdDist.innerText = state.setDist[state.markerClicks].toFixed(2)
      state.setDest = `${polylineMarkerArray[polylineMarkerArray.length-1].getPopup()!.getContent()!.toString().split("<br>")[0]}`
      /*const time = state.setDist[state.markerClicks]/state.setSpeed
      const n = new Date(0,0);
      n.setSeconds(+time * 60 * 60);
      tdTime.innerText = n.toTimeString().slice(0, 8)*/
      tdDest.innerText = state.setDest
      state.setTotalDist = state.setTotalDist + (calculateDist(
        polylineMarkerArray[polylineMarkerArray.length-2].getLatLng().lat, 
        polylineMarkerArray[polylineMarkerArray.length-2].getLatLng().lng, 
        polylineMarkerArray[polylineMarkerArray.length-1].getLatLng().lat, 
        polylineMarkerArray[polylineMarkerArray.length-1].getLatLng().lng, 
        )/1852)
      tdTotalDist.innerText  = `${(state.setTotalDist).toFixed(2)}NM`
  const timeFields:NodeList = document.querySelectorAll(".polylineField_table_body_time")
  const totalTimeFields:NodeList = document.querySelectorAll(".polylineField_table_body_totalTime")
    timeFields.forEach((timeField, index) =>{
      const time = state.setDist[index]/state.setSpeed
      const n = new Date(0,0);
      n.setSeconds(+time * 60 * 60);
      const htmlTimeField = timeField as HTMLElement
      htmlTimeField.innerText = n.toTimeString().slice(0, 8)
    })

      const time = state.setTotalDist/state.setSpeed
      const n = new Date(0,0);
      n.setSeconds(+time * 60 * 60);
      const htmlTimeField = totalTimeFields[state.markerClicks] as HTMLElement
        htmlTimeField.innerText = n.toTimeString().slice(0, 8) 
      if(htmlTimeField.innerHTML.includes("Invalid")){
        htmlTimeField.innerText = ""
      }
    
    
      state.setTimeFields = state.setTimeFields + 1

}