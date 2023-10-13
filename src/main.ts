import "./styles/globals.css"
import L, { LatLngBoundsLiteral } from "leaflet"
import 'leaflet/dist/leaflet.css';
import { placeCoords, placeLoci, placeNavaid, placeBrgDist, placeRep, placePlace } from "./utils/queryFunctions"
import { routeDeconstructor } from "./utils/routeDeconstructor"
import { createIcon } from "./configs"

interface QueryInput{
  designation: string
  value: string
  type: string
}

interface State{
  popupVisible: boolean
}

const map: L.Map = L.map('map').setView([46.80, 8.22], 8);

let mapWidth:string = getComputedStyle(document.getElementById("map")!).width
window.addEventListener("resize", function(){
  mapWidth = getComputedStyle(document.getElementById("map")!).width
})

const state: State ={
  popupVisible: false
}

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const inputArea = document.createElement("div")
inputArea.className="sidebar_inputArea"

const queryAllState:QueryInput = {
  designation: "ALL",
  value: "",
  type: ""
}

const fieldDesignations: QueryInput[] = [
  {
    designation: "LOCI",
    value: "",
    type: "airport"
  },
  {
    designation: "PLACE",
    value: "",
    type: "location"
  },
  {
    designation: "NAVAID",
    value: "",
    type: "navaid",
  },
  {
    designation: "WAYPOINT",
    value: "",
    type: "waypoint"
  },
  {
    designation: "COORD", 
    value: "",
    type: "coordinate"
  },
  {
    designation: "BRG/DIST",
    value: "",
    type: "brgdist"
  },
]

const markerArray: L.Marker[] = []

function clearMarkers(){
  markerArray.forEach(marker =>{
    marker.removeFrom(map)
  })
  markerArray.length = 0
}

const queryAllField: HTMLDivElement = document.createElement("div")
queryAllField.className=`sidebar_area`
const queryAll: HTMLTextAreaElement = document.createElement("textarea")
queryAll.className="sidebar_textarea"
queryAll.id = `sidebar_textarea_queryAll`
const queryAllButton: HTMLButtonElement = document.createElement("button")
queryAllButton.className="sidebar_button"
queryAllButton.innerHTML=queryAllState.designation

queryAllField.appendChild(queryAll)
queryAllField.appendChild(queryAllButton)
inputArea.appendChild(queryAllField)

function addMarker(results:string[][], type:string){
  results.forEach(result =>{
    const marker: L.Marker<any> = L.marker([parseFloat(result[0]), parseFloat(result[1])], {icon:createIcon(type)}).bindPopup(result[2], {autoClose: false})
    markerArray.push(marker)
  })
}

async function queryTriggerAll(){
  clearMarkers()
  queryAllState.value = ""
  const target = document.getElementById(`sidebar_textarea_queryAll`) as HTMLInputElement
  const value: string = target?.value
  queryAllState.value = value
  if(value === ""){
    return
  }
  const deconstructedRte:string[][] = routeDeconstructor(value.toUpperCase())
  // navaids, locis, waypoints, coordinates, brgDist
  const deconstructedNavaids:string[] = deconstructedRte[0]
  const deconstructedLocis:string[] = deconstructedRte[1]
  const deconstructedWaypoints:string[] = deconstructedRte[2]
  const deconstructedCoord:string[] = deconstructedRte[3]
  const deconstructedBrgDist:string[] = deconstructedRte[4]
  const deconstructedOther:string[] = deconstructedRte[5]

  if(deconstructedNavaids.length !== 0){
    const results: string[][] = placeNavaid(deconstructedNavaids.join(" "))
    addMarker(results, "navaid")
  }
  if(deconstructedLocis.length !== 0){
    const results: string[][] = placeLoci(deconstructedLocis.join(" "))
    addMarker(results, "airport")
  }
  if(deconstructedWaypoints.length !== 0){
    const results: string[][] = placeRep(deconstructedWaypoints.join(" "))
    addMarker(results, "waypoint")
  }
  if(deconstructedCoord.length !== 0){
    const results: string[][] = placeCoords(deconstructedCoord.join(" "))
    addMarker(results, "coordinate")
  }
  if(deconstructedBrgDist.length !== 0){
    const results: string[][] = placeBrgDist(deconstructedBrgDist.join(" "))
    addMarker(results, "brgdist")
  }
  if(deconstructedOther.length !== 0){
    const results: string[][] = await placePlace(deconstructedOther.join(" "))
    addMarker(results, "location")
  }

markerArray.forEach(marker =>{
  marker.addTo(map)
})
const bounds: L.LatLngBoundsExpression = markerArray.map(marker => [marker.getLatLng().lat, marker.getLatLng().lng]) as LatLngBoundsLiteral
const bnds: L.LatLngBounds = new L.LatLngBounds(bounds)
if(bounds.length > 1){
  map.fitBounds(bnds)
} else {
  map.setView(markerArray[0].getLatLng(), 10)
}
}

queryAllButton.addEventListener("click", function(){
  queryTriggerAll()
})

queryAllField.addEventListener("keypress", function(e){
  if(e.key === "Enter"){
    e.preventDefault()
    queryTriggerAll()
  }
})

async function queryTrigger(field:QueryInput){
  clearMarkers()
      field.value = ""
      const target = document.getElementById(`sidebar_textarea_${field.designation}`) as HTMLInputElement
      const value: string = target?.value
      field.value = value
      if(value === ""){
        return
      }
      const results:string[][] = field.designation === "COORD" ? placeCoords(value)! : 
                                  field.designation === "LOCI" ? placeLoci(value)!  :
                                  field.designation === "NAVAID" ? placeNavaid(value)! :
                                  field.designation === "WAYPOINT" ? placeRep(value)! :
                                  field.designation === "BRG/DIST" ? placeBrgDist(value)! :
                                  await placePlace(value)!
        addMarker(results, field.type)
      markerArray.forEach(marker =>{
        marker.addTo(map)
      })
      const bounds: L.LatLngBoundsExpression = markerArray.map(marker => [marker.getLatLng().lat, marker.getLatLng().lng]) as LatLngBoundsLiteral
      const bnds: L.LatLngBounds = new L.LatLngBounds(bounds)
      if(bounds.length > 1){
        map.fitBounds(bnds)
      } else {
        map.setView(markerArray[0].getLatLng(), 10)
      }
}

fieldDesignations.forEach(field =>{
    const textareaField: HTMLDivElement = document.createElement("div")
    textareaField.className=`sidebar_area`

    const textarea: HTMLTextAreaElement = document.createElement("textarea")
    textarea.className="sidebar_textarea"
    textarea.id = `sidebar_textarea_${field.designation}`
    textarea.value = field.value
    textarea.addEventListener("keypress", function(e){
      if(e.key === "Enter"){
        e.preventDefault()
        queryTrigger(field)
      }
    })
    
    const button: HTMLButtonElement = document.createElement("button")
    button.className="sidebar_button"
    button.innerHTML=field.designation

    button.addEventListener("click", function(){
      queryTrigger(field)
    })

    textareaField.appendChild(textarea)
    textareaField.appendChild(button)
    inputArea.appendChild(textareaField)
})

document.getElementById("sidebarInner")?.appendChild(inputArea)

const popupToggle: HTMLButtonElement = document.createElement("button")
popupToggle.innerText="Popup Toggle"
popupToggle.className="toolbar_button"
popupToggle.addEventListener("click", function(){
  if(state.popupVisible){
    const popups: NodeList = document.querySelectorAll(".leaflet-popup-close-button")
    popups.forEach(popup =>{
      const closeButton: HTMLElement = popup as HTMLElement
      closeButton.click()
    })
  }
   if(!state.popupVisible){
    markerArray.forEach(marker =>{
      marker.openPopup()
    })
  }
  state.popupVisible = !state.popupVisible
})

const focusSwitzerland: HTMLButtonElement = document.createElement("button")
focusSwitzerland.innerText = "Focus Switzerland"
focusSwitzerland.className="toolbar_button"
focusSwitzerland.addEventListener("click", function(){
  map.setView([46.80, 8.22], 8);
})

const clearMakers: HTMLButtonElement = document.createElement("button")
clearMakers.innerText = "Clear Markers"
clearMakers.className="toolbar_button"
clearMakers.addEventListener("click", function(){
  clearMarkers()
})

document.getElementById("toolbar")!.style.width = mapWidth
window.addEventListener("resize", function(){
  document.getElementById("toolbar")!.style.width = mapWidth
})
document.getElementById("toolbar")?.appendChild(clearMakers)
document.getElementById("toolbar")?.appendChild(popupToggle)
document.getElementById("toolbar")?.appendChild(focusSwitzerland)
