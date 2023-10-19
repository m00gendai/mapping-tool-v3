import L from "leaflet"
import arc from "arc"
import "leaflet-arc"
import LatLon from 'geodesy/latlon-ellipsoidal-vincenty.js'
import { BaseMap, State } from "../interfaces"
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
  if(flag === "basemap"){
    return `<svg fill="${state.darkmode ? '#fff' : '#000'}" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" enable-background="new 0 0 100 100" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M91.967,7.961c0-0.016,0.005-0.031,0.005-0.047c0-1.51-1.223-2.731-2.73-2.733v0H89.24c0,0,0,0-0.001,0s0,0-0.001,0H39.57 v0l0,0h-0.011v0.011L8.031,36.721H8.028l0,55.365h0.003c0,0,0,0,0,0.001c0,1.507,1.227,2.731,2.734,2.731v0h78.479v0 c1.307-0.002,2.397-0.923,2.663-2.15h0.06v-0.536c0-0.015,0.004-0.029,0.004-0.044s-0.004-0.029-0.004-0.044L91.967,7.961z M67.639,15.138h14.371l0,24.597L63.897,21.621L67.639,15.138z M39.57,39.453v-0.001c1.504-0.006,2.722-1.226,2.722-2.73 c0,0,0-0.001,0-0.001h0V15.138H61.88l-27.17,47.06L17.985,45.473l0-6.02H39.57z M17.985,84.862l0-32.335L32.128,66.67 L21.626,84.862H17.985z M27.385,84.862l33.93-58.769l20.696,20.696l0,38.073H27.385z"></path> <path d="M62.03,45.576c-6.645,0-12.026,5.387-12.026,12.027c0,2.659,0.873,5.109,2.334,7.1l7.759,13.439 c0.047,0.094,0.097,0.186,0.157,0.271l0.016,0.027l0.004-0.002c0.394,0.544,1.028,0.899,1.764,0.899 c0.664,0,1.243-0.302,1.641-0.767l0.02,0.011l0.075-0.129c0.114-0.153,0.214-0.317,0.287-0.497l7.608-13.178 c1.494-2.004,2.39-4.482,2.39-7.175C74.056,50.963,68.675,45.576,62.03,45.576z M61.911,63.7c-3.274,0-5.926-2.651-5.926-5.925 s2.652-5.928,5.926-5.928c3.274,0,5.926,2.654,5.926,5.928S65.185,63.7,61.911,63.7z"></path> </g> </g></svg>`
  }
  if(flag === "conversion"){
    return `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" fill="${state.darkmode ? '#fff' : '#000'}"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>calculator-solid</title> <g id="Layer_2" data-name="Layer 2"> <g id="invisible_box" data-name="invisible box"> <rect width="48" height="48" fill="none"></rect> </g> <g id="icons_Q2" data-name="icons Q2"> <g> <path d="M42,25.5H27.5a2,2,0,0,0-2,2V42a2,2,0,0,0,2,2H42a2,2,0,0,0,2-2V27.5A2,2,0,0,0,42,25.5ZM40,39H30V36H40Zm0-5H30V31H40Z"></path> <path d="M20.5,4H6A2,2,0,0,0,4,6V20.5a2,2,0,0,0,2,2H20.5a2,2,0,0,0,2-2V6A2,2,0,0,0,20.5,4ZM18,14.5H14.5V18h-3V14.5H8v-3h3.5V8h3v3.5H18Z"></path> <path d="M20.5,25.5H6a2,2,0,0,0-2,2V42a2,2,0,0,0,2,2H20.5a2,2,0,0,0,2-2V27.5A2,2,0,0,0,20.5,25.5Zm-2.9,12-2.1,2.1L13,37.1l-2.5,2.5L8.4,37.5,10.9,35,8.4,32.5l2.1-2.1L13,32.9l2.5-2.5,2.1,2.1L15.1,35Z"></path> <path d="M42,4H27.5a2,2,0,0,0-2,2V20.5a2,2,0,0,0,2,2H42a2,2,0,0,0,2-2V6A2,2,0,0,0,42,4ZM40,14.5H30v-3H40Z"></path> </g> </g> </g> </g></svg>`
  }
  if(flag === "layerGroup"){
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--gis" preserveAspectRatio="xMidYMid meet" fill="${state.darkmode ? '#fff' : '#000'}"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M50.049 9.51a4.725 2.593 0 0 0-3.39.76L1.382 35.115a4.725 2.593 0 0 0 0 3.668L46.658 63.63a4.725 2.593 0 0 0 6.684 0l45.275-24.846a4.725 2.593 0 0 0 0-3.668L53.342 10.27a4.725 2.593 0 0 0-3.293-.76zM50 15.77l38.596 21.18L50 58.128l-38.594-21.18zM4.727 46.332l-3.344 1.834a4.725 2.593 0 0 0 0 3.668L46.658 76.68a4.725 2.593 0 0 0 6.684 0l45.275-24.846a4.725 2.593 0 0 0-.002-3.668l-3.342-1.834l-6.683 3.666l.004.002L50 71.18L11.404 50l.004-.002zm0 13.05l-3.344 1.835a4.725 2.593 0 0 0 0 3.668L46.658 89.73a4.725 2.593 0 0 0 6.684 0l45.275-24.846a4.725 2.593 0 0 0-.002-3.668l-3.342-1.834l-6.683 3.666l.004.002L50 84.23L11.404 63.05l.004-.002z" fill="${state.darkmode ? '#fff' : '#000'}"></path></g></svg>`
  }
  if(flag === "sidebarToggle_left"){
    return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M15 6L9 12L15 18" stroke="${state.darkmode ? '#fff' : '#000'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`
  }
  if(flag === "sidebarToggle_right"){
    return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9 6L15 12L9 18" stroke="${state.darkmode ? '#fff' : '#000'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`
  }
  if(flag === "zoomIn"){
    return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 12H20M12 4V20" stroke="${state.darkmode ? '#fff' : '#000'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`
  }
  if(flag === "zoomOut"){
    return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 12L18 12" stroke="${state.darkmode ? '#fff' : '#000'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`
  }
  if(flag ==="focusSwitzerland"){
    return `<svg fill="${state.darkmode ? '#fff' : '#000'}" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 260 169" enable-background="new 0 0 260 169" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M256.733,106.983l-3.508-11.521l3.337-7.112L258,73.028l-5.334-4.896L238.003,80.92l-14.542-7.648l-0.317-6.406 l-22.068-3.897l1.51-15.224l8.233-14.103L183.977,11.72l-18.926-0.049l-12.349-9.646l-9.767,1.705l-0.39,10.498l7.746-1.51 l-1.023,5.334l-22.701-1.949l-5.286,4.043l-20.631,1.145l-11.813-1.315l-2.119,5.432l-8.647,5.48L59.437,24.75l-6.601,8.598 l8.257,4.896L38.489,64.623l-13.08,6.138l-1.291,15.467L6.337,99.6L2,109.979l2.728,11.911l0.731,15.394l8.55-7.307l-6.114-5.286 l8.891-12.471l17.805-5.213l14.517,5.529l-0.39,4.75h-0.024l-4.555-0.341l3.191,23.992l12.057,19.973l17.44-1.096l10.693-6.26 l17.026,6.187l16.685-17.757l-2.095-10.742l18.488-16.442l3.483,3.215l-1.194,13.616l10.182,10.937l13.665,4.823l6.187,19.584 l7.064-3.995l-4.506-7.6l5.261-12.422l5.383-4.579l12.398-25.064l10.79,14.834l6.698,0.024l13.104-6.942l8.574,12.739l5.091-16.441 l-6.284-2.655l3.41-13.421L256.733,106.983z"></path> </g></svg>`
  }
  if(flag === "togglePopup"){
    return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="${state.darkmode ? '#fff' : '#000'}"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M5 6h10v1H5zm0 3v1h7V9zm1 7.519V13H3a1.001 1.001 0 0 1-1-1V4a1.001 1.001 0 0 1 1-1h14a1.001 1.001 0 0 1 1 1v6h1V4a2.002 2.002 0 0 0-2-2H3a2.002 2.002 0 0 0-2 2v8a2.002 2.002 0 0 0 2 2h2v4.481l4-2.908v-1.237zM13 15h7v-1h-7zm0 2h5v-1h-5zm10-4v5a2.002 2.002 0 0 1-2 2h-1v3.5L15.334 20H12a2.002 2.002 0 0 1-2-2v-5a2.002 2.002 0 0 1 2-2h9a2.002 2.002 0 0 1 2 2zm-1 0a1.001 1.001 0 0 0-1-1h-9a1.001 1.001 0 0 0-1 1v5a1.001 1.001 0 0 0 1 1h3.667L19 21.5V19h2a1.001 1.001 0 0 0 1-1z"></path><path fill="none" d="M0 0h24v24H0z"></path></g></svg>`
  }
  if(flag==="removePolyline"){
    return `<svg viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="${state.darkmode ? '#fff' : '#000'}"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>arrow_right_outside [#265]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-340.000000, -6959.000000)" fill="${state.darkmode ? '#fff' : '#000'}"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M303.254,6818.177 C303.629,6817.762 303.615,6817.127 303.223,6816.729 L294.627,6808 L294.628,6808 L286.043,6799.689 C285.648,6799.307 285.019,6799.312 284.631,6799.701 C284.237,6800.094 284.238,6800.731 284.631,6801.125 L293.214,6809.703 L293.213,6809.705 L301.725,6818.215 C302.152,6818.642 302.849,6818.625 303.254,6818.177 L303.254,6818.177 Z M300.657,6801 L296.719,6804.88 C296.323,6805.27 296.323,6805.903 296.719,6806.293 C297.115,6806.684 297.713,6806.684 298.109,6806.294 L302,6802.416 L302,6806 C302,6806.552 302.505,6807 303.066,6807 L303.046,6807 C303.606,6807 304,6806.552 304,6806 L304,6801.002 L304,6800.998 C304,6799.895 303.213,6799 302.093,6799 L297.015,6799 C296.455,6799 296,6799.448 296,6800 L296,6800 C296,6800.552 296.455,6801 297.015,6801 L300.657,6801 Z M287.323,6817 L291.261,6813.12 C291.658,6812.73 291.658,6812.097 291.262,6811.706 C290.865,6811.316 290.278,6811.315 289.881,6811.706 L286,6815.584 L286,6812 C286,6811.448 285.475,6811 284.915,6811 L284.935,6811 C284.374,6811 284,6811.448 284,6812 L284,6816.998 L284,6817.002 C284,6818.105 284.767,6819 285.888,6819 L290.965,6819 C291.526,6819 291.98,6818.552 291.98,6818 L291.98,6818 C291.98,6817.448 291.526,6817 290.965,6817 L287.323,6817 Z" id="arrow_right_outside-[#265]"> </path> </g> </g> </g> </g></svg>`
  }
  if(flag==="clearMarker"){
    return `<svg xmlns="http://www.w3.org/2000/svg" fill="${state.darkmode ? '#fff' : '#000'}" viewBox="0 0 24 24"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M12 6.5c1.38 0 2.5 1.12 2.5 2.5 0 .74-.33 1.39-.83 1.85l3.63 3.63c.98-1.86 1.7-3.8 1.7-5.48 0-3.87-3.13-7-7-7-1.98 0-3.76.83-5.04 2.15l3.19 3.19c.46-.52 1.11-.84 1.85-.84zm4.37 9.6l-4.63-4.63-.11-.11L3.27 3 2 4.27l3.18 3.18C5.07 7.95 5 8.47 5 9c0 5.25 7 13 7 13s1.67-1.85 3.38-4.35L18.73 21 20 19.73l-3.63-3.63z"></path></g></svg>`
  }
  if(flag==="colorMode"){
    return `<svg version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve" fill="${state.darkmode ? '#fff' : '#000'}"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:none;stroke:${state.darkmode ? '#fff' : '#000'};stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;} .st1{fill:none;stroke:${state.darkmode ? '#fff' : '#000'};stroke-width:2;stroke-linejoin:round;stroke-miterlimit:10;} </style> <line class="st0" x1="16" y1="3" x2="16" y2="29"></line> <path class="st0" d="M16,23c-3.87,0-7-3.13-7-7s3.13-7,7-7"></path> <line class="st0" x1="6.81" y1="6.81" x2="8.93" y2="8.93"></line> <line class="st0" x1="3" y1="16" x2="6" y2="16"></line> <line class="st0" x1="6.81" y1="25.19" x2="8.93" y2="23.07"></line> <path class="st0" d="M16,12.55C17.2,10.43,19.48,9,22.09,9c0.16,0,0.31,0.01,0.47,0.02c-1.67,0.88-2.8,2.63-2.8,4.64 c0,2.9,2.35,5.25,5.25,5.25c1.6,0,3.03-0.72,3.99-1.85C28.48,20.43,25.59,23,22.09,23c-2.61,0-4.89-1.43-6.09-3.55"></path> </g></svg>`
  }
  if(flag==="vfrChart"){
    return `<svg fill="${state.darkmode ? '#fff' : '#000'}" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 44.863 44.864" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M19.024,20.959c0.251-0.392,0.087-1.673,0.087-1.673C9.67,16.034,2.607,11.957,3.007,10.3 c0.197-0.819,0.47-1.178,0.659-1.241c0.423-0.138,1.378,0.363,2.548,1.134l1.945-2.284c-0.92-0.565-3.188-2.431-5.416-1.705 C1.833,6.498,0.636,7.326,0.09,9.598c-1.28,5.32,11.41,10.122,18.217,12.484C18.306,22.083,18.773,21.352,19.024,20.959z"></path> <path d="M41.112,10.647c-0.312-0.439-0.638-0.868-0.98-1.281c-3.752-4.501-9.396-7.372-15.701-7.372 c-0.011,0-0.02,0.001-0.03,0.001c-0.007,0-0.013-0.001-0.019-0.001c-0.023,0-0.046,0.003-0.07,0.003 c-6.256,0.036-11.852,2.898-15.58,7.37c-0.344,0.413-0.67,0.841-0.98,1.28c-0.236,0.334-0.456,0.681-0.673,1.029 c0.427,0.27,0.91,0.557,1.449,0.859c0.186-0.297,0.372-0.595,0.574-0.881c1.271,0.849,2.739,1.59,4.364,2.202 c-0.09,0.325-0.158,0.667-0.238,1c0.497,0.217,1.02,0.435,1.553,0.652c0.084-0.375,0.16-0.754,0.256-1.117 c2.581,0.791,5.481,1.266,8.557,1.34v2.131l0.104,0.066l0.146,0.876l0.226,1.342l1.2,0.311v-4.726 c0.596-0.014,1.177-0.056,1.756-0.099l0.439-1.244l0.169-0.48c-0.774,0.074-1.56,0.128-2.364,0.147V3.745 c3.404,0.526,6.335,4.051,8.001,9.097c-0.806,0.239-1.658,0.433-2.529,0.605c0.569,0.286,1.135,0.729,1.537,1.356 c0.491-0.122,0.985-0.242,1.459-0.385c0.626,2.384,0.989,5.035,1.005,7.841h-2.599c-0.027,0.17-0.054,0.33-0.083,0.508 c1.018,0.418,2.228,0.916,2.49,1.024c0.777,0.321,1.357,0.804,1.745,1.392c0.033-0.414,0.069-0.826,0.088-1.248h4.024 c-0.071,0.52-0.138,1.043-0.23,1.543c0.255-0.131,0.478-0.387,0.594-0.869c0.063-0.26,0.07-0.477,0.057-0.674h2.299 c-0.274,3.436-1.483,6.607-3.364,9.273c-1.293-0.863-2.791-1.619-4.453-2.236c0.091-0.332,0.166-0.677,0.246-1.018 c-0.532,0.417-1.199,0.65-1.953,0.65c-0.33,0-0.608-0.043-0.795-0.069l-0.057-0.011c-0.2-0.014-0.481-0.037-2.181-0.619 c0.2-0.27,0.438-0.623,0.699-1.035v-0.838c0.79,0.271,1.463,0.49,1.621,0.501c0.437,0.03,1.559,0.414,1.881-0.921 c0.323-1.336-0.516-1.777-0.982-1.971c-0.265-0.107-1.495-0.613-2.52-1.035v-1.697l-0.584,1.457 c-0.508-0.209-0.873-0.359-0.873-0.359s1.266-6.982,0.92-7.866s-1.383-1.085-1.383-1.085l-2.758,7.812l-2.998-0.775l0,0 l-1.283-0.333l-0.439-2.623l-1.399-0.895c-0.001,0,0.082,2.162-0.124,3.328c-0.039,0.22-0.089,0.405-0.151,0.532 c-0.023,0.049-0.065,0.108-0.099,0.162c-0.146,0.242-0.375,0.531-0.629,0.824c-0.001,0.002-0.003,0.002-0.004,0.004 c-0.12,0.139-0.246,0.276-0.371,0.41c-0.014,0.016-0.027,0.03-0.041,0.045c-0.119,0.125-0.236,0.247-0.349,0.361 c-0.381,0.389-0.686,0.676-0.686,0.676l1.223,0.904l2.036-1.553h0.001l0.461-0.353l0.731,0.353l0,0l1.853,0.891l0.943,0.455l0,0 l0.211,0.102l-3.074,7.664c0,0,1.008,0.905,1.766,0.321c0.759-0.584,3.992-6.446,3.992-6.446s0.565,0.207,1.306,0.475 l-0.172,0.429c0.1-0.003,0.195-0.015,0.296-0.017v1.758c-0.074-0.026-0.143-0.051-0.221-0.078 c-0.108-0.016-0.222-0.025-0.329-0.041c-0.33,0.583-0.632,1.105-0.904,1.568c1.816,0.203,3.548,0.537,5.136,1.006 c-1.667,5.048-4.602,8.57-8.006,9.097v-6.086c-0.493,0.343-1.067,0.532-1.676,0.532v5.566c-3.439-0.472-6.41-4.002-8.094-9.082 c1.715-0.517,3.599-0.879,5.584-1.076l0.696-1.737c-2.403,0.185-4.683,0.604-6.751,1.239c-0.529-2.01-0.867-4.215-0.971-6.539 h1.73l0.44-0.412c-1.368-0.469-2.659-0.939-3.875-1.414c-0.001,0.05-0.005,0.099-0.005,0.148H5.674 c0.009-1.039,0.109-2.056,0.283-3.048c-0.539-0.29-1.052-0.58-1.536-0.872c-0.271,1.324-0.429,2.689-0.429,4.093 c0,4.387,1.395,8.451,3.756,11.783c0.311,0.439,0.637,0.868,0.98,1.28c3.729,4.472,9.324,7.334,15.58,7.37 c0.024,0,0.047,0.003,0.07,0.003c0.006,0,0.012-0.001,0.019-0.001c0.012,0,0.021,0.001,0.03,0.001 c6.305,0,11.949-2.871,15.701-7.371c0.344-0.413,0.67-0.842,0.979-1.28c2.361-3.334,3.756-7.397,3.756-11.785 C44.867,18.046,43.473,13.98,41.112,10.647z M13.941,12.292c-1.441-0.538-2.738-1.186-3.856-1.919 c2.192-2.604,5.077-4.61,8.372-5.72C16.579,6.465,15.018,9.114,13.941,12.292z M23.592,14.056 c-2.918-0.071-5.665-0.511-8.09-1.239c1.684-5.08,4.65-8.613,8.09-9.085V14.056z M5.737,23.936h6.643 c0.109,2.511,0.489,4.894,1.085,7.072c-1.625,0.61-3.094,1.354-4.363,2.201C7.221,30.542,6.011,27.372,5.737,23.936z M10.09,34.488c1.117-0.731,2.412-1.378,3.85-1.916c1.076,3.18,2.639,5.827,4.518,7.638C15.162,39.1,12.284,37.092,10.09,34.488z M30.254,40.262c1.908-1.82,3.494-4.498,4.58-7.721c1.473,0.544,2.797,1.201,3.937,1.947 C36.545,37.131,33.612,39.162,30.254,40.262z M30.254,4.602c3.357,1.1,6.293,3.128,8.52,5.772 c-0.979,0.641-2.102,1.211-3.329,1.706c-0.057-0.016-0.097-0.025-0.097-0.025l-0.025,0.074c-0.163,0.065-0.322,0.133-0.49,0.195 C33.746,9.102,32.162,6.422,30.254,4.602z M36.416,22.26c-0.014-2.987-0.413-5.818-1.108-8.37 c1.659-0.617,3.158-1.371,4.451-2.234c2.12,3.008,3.39,6.658,3.426,10.604H36.416L36.416,22.26z"></path> </g> </g> </g></svg>`
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