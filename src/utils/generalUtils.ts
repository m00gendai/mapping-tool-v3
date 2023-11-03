import L from "leaflet"
import arc from "arc"
import "leaflet-arc"
import LatLon from 'geodesy/latlon-ellipsoidal-vincenty.js'
import { BaseMap, State, LayerGroup_layer } from "../interfaces"
import {baseMaps} from "../configs"

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
        iconAnchor: [19, 38],
        popupAnchor: [0, -40],
        shadowUrl: '',
        shadowSize: [68, 95],
        shadowAnchor: [22, 94]
    })
    return icon
}

function setColor(state:State){
  return state.darkmode ? '#cacaca' : '#050505'
}

export function createSVG(flag:string, state:State){
  if(flag === "query"){
    return `<svg fill="${setColor(state)}" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M50,10.417c-15.581,0-28.201,12.627-28.201,28.201c0,6.327,2.083,12.168,5.602,16.873L45.49,86.823 c0.105,0.202,0.21,0.403,0.339,0.588l0.04,0.069l0.011-0.006c0.924,1.278,2.411,2.111,4.135,2.111c1.556,0,2.912-0.708,3.845-1.799 l0.047,0.027l0.179-0.31c0.264-0.356,0.498-0.736,0.667-1.155L72.475,55.65c3.592-4.733,5.726-10.632,5.726-17.032 C78.201,23.044,65.581,10.417,50,10.417z M49.721,52.915c-7.677,0-13.895-6.221-13.895-13.895c0-7.673,6.218-13.895,13.895-13.895 s13.895,6.222,13.895,13.895C63.616,46.693,57.398,52.915,49.721,52.915z"></path> </g> </g></svg>`
  }
  if(flag === "basemap"){
    return `<svg fill="${setColor(state)}" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M91.967,7.961c0-0.016,0.005-0.031,0.005-0.047c0-1.51-1.223-2.731-2.73-2.733v0H89.24c0,0,0,0-0.001,0s0,0-0.001,0H39.57 v0l0,0h-0.011v0.011L8.031,36.721H8.028l0,55.365h0.003c0,0,0,0,0,0.001c0,1.507,1.227,2.731,2.734,2.731v0h78.479v0 c1.307-0.002,2.397-0.923,2.663-2.15h0.06v-0.536c0-0.015,0.004-0.029,0.004-0.044s-0.004-0.029-0.004-0.044L91.967,7.961z M67.639,15.138h14.371l0,24.597L63.897,21.621L67.639,15.138z M39.57,39.453v-0.001c1.504-0.006,2.722-1.226,2.722-2.73 c0,0,0-0.001,0-0.001h0V15.138H61.88l-27.17,47.06L17.985,45.473l0-6.02H39.57z M17.985,84.862l0-32.335L32.128,66.67 L21.626,84.862H17.985z M27.385,84.862l33.93-58.769l20.696,20.696l0,38.073H27.385z"></path> <path d="M62.03,45.576c-6.645,0-12.026,5.387-12.026,12.027c0,2.659,0.873,5.109,2.334,7.1l7.759,13.439 c0.047,0.094,0.097,0.186,0.157,0.271l0.016,0.027l0.004-0.002c0.394,0.544,1.028,0.899,1.764,0.899 c0.664,0,1.243-0.302,1.641-0.767l0.02,0.011l0.075-0.129c0.114-0.153,0.214-0.317,0.287-0.497l7.608-13.178 c1.494-2.004,2.39-4.482,2.39-7.175C74.056,50.963,68.675,45.576,62.03,45.576z M61.911,63.7c-3.274,0-5.926-2.651-5.926-5.925 s2.652-5.928,5.926-5.928c3.274,0,5.926,2.654,5.926,5.928S65.185,63.7,61.911,63.7z"></path> </g> </g></svg>`
  }
  if(flag === "conversion"){
    return `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="${setColor(state)}"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>calculator-solid</title> <g id="Layer_2" data-name="Layer 2"> <g id="invisible_box" data-name="invisible box"> <rect width="48" height="48" fill="none"></rect> </g> <g id="icons_Q2" data-name="icons Q2"> <g> <path d="M42,25.5H27.5a2,2,0,0,0-2,2V42a2,2,0,0,0,2,2H42a2,2,0,0,0,2-2V27.5A2,2,0,0,0,42,25.5ZM40,39H30V36H40Zm0-5H30V31H40Z"></path> <path d="M20.5,4H6A2,2,0,0,0,4,6V20.5a2,2,0,0,0,2,2H20.5a2,2,0,0,0,2-2V6A2,2,0,0,0,20.5,4ZM18,14.5H14.5V18h-3V14.5H8v-3h3.5V8h3v3.5H18Z"></path> <path d="M20.5,25.5H6a2,2,0,0,0-2,2V42a2,2,0,0,0,2,2H20.5a2,2,0,0,0,2-2V27.5A2,2,0,0,0,20.5,25.5Zm-2.9,12-2.1,2.1L13,37.1l-2.5,2.5L8.4,37.5,10.9,35,8.4,32.5l2.1-2.1L13,32.9l2.5-2.5,2.1,2.1L15.1,35Z"></path> <path d="M42,4H27.5a2,2,0,0,0-2,2V20.5a2,2,0,0,0,2,2H42a2,2,0,0,0,2-2V6A2,2,0,0,0,42,4ZM40,14.5H30v-3H40Z"></path> </g> </g> </g> </g></svg>`
  }
  if(flag === "balloon"){
    return `<svg fill="${setColor(state)}" height="200px" width="200px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M391.802,57.089C367.815,19.207,322.123,0,256,0S144.186,19.207,120.198,57.089 c-43.859,69.261,4.45,173.256,6.527,177.649l72.3,145.017h6.37v27.754h-16.196V512h131.167V407.509h-13.615v-27.754h6.224 l72.159-144.726l0.142-0.292C387.352,230.344,435.66,126.35,391.802,57.089z M218.564,94.387 c6.868-40.68,23.428-58.591,28.036-62.889c3.074-0.097,6.204-0.151,9.401-0.151c3.007,0,5.952,0.051,8.851,0.137 c4.167,3.867,19.984,20.713,27.278,58.821c7.801,40.765,6.892,112.174-36.415,227.231 C213.497,205.338,211.725,134.89,218.564,94.387z M275.403,379.756v27.754h-38.661v-27.754H275.403z M155.009,221.218 c-1.741-3.762-42.495-93.4-8.327-147.359c11.506-18.171,30.875-30.562,57.807-37.087c-6.174,11.833-12.112,27.434-15.98,47.641 c-6.127,32.014-5.814,69.533,0.93,111.518c7.323,45.583,22.332,96.792,44.648,152.478h-15.663L155.009,221.218z M289.019,480.653 h-68.472v-41.797h68.472V480.653z M356.988,221.226l-63.411,127.183h-16.238c22.316-55.686,37.326-106.895,44.647-152.478 c6.744-41.985,7.057-79.504,0.93-111.518c-3.885-20.299-9.859-35.95-16.063-47.803c27.248,6.474,46.823,18.901,58.428,37.188 C399.416,127.589,358.673,217.571,356.988,221.226z"></path> </g> </g> </g></svg>`
  }
  if(flag === "settings"){
    return `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g fill="${setColor(state)}" fill-rule="evenodd" clip-rule="evenodd"> <path d="M8 5a3 3 0 100 6 3 3 0 000-6zM6.5 8a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"></path> <path d="M7.5 0a1.75 1.75 0 00-1.75 1.75v.15c-.16.06-.318.125-.472.196l-.106-.106a1.75 1.75 0 00-2.475 0l-.707.707a1.75 1.75 0 000 2.475l.106.106a6.46 6.46 0 00-.196.472h-.15A1.75 1.75 0 000 7.5v1c0 .966.784 1.75 1.75 1.75h.15c.06.16.125.318.196.472l-.106.107a1.75 1.75 0 000 2.474l.707.708a1.75 1.75 0 002.475 0l.106-.107c.154.071.312.137.472.196v.15c0 .966.784 1.75 1.75 1.75h1a1.75 1.75 0 001.75-1.75v-.15c.16-.06.318-.125.472-.196l.106.107a1.75 1.75 0 002.475 0l.707-.707a1.75 1.75 0 000-2.475l-.106-.107c.071-.154.137-.311.196-.472h.15A1.75 1.75 0 0016 8.5v-1a1.75 1.75 0 00-1.75-1.75h-.15a6.455 6.455 0 00-.196-.472l.106-.106a1.75 1.75 0 000-2.475l-.707-.707a1.75 1.75 0 00-2.475 0l-.106.106a6.46 6.46 0 00-.472-.196v-.15A1.75 1.75 0 008.5 0h-1zm-.25 1.75a.25.25 0 01.25-.25h1a.25.25 0 01.25.25v.698c0 .339.227.636.555.724.42.113.817.28 1.186.492a.75.75 0 00.905-.12l.493-.494a.25.25 0 01.354 0l.707.708a.25.25 0 010 .353l-.494.494a.75.75 0 00-.12.904c.213.369.38.767.492 1.186a.75.75 0 00.724.555h.698a.25.25 0 01.25.25v1a.25.25 0 01-.25.25h-.698a.75.75 0 00-.724.555c-.113.42-.28.817-.492 1.186a.75.75 0 00.12.905l.494.493a.25.25 0 010 .354l-.707.707a.25.25 0 01-.354 0l-.494-.494a.75.75 0 00-.904-.12 4.966 4.966 0 01-1.186.492.75.75 0 00-.555.724v.698a.25.25 0 01-.25.25h-1a.25.25 0 01-.25-.25v-.698a.75.75 0 00-.555-.724 4.966 4.966 0 01-1.186-.491.75.75 0 00-.904.12l-.494.493a.25.25 0 01-.354 0l-.707-.707a.25.25 0 010-.354l.494-.493a.75.75 0 00.12-.905 4.966 4.966 0 01-.492-1.186.75.75 0 00-.724-.555H1.75a.25.25 0 01-.25-.25v-1a.25.25 0 01.25-.25h.698a.75.75 0 00.724-.555c.113-.42.28-.817.491-1.186a.75.75 0 00-.12-.904L3.05 4.11a.25.25 0 010-.353l.707-.708a.25.25 0 01.354 0l.493.494c.24.24.611.289.905.12a4.965 4.965 0 011.186-.492.75.75 0 00.555-.724V1.75z"></path> </g> </g></svg>`
  }
  if(flag === "layerGroup"){
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--gis" preserveAspectRatio="xMidYMid meet" fill="${setColor(state)}"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M50.049 9.51a4.725 2.593 0 0 0-3.39.76L1.382 35.115a4.725 2.593 0 0 0 0 3.668L46.658 63.63a4.725 2.593 0 0 0 6.684 0l45.275-24.846a4.725 2.593 0 0 0 0-3.668L53.342 10.27a4.725 2.593 0 0 0-3.293-.76zM50 15.77l38.596 21.18L50 58.128l-38.594-21.18zM4.727 46.332l-3.344 1.834a4.725 2.593 0 0 0 0 3.668L46.658 76.68a4.725 2.593 0 0 0 6.684 0l45.275-24.846a4.725 2.593 0 0 0-.002-3.668l-3.342-1.834l-6.683 3.666l.004.002L50 71.18L11.404 50l.004-.002zm0 13.05l-3.344 1.835a4.725 2.593 0 0 0 0 3.668L46.658 89.73a4.725 2.593 0 0 0 6.684 0l45.275-24.846a4.725 2.593 0 0 0-.002-3.668l-3.342-1.834l-6.683 3.666l.004.002L50 84.23L11.404 63.05l.004-.002z" fill="${setColor(state)}"></path></g></svg>`
  }
  if(flag === "sidebarToggle_left"){
    return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15 6L9 12L15 18" stroke="${setColor(state)}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`
  }
  if(flag === "sidebarToggle_right"){
    return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9 6L15 12L9 18" stroke="${setColor(state)}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`
  }
  if(flag === "zoomIn"){
    return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 12H20M12 4V20" stroke="${setColor(state)}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`
  }
  if(flag === "zoomOut"){
    return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 12L18 12" stroke="${setColor(state)}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`
  }
  if(flag ==="focusSwitzerland"){
    return `<svg fill="${setColor(state)}" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 260 169" enable-background="new 0 0 260 169" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M256.733,106.983l-3.508-11.521l3.337-7.112L258,73.028l-5.334-4.896L238.003,80.92l-14.542-7.648l-0.317-6.406 l-22.068-3.897l1.51-15.224l8.233-14.103L183.977,11.72l-18.926-0.049l-12.349-9.646l-9.767,1.705l-0.39,10.498l7.746-1.51 l-1.023,5.334l-22.701-1.949l-5.286,4.043l-20.631,1.145l-11.813-1.315l-2.119,5.432l-8.647,5.48L59.437,24.75l-6.601,8.598 l8.257,4.896L38.489,64.623l-13.08,6.138l-1.291,15.467L6.337,99.6L2,109.979l2.728,11.911l0.731,15.394l8.55-7.307l-6.114-5.286 l8.891-12.471l17.805-5.213l14.517,5.529l-0.39,4.75h-0.024l-4.555-0.341l3.191,23.992l12.057,19.973l17.44-1.096l10.693-6.26 l17.026,6.187l16.685-17.757l-2.095-10.742l18.488-16.442l3.483,3.215l-1.194,13.616l10.182,10.937l13.665,4.823l6.187,19.584 l7.064-3.995l-4.506-7.6l5.261-12.422l5.383-4.579l12.398-25.064l10.79,14.834l6.698,0.024l13.104-6.942l8.574,12.739l5.091-16.441 l-6.284-2.655l3.41-13.421L256.733,106.983z"></path> </g></svg>`
  }
  if(flag === "togglePopup"){
    return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="${setColor(state)}"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M5 6h10v1H5zm0 3v1h7V9zm1 7.519V13H3a1.001 1.001 0 0 1-1-1V4a1.001 1.001 0 0 1 1-1h14a1.001 1.001 0 0 1 1 1v6h1V4a2.002 2.002 0 0 0-2-2H3a2.002 2.002 0 0 0-2 2v8a2.002 2.002 0 0 0 2 2h2v4.481l4-2.908v-1.237zM13 15h7v-1h-7zm0 2h5v-1h-5zm10-4v5a2.002 2.002 0 0 1-2 2h-1v3.5L15.334 20H12a2.002 2.002 0 0 1-2-2v-5a2.002 2.002 0 0 1 2-2h9a2.002 2.002 0 0 1 2 2zm-1 0a1.001 1.001 0 0 0-1-1h-9a1.001 1.001 0 0 0-1 1v5a1.001 1.001 0 0 0 1 1h3.667L19 21.5V19h2a1.001 1.001 0 0 0 1-1z"></path><path fill="none" d="M0 0h24v24H0z"></path></g></svg>`
  }
  if(flag==="removePolyline"){
    return `<svg version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64" enable-background="new 0 0 64 64" xml:space="preserve" fill=${setColor(state)}><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect x="1" y="53" fill="none" stroke=${setColor(state)} stroke-width="2" stroke-miterlimit="10" width="10" height="10"></rect> <rect x="53" y="1" fill="none" stroke=${setColor(state)} stroke-width="2" stroke-miterlimit="10" width="10" height="10"></rect> <g> <g> <polyline fill="none" stroke=${setColor(state)} stroke-width="2" stroke-miterlimit="10" points="44,22 44,20 42,20 "></polyline> <line fill="none" stroke=${setColor(state)} stroke-width="2" stroke-miterlimit="10" stroke-dasharray="4,2" x1="40" y1="20" x2="23" y2="20"></line> <polyline fill="none" stroke=${setColor(state)} stroke-width="2" stroke-miterlimit="10" points="22,20 20,20 20,22 "></polyline> <line fill="none" stroke=${setColor(state)} stroke-width="2" stroke-miterlimit="10" stroke-dasharray="4,2" x1="20" y1="24" x2="20" y2="41"></line> <polyline fill="none" stroke=${setColor(state)} stroke-width="2" stroke-miterlimit="10" points="20,42 20,44 22,44 "></polyline> <line fill="none" stroke=${setColor(state)} stroke-width="2" stroke-miterlimit="10" stroke-dasharray="4,2" x1="24" y1="44" x2="41" y2="44"></line> <polyline fill="none" stroke=${setColor(state)} stroke-width="2" stroke-miterlimit="10" points="42,44 44,44 44,42 "></polyline> <line fill="none" stroke=${setColor(state)} stroke-width="2" stroke-miterlimit="10" stroke-dasharray="4,2" x1="44" y1="40" x2="44" y2="23"></line> </g> </g> <line fill="none" stroke=${setColor(state)} stroke-width="2" stroke-miterlimit="10" x1="11" y1="53" x2="20" y2="44"></line> <line fill="none" stroke=${setColor(state)} stroke-width="2" stroke-miterlimit="10" x1="44" y1="20" x2="53" y2="11"></line> <line fill="none" stroke=${setColor(state)} stroke-width="2" stroke-miterlimit="10" x1="39" y1="32" x2="25" y2="32"></line> </g></svg>`
  }
  if(flag==="clearMarker"){
    return `<svg xmlns="http://www.w3.org/2000/svg" fill="${setColor(state)}" viewBox="0 0 24 24"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M12 6.5c1.38 0 2.5 1.12 2.5 2.5 0 .74-.33 1.39-.83 1.85l3.63 3.63c.98-1.86 1.7-3.8 1.7-5.48 0-3.87-3.13-7-7-7-1.98 0-3.76.83-5.04 2.15l3.19 3.19c.46-.52 1.11-.84 1.85-.84zm4.37 9.6l-4.63-4.63-.11-.11L3.27 3 2 4.27l3.18 3.18C5.07 7.95 5 8.47 5 9c0 5.25 7 13 7 13s1.67-1.85 3.38-4.35L18.73 21 20 19.73l-3.63-3.63z"></path></g></svg>`
  }
  if(flag==="colorMode"){
    return `<svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve" fill="${setColor(state)}"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:none;stroke:${setColor(state)};stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;} .st1{fill:none;stroke:${setColor(state)};stroke-width:2;stroke-linejoin:round;stroke-miterlimit:10;} </style> <line class="st0" x1="16" y1="3" x2="16" y2="29"></line> <path class="st0" d="M16,23c-3.87,0-7-3.13-7-7s3.13-7,7-7"></path> <line class="st0" x1="6.81" y1="6.81" x2="8.93" y2="8.93"></line> <line class="st0" x1="3" y1="16" x2="6" y2="16"></line> <line class="st0" x1="6.81" y1="25.19" x2="8.93" y2="23.07"></line> <path class="st0" d="M16,12.55C17.2,10.43,19.48,9,22.09,9c0.16,0,0.31,0.01,0.47,0.02c-1.67,0.88-2.8,2.63-2.8,4.64 c0,2.9,2.35,5.25,5.25,5.25c1.6,0,3.03-0.72,3.99-1.85C28.48,20.43,25.59,23,22.09,23c-2.61,0-4.89-1.43-6.09-3.55"></path> </g></svg>`
  }
  if(flag === "drawer"){
    return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="${setColor(state)}"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M23 13H13v10h10zm-9 9v-5h5v2h-2v1h2v2zm8 0h-2v-5h2zm0-6h-8v-2h8zM11 1H1v10h10zm-.519 7.085l-.1-.008c-.133-.01-.252-.039-.381-.056V10H5.956c.019.067.043.13.058.2H4.981c-.023-.071-.062-.131-.089-.2H2V7.266a3.707 3.707 0 0 0-.108-.046l-.093-.035-.166-1.129.367.138V2h2.053a7.315 7.315 0 0 1-.094-.422l-.016-.1.989-.155.015.1c.007.04.042.254.126.577H10v5.014c.152.024.299.054.46.067l.1.008zm-.021-1.004l.1.008-.079.996-.1-.008c-.133-.01-.252-.039-.381-.056C5.759 7.455 4.385 3.332 4.053 2a7.315 7.315 0 0 1-.094-.422l-.016-.1.989-.155.015.1c.007.04.042.254.126.577C5.42 3.328 6.603 6.488 10 7.014c.152.024.299.054.46.067zM5.956 10c.019.067.043.13.058.2H4.981c-.023-.071-.062-.131-.089-.2A5.654 5.654 0 0 0 2 7.266a3.707 3.707 0 0 0-.108-.046l-.093-.035-.166-1.129.611.229c.14.052 2.995 1.168 3.712 3.715zM23 9V1H13v10h10zm-1-7v6h-4V7h2V5h1V2zm-3 3v1h-5V4h3v1zm1-3v2h-2V2zm-6 0h3v1h-3zm0 8V7h3v2h5v1zM1 23h10V13H1zm1-1v-1.614A4.076 4.076 0 0 0 3.313 20a2.44 2.44 0 0 0 .6-1.413c.125-1.22.36-1.595 1.65-1.586a1.976 1.976 0 0 1 1.8 1.003c1.01.879 1.552 1.282 2.292 1.048a3.123 3.123 0 0 1 .345-.08V22zm8-8v3.937a9.113 9.113 0 0 0-.646.161c-.501.159-.765-.247-1.528-.99a2.738 2.738 0 0 0-2.224-1.066 2.538 2.538 0 0 0-2.39 1.045c-.306.453.01 1.248-.5 2.038a1.199 1.199 0 0 1-.712.192V14z"></path><path fill="none" d="M0 0h24v24H0z"></path></g></svg>`
  }
  if(flag === "info"){
    return `<svg fill=${setColor(state)} viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>book</title> <path d="M15 25.875v-19.625c0 0-2.688-2.25-6.5-2.25s-6.5 2-6.5 2v19.875c0 0 2.688-1.938 6.5-1.938s6.5 1.938 6.5 1.938zM29 25.875v-19.625c0 0-2.688-2.25-6.5-2.25s-6.5 2-6.5 2v19.875c0 0 2.688-1.938 6.5-1.938s6.5 1.938 6.5 1.938zM31 8h-1v19h-12v1h-5v-1h-12v-19h-1v20h12v1h7.062l-0.062-1h12v-20z"></path> </g></svg>`
  }
  if(flag === "minimalSearch"){
    return `<svg fill=${setColor(state)} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" transform="matrix(-1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M 19 3 C 13.489 3 9 7.489 9 13 C 9 15.395 9.839 17.5875 11.25 19.3125 L 3.28125 27.28125 L 4.71875 28.720703 L 12.6875 20.751953 C 14.4115 22.161953 16.605 23 19 23 C 24.511 23 29 18.511 29 13 C 29 7.489 24.511 3 19 3 z M 19 5 C 23.43 5 27 8.57 27 13 C 27 17.43 23.43 21 19 21 C 14.57 21 11 17.43 11 13 C 11 8.57 14.57 5 19 5 z M 19 8 C 16.791 8 15 9.791 15 12 C 15 15 19 19 19 19 C 19 19 23 15 23 12 C 23 9.791 21.209 8 19 8 z M 19 10 C 20.105 10 21 10.895 21 12 C 21 13.104 20.105 14 19 14 C 17.895 14 17 13.104 17 12 C 17 10.895 17.895 10 19 10 z"></path></g></svg>`
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

export function getBaseLayer(type:string){
  const map:BaseMap[] = baseMaps.filter(basemap =>  basemap.type === type
  )
  return map[0].layer
}
export function getBaseAttribution(type:string){
  const map:BaseMap[] = baseMaps.filter(basemap =>  basemap.type === type
    )
    return map[0].attribution
}

export function sortLayersByName(layerA:LayerGroup_layer, layerB:LayerGroup_layer){
  const nameA:string = layerA.name
  const nameB:string = layerB.name
  return nameA > nameB ? 1 : nameA < nameB ? -1 : 0
}

export function disableControls(map:L.Map){
  map.dragging.disable();
  map.touchZoom.disable();
  map.doubleClickZoom.disable();
  map.scrollWheelZoom.disable();
  map.boxZoom.disable();
  map.keyboard.disable();
  if (map.tap) map.tap.disable();
}