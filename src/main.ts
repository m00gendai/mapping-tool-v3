import "./styles/globals.css"
import L, { LatLngBoundsLiteral } from "leaflet"
import 'leaflet/dist/leaflet.css';
import { placeCoords, placeLoci, placeNavaid } from "./utils/queryFunctions"

interface QueryInput{
  designation: string
  value: string
}

interface State{
  popupVisible: boolean
}

const map: L.Map = L.map('map').setView([46.80, 8.22], 8);

const mapWidth:string = getComputedStyle(document.getElementById("map")!).width

const state: State ={
  popupVisible: false
}

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const inputArea = document.createElement("div")
inputArea.className="sidebar_inputArea"

const fieldDesignations: QueryInput[] = [
  {
    designation: "Coordinates", 
    value: "",
  },
  {
    designation: "LOCI",
    value: "",
  },
  {
    designation: "NAVAID",
    value: "",
  },
  {
    designation: "WAYPOINT",
    value: "",
  },
]

const markerArray: L.Marker[] = []

function clearMarkers(){
  markerArray.forEach(marker =>{
    marker.removeFrom(map)
  })
  markerArray.length = 0
}

fieldDesignations.forEach(field =>{
    const textareaField: HTMLDivElement = document.createElement("div")
    textareaField.className=`sidebar_area`

    const textarea: HTMLTextAreaElement = document.createElement("textarea")
    textarea.className="sidebar_textarea"
    textarea.id = `sidebar_textarea_${field.designation}`
    textarea.value = field.value
    
    const button: HTMLButtonElement = document.createElement("button")
    button.className="sidebar_button"
    button.innerHTML=field.designation

    button.addEventListener("click", function(){
      clearMarkers()
      field.value = ""
      const target = document.getElementById(`sidebar_textarea_${field.designation}`) as HTMLInputElement
      const value: string = target?.value
      field.value = value
      if(value === ""){
        return
      }
      const results:string[][] = field.designation === "Coordinates" ? placeCoords(value)! : 
                                  field.designation === "LOCI" ? placeLoci(value)!  :
                                  placeNavaid(value)!
      results.forEach(result =>{
        const marker: L.Marker<any> = L.marker([parseFloat(result[0]), parseFloat(result[1])]).bindPopup(result[2], {autoClose: false})
        markerArray.push(marker)
      })
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
document.getElementById("toolbar")?.appendChild(clearMakers)
document.getElementById("toolbar")?.appendChild(popupToggle)
document.getElementById("toolbar")?.appendChild(focusSwitzerland)
