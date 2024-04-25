import { QueryInput, SidebarFlag, Setting, Parsed, Distance, Speed, ToolbarFunctions } from "../interfaces"
import { map, markerArray, polylineArray, polylineDecoratorArry, polylineMarkerArray, speedInput } from "../main"
import { state } from "./state"
import { toggleCharts } from "../charts"
import { chartLayers } from "./chartLayers"

const date: Date = new Date()
export const currentYear:number = date.getFullYear()

export const fieldDesignations: QueryInput[] = [
    {
      designation: "LOCI",
      value: "",
      type: "airport",
      placeholder: "LSPF LOWI LIML",
    },
    {
      designation: "PLACE",
      value: "",
      type: "location",
      placeholder: "Hallau,Bad Zurzach,Freiburg im Breisgau,Dübendorf",
    },
    {
      designation: "NAVAID",
      value: "",
      type: "navaid",
      placeholder: "TRA ZUE KLO",
    },
    {
      designation: "WAYPOINT",
      value: "",
      type: "waypoint",
      placeholder: "TITIX SONGI AMIKI",
    },
    {
      designation: "COORD", 
      value: "",
      type: "coordinate",
      placeholder: "4741N00827E 472425N0083823E",
    },
    {
      designation: "BRG/DIST",
      value: "",
      type: "brgdist",
      placeholder: "TRA090120 MOLUS120010",
    },
  ]

export const queryAllState:QueryInput = {
    designation: "ALL",
    value: "",
    type: "",
    placeholder: "-LSPF1400\n-N0120VFR SCHAFFHAUSEN ZUE 4737N00920E AMIKI GERSA045020 LSZK\n-LSMD0130 LSZH LSPH",
}

export const sidebarFlags:SidebarFlag[] = [
    {
      type: "query",
      text: "Query items on map"
    },
    {
      type: "basemap",
      text: "Select Base Map"
    },
    {
      type: "conversion",
      text: "Unit conversions"
    },
    {
      type: "balloon",
      text: "Balloon Flight Area"
    },
    {
      type: "settings",
      text: "Settings"
    },
    {
      type: "info",
      text: "Info & Legal"
    },
  ]

export const parsed: Parsed = {
  wgs84degMin: {name: "WGS84", coordinates: []},
  wgs84degMinSec: {name: "WGS84 dms", coordinates: []},
  decimal: {name: "Decimal", coordinates: []},
  swissgrid: {name: "Swissgrid", coordinates: []},
}

export const coordinateConversions:string[] = [
  "WGS84 Deg Min", "WGS84 Deg Min Sec", "Decimal", "Swissgrid"
]

export const distanceConversions: string[] = [
  "Feet", "Meter", "Statute Mile", "Nautical Mile", "Kilometer"
]

export const speedConversions: string[] = [
  "km/h", "mph", "m/s", "Knots", "Mach"
]

export const settings:Setting[] = [
  {
    id: "darkmodeToggle",
    name: "Darkmode",
    type: "range",
    description: "Switches between a light and dark background for the interface",
    max: "1",
    min: "0",
    step: "1"
  },
  {
    id: "coordinateBox",
    name: "Coordinate Tooltip",
    type: "range",
    description: "Switches the box that displays the current coordinates when moving the cursor around the map on or off",
    max: "1",
    min: "0",
    step: "1",
  },
  {
    id: "sidebarToggle",
    name: "Show sidebar by default",
    type: "range",
    description: "Sets if the sidebar is hidden or visible on start. Does not impact the sidebar functionality",
    max: "1",
    min: "0",
    step: "1",
  },
  {
    id: "placeCoordOptIn",
    name: "Show Coordinates in Place Popups",
    type: "range",
    description: "Opt in or out of including coordinates in Place Marker Popup",
    max: "1",
    min: "0",
    step: "1",
  },
  {
    id: "routePredictionActive",
    name: "Route Prediction",
    type: "range",
    description: "Opt in or out of the Route Prediction functionality",
    max: "1",
    min: "0",
    step: "1"
  }
]

export const distances:Distance = {
  m: {name: "Meter", value: 0},
  ft: {name: "Feet", value: 0},
  sm: {name: "Statute Mile", value: 0},
  nm: {name: "Nautical Mile", value: 0},
  km: {name: "Kilometer", value: 0},
}

export const speeds:Speed = {
  kmh: {name: "km/h", value: 0},
  mph: {name: "mph", value: 0},
  ms: {name: "m/s", value: 0},
  kt: {name: "Knots", value: 0},
  mach: {name: "Mach", value: 0},
}

export const toolbarButtons = [
  {
    name: "clearAll",
    description: "Removes all markers from the map and clears the input fields",
  },
  {
    name: "clearMarker",
    description: "Removes all markers from the map",
    function: "focusSwitzerland"
  },
  {
    name: "removePolyline",
    description: "Removes all drawn lines between markers and resets any time/distance values"
  },
  {
    name: "togglePopup",
    description: "Toggles all marker popups on or off",
  },
  {
    name: "focusSwitzerland",
    description: "Centers the map so that the whole of Switzerland is visible",
  },
  {
    name: "focusEurope",
    description: "Centers the map so that the whole of Europe is visible",
  },
  {
    name: "focusWorld",
    description: "Centers the map so that the whole World is visible",
  },
]

function focusSwitzerland(){
  map.setView([46.80, 8.22], 8);
}

function focusEurope(){
  map.setView([53.0, 20.0], 4);
}

function focusWorld(){
  map.setView([40.87, 34.57], 2);
}

function clearMarkers(){
  markerArray.forEach(marker =>{
    marker.removeFrom(map)
  })
  markerArray.length = 0
}

function clearPolylineArray(){
  polylineArray.forEach(polyline =>{
    polyline.removeFrom(map)
  })
  polylineArray.length = 0
  polylineDecoratorArry.forEach(decorator =>{
    decorator.removeFrom(map)
  })
  polylineDecoratorArry.length = 0
  polylineMarkerArray.length = 0
  document.getElementById("polylineField_table_body")!.innerText = ""
  document.getElementById("polylineField")!.style.display = "none"
  state.totalDistance = 0
  state.setSpeed = 0
  state.setDep = ""
  state.setDist= []
  state.setDest = ""
  state.setTime=[]
  state.setTimeFields=0
  state.setTotalDist= 0
  state.setTotalTime= 0
  state.markerClicks= 0
  speedInput.value = ""
}

function togglePopup(){
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
      const bubble = marker.getPopup()!.getElement()!.children[0]! as HTMLElement
      const bubbleTip = marker.getPopup()!.getElement()!.children[1]!.children[0]! as HTMLElement
      bubble.style.background = state.darkmode ? "#050505" : "#fafafa"
      bubble.style.color = state.darkmode ? "#fafafa" : "#050505"
      bubbleTip.style.background = state.darkmode ? "#050505" : "#fafafa"
    })
  }
  state.popupVisible = !state.popupVisible
}

function toggleVFR(){
  toggleCharts(chartLayers[0])
}

function clearTextareas(){
  const textareas:NodeListOf<HTMLTextAreaElement> = document.querySelectorAll(".sidebar_textarea")
  for(const textarea of textareas){
    textarea.value = ""
  }
}

function clearAll(){
  clearTextareas()
  clearMarkers()
  clearPolylineArray()
}

export const toolbarFunctions: ToolbarFunctions ={
  clearAll: () => clearAll(),
  focusSwitzerland: () => focusSwitzerland(),
  focusEurope: () => focusEurope(),
  focusWorld: () => focusWorld(),
  clearMarker: () => clearMarkers(),
  removePolyline: () => clearPolylineArray(),
  togglePopup: () => togglePopup(),
  toggleVFR: () => toggleVFR(),
  clearTextareas: () => clearTextareas()
}

export const warning_routePrediction:string = `
WARNING WARNING WARNING:

The Route Prediction is an unstable experimental setting.
It can return erroneous data or break the application.
Always verify and cross-check results.

The Route Prediction is an algorhythm that analyzes a route input (only from the "ALL" input field) and predicts the most
probable routing if multiple routing options exist.

Example: LSZG - KLO - LSZR:
Without Route Prediction, KLO VOR/DME in Zurich and KLO VOR/DME in the Philippines will be placed on the map.
With Route Prediction, only KLO VOR/DME in Zurich will be placed on the map.

For a detailed explanation on how the algorhythm works, refer to https://github.com/m00gendai/mapping-tool-v3/tree/main/src/utils/routePrediction.ts
`