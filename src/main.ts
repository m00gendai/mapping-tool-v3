import * as L from "leaflet"
import { LatLngBoundsLiteral } from "leaflet"
import 'leaflet/dist/leaflet.css';
import "./styles/globals.css"
import { placeCoords, placeLoci, placeNavaid, placeBrgDist, placeRep, placePlace } from "./utils/queryFunctions"
import { routeDeconstructor } from "./utils/routeDeconstructor"
import { fieldDesignations, queryAllState, state, sidebarFlags, layerGroups, baseMaps, chartLayers, coordinateConversions } from "./configs"
import { generateArcLine, createIcon, buildTable, createSVG, getBaseLayer, getBaseAttribution, sortLayersByName, disableControls } from "./utils/generalUtils"
import "leaflet-polylinedecorator"
import { QueryInput, State, Parsed, LayerGroup_layer } from "./interfaces"
import { getLayer } from "./layers"
import { getChart } from "./charts"
import { parseCoordinates, calcDegToDec, eetToDecimalHours } from "./utils/conversions"
import "leaflet.geodesic"
import LatLon from 'geodesy/latlon-ellipsoidal-vincenty.js'

document.onreadystatechange = function() {
  if (document.readyState !== "complete") {
      document.getElementById("app")!.style.display = "none"
      document.getElementById("polylineField")!.style.display = "none"
  } else {
    document.getElementById("app")!.style.display = "flex"
    if(!JSON.parse(localStorage.getItem("AMTV3_darkmode") || "{}" )){
        document.body.classList.toggle("lightMode")
    }
    if(typeof localStorage.getItem("AMTV3_basemap") === "string"){
      state.baseLayer = L.tileLayer(getBaseLayer(localStorage.getItem("AMTV3_basemap") || "{}"))
      state.basemapSelect = localStorage.getItem("AMTV3_basemap") || "{}"
    } 
    state.baseLayer.addTo(map)
  }
};

const map: L.Map = L.map('map', {zoomControl:false}).setView([46.80, 8.22], 8);
const markerArray: L.Marker[] = []
const polylineMarkerArray: L.Marker[] = []
const polylineArray: L.Polyline[] = []
const polylineDecoratorArry: L.PolylineDecorator[] = []
const layerArray: (string | L.GeoJSON)[][] = []
const chartArray: L.TileLayer[] = []
const geodesicCircleArray: L.GeodesicCircle[] = []
const balloonMarkerArray: L.Marker[] = []
const geodesicLineArray: L.Geodesic[] = []

document.getElementById("polylineField")!.style.display = "none"
const speedInput = document.getElementById("polylineField_speed")! as HTMLInputElement
speedInput.value = ""

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

function setSidebarVisibility(state:State){
  const sidebars:NodeList = document.querySelectorAll(".sidebarInner")
  sidebars.forEach(sidebar =>{
    const item = sidebar as HTMLElement
    document.getElementById(`${item.id}`)!.style.display = "none"
  })
  document.getElementById(`sidebarInner_${state.sidebarSelect}`)!.style.display = "flex"
}

setSidebarVisibility(state)





const inputArea = document.createElement("div")
inputArea.className="sidebar_inputArea"

function buildSidebarFlags(){
  document.getElementById("sidebarFlags")!.innerHTML = ""
  sidebarFlags.forEach(flag =>{
    const button:HTMLButtonElement = document.createElement("button")
    button.className="flagButton"
    button.innerHTML = createSVG(flag.type, state)
    button.title = flag.text
    document.getElementById("sidebarFlags")?.appendChild(button)
    button.addEventListener("click", function(){
      state.sidebarSelect = flag.type
      setSidebarVisibility(state)
    })
  })
}

buildSidebarFlags()


const queryAllField: HTMLDivElement = document.createElement("div")
queryAllField.className=`sidebar_area`
const queryAll: HTMLTextAreaElement = document.createElement("textarea")
queryAll.className="sidebar_textarea"
queryAll.id = `sidebar_textarea_queryAll`
const queryAllButton: HTMLButtonElement = document.createElement("button")
queryAllButton.className="sidebar_button"
queryAllButton.innerHTML=queryAllState.designation
queryAll.placeholder = queryAllState.placeholder

queryAllField.appendChild(queryAll)
queryAllField.appendChild(queryAllButton)
inputArea.appendChild(queryAllField)

function addMarker(results:string[][], type:string){
  results.forEach(result =>{
    const marker: L.Marker<any> = L.marker([parseFloat(result[0]), parseFloat(result[1])], {icon:createIcon(type)}).bindPopup(result[2], {autoClose: false})
    markerArray.push(marker)
  })
}

function plotMarker(marker:L.Marker){
  polylineMarkerArray.push(marker)
  
  if(polylineMarkerArray.length > 1){
    buildTable(polylineMarkerArray, state)
  state.markerClicks = state.markerClicks + 1
    document.getElementById("polylineField")!.style.display = "flex"
    const polyline = L.polyline(generateArcLine(polylineMarkerArray),{color:"red"})
    polylineArray.push(polyline)
    

  }
  polylineArray.forEach(polyline =>{
    polyline.addTo(map)
    const decorator: L.PolylineDecorator = L.polylineDecorator(polyline, {
      patterns: [
          // defines a pattern of 10px-wide dashes, repeated every 20px on the line
          {offset: 0, repeat: 20, symbol: L.Symbol.arrowHead({pixelSize: 10, pathOptions:{fillOpacity: 1, weight: 0, color: "red"}})}
      ]
    })
    polylineDecoratorArry.push(decorator)
  })
  polylineDecoratorArry.forEach(decorator =>{
    decorator.addTo(map)
  })
}

async function queryTriggerAll(){
  clearMarkers()
  clearPolylineArray()
  queryAllState.value = ""
  const target = document.getElementById(`sidebar_textarea_queryAll`) as HTMLInputElement
  const value: string = target?.value
  queryAllState.value = value
  if(value === ""){
    return
  }
  const deconstructedRte:string[][] = routeDeconstructor(value.toUpperCase())
  // navaids, locis, waypoints, coordinates, brgDistypeof localStorage.getItem("AMTV3_basemap") !== null ? localStorage.getItem("AMTV
  const deconstructedNavaids:string[] = deconstructedRte[0]
  const deconstructedLocis:string[] = deconstructedRte[1]
  const deconstructedWaypoints:string[] = deconstructedRte[2]
  const deconstructedCoord:string[] = deconstructedRte[3]
  const deconstructedBrgDist:string[] = deconstructedRte[4]
  const deconstructedOther:string[] = deconstructedRte[5]

  if(deconstructedNavaids.length !== 0){
    const results: string[][] = placeNavaid(deconstructedNavaids.join(" "))
    addMarker(results, "navaid")
    const textarea = document.getElementById("sidebar_textarea_NAVAID")! as HTMLTextAreaElement
    textarea.value = deconstructedNavaids.join(" ")

  }
  if(deconstructedLocis.length !== 0){
    const results: string[][] = placeLoci(deconstructedLocis.join(" "))
    addMarker(results, "airport")
    const textarea = document.getElementById("sidebar_textarea_LOCI")! as HTMLTextAreaElement
    textarea.value = deconstructedLocis.join(" ")
  }
  if(deconstructedWaypoints.length !== 0){
    const results: string[][] = placeRep(deconstructedWaypoints.join(" ")) 
    addMarker(results, "waypoint")
    const textarea = document.getElementById("sidebar_textarea_WAYPOINT")! as HTMLTextAreaElement
    textarea.value = deconstructedWaypoints.join(" ")
  }
  if(deconstructedCoord.length !== 0){
    const results: string[][] = placeCoords(deconstructedCoord.join(" "))
    addMarker(results, "coordinate")
    const textarea = document.getElementById("sidebar_textarea_COORD")! as HTMLTextAreaElement
    textarea.value = deconstructedCoord.join(" ")
  }
  if(deconstructedBrgDist.length !== 0){
    const results: string[][] = placeBrgDist(deconstructedBrgDist.join(" "))
    addMarker(results, "brgdist")
    const textarea = document.getElementById("sidebar_textarea_BRG/DIST")! as HTMLTextAreaElement
    textarea.value = deconstructedBrgDist.join(" ")
  }
  if(deconstructedOther.length !== 0){
    const results: string[][] = await placePlace(deconstructedOther.join(" "))
    const textarea = document.getElementById("sidebar_textarea_PLACE")! as HTMLTextAreaElement
    if(results[0][0] === "ERROR" && results[0][1] === "ERROR" && results[0][2] === "ERROR"){
      textarea.value = "ERROR GETTING LOCATION INFO"
    } else {
      addMarker(results, "location")
      textarea.value = deconstructedOther.join(",")
    }
  }

  document.getElementById("polylineField_speed")!.addEventListener("keyup", function(){
    const inputField = document.getElementById("polylineField_speed")! as HTMLInputElement
    state.setSpeed = parseInt(inputField.value)
    const timeFields:NodeList = document.querySelectorAll(".polylineField_table_body_time")
    timeFields.forEach((timeField, index) =>{
      const time = state.setDist[index]/state.setSpeed
      const n = new Date(0,0);
      n.setSeconds(+time * 60 * 60);
      const htmlTimeField = timeField as HTMLElement
      htmlTimeField.innerText = n.toTimeString().slice(0, 8)
    })
  })

markerArray.forEach((marker) =>{
  marker.addTo(map)
  marker.addEventListener("dblclick", function(){
    plotMarker(marker)
  })
})
const bounds: L.LatLngBoundsExpression = markerArray.map(marker => [marker.getLatLng().lat, marker.getLatLng().lng]) as LatLngBoundsLiteral
const bnds: L.LatLngBounds = new L.LatLngBounds(bounds)
const sidebarWidth: string = getComputedStyle(document.getElementById("sidebar")!).width
const sidebarToggleWidth:string = getComputedStyle(document.getElementById("sidebarToggle")!).width
map.fitBounds(bnds, {maxZoom:8, paddingTopLeft: [state.sidebarVisible ? parseInt(sidebarWidth+sidebarToggleWidth) : 0, 0]})
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
// Does NOT clear marker and polyline array, because it should be used as additive markers, not reset them
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
        document.getElementById("polylineField_speed")!.addEventListener("keyup", function(){
          const inputField = document.getElementById("polylineField_speed")! as HTMLInputElement
          state.setSpeed = parseInt(inputField.value)
          const timeFields:NodeList = document.querySelectorAll(".polylineField_table_body_time")
          timeFields.forEach((timeField, index) =>{
            const time = state.setDist[index]/state.setSpeed
            const n = new Date(0,0);
            n.setSeconds(+time * 60 * 60);
            const htmlTimeField = timeField as HTMLElement
            htmlTimeField.innerText = n.toTimeString().slice(0, 8)
          })
        })
        markerArray.forEach((marker) =>{
          marker.addTo(map)
          marker.addEventListener("dblclick", function(){
            plotMarker(marker)
          })
        })
      const bounds: L.LatLngBoundsExpression = markerArray.map(marker => [marker.getLatLng().lat, marker.getLatLng().lng]) as LatLngBoundsLiteral
      const bnds: L.LatLngBounds = new L.LatLngBounds(bounds)
      const sidebarWidth: string = getComputedStyle(document.getElementById("sidebar")!).width
      const sidebarToggleWidth:string = getComputedStyle(document.getElementById("sidebarToggle")!).width
        map.fitBounds(bnds, {maxZoom:8, paddingTopLeft: [state.sidebarVisible ? parseInt(sidebarWidth+sidebarToggleWidth) : 0, 0]})
     
}

fieldDesignations.forEach(field =>{
    const textareaField: HTMLDivElement = document.createElement("div")
    textareaField.className=`sidebar_area`
    const textarea: HTMLTextAreaElement = document.createElement("textarea")
    textarea.className="sidebar_textarea"
    textarea.id = `sidebar_textarea_${field.designation}`
    textarea.value = field.value
    textarea.placeholder = field.placeholder
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
      markerArray.forEach(marker =>{
        marker.addTo(map)
      })
    })

    textareaField.appendChild(textarea)
    textareaField.appendChild(button)
    inputArea.appendChild(textareaField)
})

document.getElementById("sidebarInner_query")?.appendChild(inputArea)

baseMaps.forEach(basemap =>{
  const basemapButton = document.createElement("div")
  basemapButton.className="basemapSelect"
  basemapButton.id = `basemapSelect_${basemap.type}`
  const basemapButtonInner = document.createElement("div")
  basemapButtonInner.className="basemapSelect_inner"
  basemapButton.appendChild(basemapButtonInner)
  const mapThumb: L.Map = L.map(basemapButtonInner, {zoomControl:true})  
  disableControls(mapThumb)
  setTimeout(function(){
    mapThumb.invalidateSize(true)
    mapThumb.setView([46.80, 8.22], 6);
  },1000)
  L.tileLayer(getBaseLayer(basemap.type)).addTo(mapThumb)
  if(basemap.type === state.basemapSelect){
    basemapButton.classList.toggle("selectedBorder")
  }
  basemapButton.addEventListener("click", function(){
    document.getElementById(`basemapSelect_${state.basemapSelect}`)!.classList.toggle("selectedBorder")
    basemapButton.classList.toggle("selectedBorder")
    state.baseLayer.removeFrom(map)
    state.baseLayer = L.tileLayer(getBaseLayer(basemap.type), {
      attribution: getBaseAttribution(basemap.type)
    })
    state.baseLayer.addTo(map)
    state.basemapSelect = basemap.type
    localStorage.setItem("AMTV3_basemap", state.basemapSelect)
  })
  document.getElementById("sidebarInner_basemap")?.appendChild(basemapButton)
})


const popupToggleButton: HTMLButtonElement = document.createElement("button")
popupToggleButton.innerHTML = createSVG("togglePopup", state)
popupToggleButton.className="toolbar_button"
popupToggleButton.title="Toggles all marker popups on or off"
popupToggleButton.addEventListener("click", function(){
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
      bubble.style.background = state.darkmode ? "black" : "white"
      bubble.style.color = state.darkmode ? "white" : "black"
      bubbleTip.style.background = state.darkmode ? "black" : "white"
    })
  }
  state.popupVisible = !state.popupVisible
})

const focusSwitzerlandButton: HTMLButtonElement = document.createElement("button")
focusSwitzerlandButton.innerHTML = createSVG("focusSwitzerland", state)
focusSwitzerlandButton.className="toolbar_button"
focusSwitzerlandButton.title="Centers the map so that the whole of Switzerland is visible"
focusSwitzerlandButton.addEventListener("click", function(){
  map.setView([46.80, 8.22], 8);
})

const clearMarkersButton: HTMLButtonElement = document.createElement("button")
clearMarkersButton.innerHTML = createSVG("clearMarker", state)
clearMarkersButton.className="toolbar_button"
clearMarkersButton.title = "Removes all markes from the map"
clearMarkersButton.addEventListener("click", function(){
  clearMarkers()
  clearPolylineArray()
})

const clearPolylinesButton: HTMLButtonElement = document.createElement("button")
clearPolylinesButton.innerHTML = createSVG("removePolyline", state)
clearPolylinesButton.className="toolbar_button"
clearPolylinesButton.title="Removes all drawn lines between markers and resets any time/distance values"
clearPolylinesButton.addEventListener("click", function(){
  clearPolylineArray()
})

const colorModeButton: HTMLButtonElement = document.createElement("button")
colorModeButton.innerHTML = createSVG("colorMode", state)
colorModeButton.className="toolbar_button"
colorModeButton.title="Toggle between Dark and Light Theme"
colorModeButton.addEventListener("click", function(){
  document.body.classList.toggle("lightMode")
  state.darkmode = !state.darkmode
  localStorage.setItem("AMTV3_darkmode", JSON.stringify(state.darkmode))
  buildSidebarFlags()
  layerGroup.innerHTML = createSVG("layerGroup", state)
  document.getElementById("sidebarToggle")!.innerHTML = createSVG("sidebarToggle_left", state)
  document.getElementById("zoomIn")!.innerHTML = createSVG("zoomIn", state)
  document.getElementById("zoomOut")!.innerHTML = createSVG("zoomOut", state)
  clearPolylinesButton.innerHTML = createSVG("removePolyline", state)
  clearMarkersButton.innerHTML = createSVG("clearMarker", state)
  focusSwitzerlandButton.innerHTML = createSVG("focusSwitzerland", state)
  colorModeButton.innerHTML = createSVG("colorMode", state)
  popupToggleButton.innerHTML = createSVG("togglePopup", state)
  vfrLayerDrawerTrigger.innerHTML = createSVG("drawer", state)
})

document.getElementById("toolbar")!.style.width = "50vw"

document.getElementById("toolbar")?.appendChild(clearMarkersButton)
document.getElementById("toolbar")?.appendChild(clearPolylinesButton)
document.getElementById("toolbar")?.appendChild(popupToggleButton)
document.getElementById("toolbar")?.appendChild(focusSwitzerlandButton)
document.getElementById("toolbar")?.appendChild(colorModeButton)

const layerGroup = document.getElementById("layerGroup") as HTMLDivElement
layerGroup.innerHTML = createSVG("layerGroup", state)
console.log(state.checkedLayers)
layerGroups.forEach(group =>{
  group.layers.forEach(layer =>{
    if(state.checkedLayers.includes(layer.id)){
      const setLayer:L.GeoJSON = getLayer(layer)
      setLayer.addTo(map)
      layerArray.push([layer.id, setLayer])
    }
  })
})

layerGroup.addEventListener("click", function(){
layerGroup.style.gridTemplateColumns = "repeat(auto-fill, minmax(250px, 1fr))"
layerGroup.style.placeItems = "start center"
  state.layerGroupBuffer = true
  if(!state.layerGroupVisible){
    layerGroup.innerHTML = ""
    layerGroup.style.width = `60vw`
    layerGroup.style.overflow = "hidden"
    layerGroup.style.overflowY = "hidden"
    setTimeout(function(){
      layerGroup.style.height = "auto"
      layerGroup.style.overflow = "visible"
      layerGroup.style.overflowY = "scroll"
    },200)
    
    state.layerGroupVisible = !state.layerGroupVisible

    layerGroups.forEach(group =>{
      const column: HTMLDivElement = document.createElement("div")
      column.className = "layerGroup_column"

      const column_name: HTMLDivElement = document.createElement("div")
      const column_content: HTMLDivElement = document.createElement("div")
      column.appendChild(column_name)
      column_name.className = "layerGroup_column_name"
      column_name.innerText = group.name

      column.appendChild(column_content)
      column_content.className = "layerGroup_column_content"
      const sortedGroupLayers:LayerGroup_layer[] = group.layers.sort((a,b) => sortLayersByName(a,b))
      sortedGroupLayers.forEach(layer =>{
        const column_content_item: HTMLDivElement = document.createElement("div")
        column_content_item.className = "layerGroup_column_content_item"
        const column_content_checkbox: HTMLInputElement = document.createElement("input")
        column_content_checkbox.id = layer.id
        column_content_checkbox.type = "checkbox"
        if(state.checkedLayers.includes(layer.id)){
          column_content_checkbox.checked = true
        }
        column_content_checkbox.addEventListener("click", function(){
          if(column_content_checkbox.checked){
            if(!state.checkedLayers.includes(layer.id)){
              state.checkedLayers = [...state.checkedLayers, layer.id]
              localStorage.setItem("AMTV3_layers", JSON.stringify(state.checkedLayers))
              const setLayer:L.GeoJSON = getLayer(layer)
              setLayer.addTo(map)
              layerArray.push([layer.id, setLayer])
            }
          }
          if(!column_content_checkbox.checked){
            const removeItemIndex = state.checkedLayers.indexOf(layer.id)
            state.checkedLayers.splice(removeItemIndex, 1)
            localStorage.setItem("AMTV3_layers", JSON.stringify(state.checkedLayers))
            layerArray.forEach(item =>{
              if(item[0] === layer.id){
                const toBeRemovedLayer = item[1] as L.GeoJSON
                toBeRemovedLayer.removeFrom(map)
              }
            })
          }
        })
        const column_content_label: HTMLLabelElement = document.createElement("label")
        column_content_label.htmlFor = layer.id
        column_content_label.innerText = layer.name
        column_content_label.className= "layerGroup_column_content_label"
        column_content_item.appendChild(column_content_checkbox)
        column_content_item.appendChild(column_content_label)
        column_content.appendChild(column_content_item)

      })
      layerGroup.appendChild(column)
    })
  }
})

layerGroup.addEventListener("mouseleave", function(){
  state.layerGroupBuffer = false
  setTimeout(function(){
    if(state.layerGroupVisible && !state.layerGroupBuffer){
      layerGroup.style.width = `3rem`
      layerGroup.style.height = `3rem`
      state.layerGroupVisible = !state.layerGroupVisible
      layerGroup.innerHTML = createSVG("layerGroup", state)
      layerGroup.style.gridTemplateColumns = "1fr"
      layerGroup.style.placeItems = "center center"
    }
  },500)
})

layerGroup.addEventListener("mouseenter", function(){
  state.layerGroupBuffer = true
})

document.getElementById("sidebarToggle")!.innerHTML = createSVG("sidebarToggle_left", state)
document.getElementById("sidebarToggle")!.addEventListener("click", function(){
  if(state.sidebarVisible){
    document.getElementById("sidebar")!.style.left = "calc(-25vw - 2rem)"
    document.getElementById("zoom")!.style.left = "calc(1rem + 10px)"
    document.getElementById("sidebarToggle")!.innerHTML = createSVG("sidebarToggle_right", state)
  }
  if(!state.sidebarVisible){
    document.getElementById("sidebar")!.style.left = "0rem"
    document.getElementById("zoom")!.style.left ="calc(25vw + 1rem + 10px)"
    document.getElementById("sidebarToggle")!.innerHTML = createSVG("sidebarToggle_left", state)
  }
  state.sidebarVisible = !state.sidebarVisible
})
document.getElementById("zoomIn")!.innerHTML = createSVG("zoomIn", state)
document.getElementById("zoomOut")!.innerHTML = createSVG("zoomOut", state)

document.getElementById("zoomIn")!.addEventListener("click", function(){
  map.zoomIn()
})
document.getElementById("zoomOut")!.addEventListener("click", function(){
  map.zoomOut()
})

const vfrLayerDrawer = document.createElement("div")
document.getElementById("app")?.appendChild(vfrLayerDrawer)
vfrLayerDrawer.id = "vfrLayerDrawer"

const vfrLayerDrawerTrigger = document.createElement("div")
vfrLayerDrawer.appendChild(vfrLayerDrawerTrigger)
vfrLayerDrawerTrigger.id = "vfrLayerDrawerTrigger"
vfrLayerDrawerTrigger.innerHTML = createSVG("drawer", state)
vfrLayerDrawerTrigger.title = "Overlay Aeronautical Charts over the Map"
vfrLayerDrawerTrigger.addEventListener("click", function(){
  if(state.drawerVisible){
    vfrLayerDrawer.style.right = "calc(-75vw + 5rem + 10px - 0.125rem)"
  }
  if(!state.drawerVisible){
    vfrLayerDrawer.style.right = "0"
  }
  state.drawerVisible = !state.drawerVisible
})

const vfrLayerDrawerInner = document.createElement("div")
vfrLayerDrawer.appendChild(vfrLayerDrawerInner)
vfrLayerDrawerInner.id = "vfrLayerDrawerInner"

chartLayers.forEach(layer =>{
  const layerButton: HTMLButtonElement = document.createElement("button")
  vfrLayerDrawerInner.appendChild(layerButton)
  layerButton.innerText = layer.description
  layerButton.className = "layerButton"
  layerButton.addEventListener("click", function(){
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
  })
})

const detailsCoordinate:HTMLDetailsElement = document.createElement("details")
detailsCoordinate.className="sidebar_area_details"
/*@ts-expect-error */
const summaryCoordinate:HTMLSummaryElement = document.createElement("summary")
summaryCoordinate.innerText = "Coordinate Conversions"
summaryCoordinate.className="sidebar_area_summary"
detailsCoordinate.appendChild(summaryCoordinate)
document.getElementById("sidebarInner_conversion")!.appendChild(detailsCoordinate)

const coordinateConversionInput: HTMLSelectElement = document.createElement("select")
coordinateConversionInput.className="sidebar_area_select"
detailsCoordinate.appendChild(coordinateConversionInput)
coordinateConversionInput.addEventListener("change", function(){
  state.coordinateConversionSelect = coordinateConversionInput.value
})

coordinateConversions.forEach(conversion =>{
  const option:HTMLOptionElement = document.createElement("option")
  option.value = conversion
  option.text = conversion
  coordinateConversionInput.appendChild(option)
})

function calculateCoordinates(){
  const parsedCoordinates: Parsed = parseCoordinates(coordinateConversionInputField.value, state.coordinateConversionSelect)
    state.parsedDecimalCoordinates = parsedCoordinates.decimal
    for(const [key, value] of Object.entries(parsedCoordinates)){

      if(key === "wgs84degMin"){
        const textarea = document.getElementById(`sidebar_textarea_conversion_0`)! as HTMLTextAreaElement
        textarea.value = value.join(" ").toUpperCase()
      }
      if(key === "wgs84degMinSec"){
        const textarea = document.getElementById(`sidebar_textarea_conversion_1`)! as HTMLTextAreaElement
        textarea.value = value.join(" ").toUpperCase()
      }
      if(key === "decimal"){
        const textarea = document.getElementById(`sidebar_textarea_conversion_2`)! as HTMLTextAreaElement
        textarea.value = value.join(" ").toUpperCase()
      }
      if(key === "swissgrid"){
        const textarea = document.getElementById(`sidebar_textarea_conversion_3`)! as HTMLTextAreaElement
        textarea.value = value.join(" ").toUpperCase()
      }
    }
}

const coordinateConversionInputField:HTMLTextAreaElement = document.createElement("textarea")
detailsCoordinate.appendChild(coordinateConversionInputField)
coordinateConversionInputField.className="sidebar_textarea_large_noMargin"
coordinateConversionInputField.addEventListener("keypress", function(e){
  if(e.key === "Enter"){
    e.preventDefault()
    calculateCoordinates()
  }
})

const convertCoordinates: HTMLButtonElement = document.createElement("button")
detailsCoordinate.appendChild(convertCoordinates)
convertCoordinates.innerText = "Convert Coordiantes"
convertCoordinates.className="sidebar_button_large"
convertCoordinates.addEventListener("click", function(){
  calculateCoordinates()
})

const plotCoordinates: HTMLButtonElement = document.createElement("button")
detailsCoordinate.appendChild(plotCoordinates)
plotCoordinates.innerText = "Plot Coordiantes"
plotCoordinates.className="sidebar_button_large"
plotCoordinates.addEventListener("click", function(){
  const coords:string[][] = state.parsedDecimalCoordinates.map(coord => [coord.split(",")[0], coord.split(",")[1], coord])
  addMarker(coords, "coordinate")
  markerArray.forEach(marker =>{
    marker.addTo(map)
    marker.addEventListener("dblclick", function(){
      plotMarker(marker)
    })
  })
})


coordinateConversions.forEach((conversion, index) =>{
  const textareaField: HTMLDivElement = document.createElement("div")
  textareaField.className=`sidebar_area_wrap`
  const label:HTMLLabelElement = document.createElement("label")
  label.htmlFor = "sidebar_textarea_conversion_${index}"
  label.innerText=conversion
  label.className = "sidebar_area_label"
  textareaField.appendChild(label)
  const textarea: HTMLTextAreaElement = document.createElement("textarea")
  textareaField.appendChild(textarea)
  detailsCoordinate.appendChild(textareaField)
  textarea.className="sidebar_textarea_large"
  textarea.disabled = true
  textarea.id = `sidebar_textarea_conversion_${index}`
})

const balloonCoordinateInputField: HTMLDivElement = document.createElement("div")
balloonCoordinateInputField.className = "sidebar_area_wrap"
document.getElementById("sidebarInner_balloon")!.appendChild(balloonCoordinateInputField)

const balloonCoordinateInputLabel: HTMLLabelElement = document.createElement("label")
balloonCoordinateInputLabel.htmlFor = "balloon_starting_coordinate"
balloonCoordinateInputLabel.innerText = "DEP Coordinate as in FPL"
balloonCoordinateInputLabel.className ="sidebar_area_label"
balloonCoordinateInputField.appendChild(balloonCoordinateInputLabel)
const balloonCoordinateInput: HTMLInputElement = document.createElement("input")
balloonCoordinateInput.type ="text"
balloonCoordinateInput.id = "balloon_starting_coordinate"
balloonCoordinateInput.placeholder = "4710N00710E or 471030N0071030E"
balloonCoordinateInput.className="sidebar_input_large"
balloonCoordinateInputField.appendChild(balloonCoordinateInput)

const balloonSpeedInputField: HTMLDivElement = document.createElement("div")
balloonSpeedInputField.className = "sidebar_area_wrap"
document.getElementById("sidebarInner_balloon")!.appendChild(balloonSpeedInputField)

const balloonSpeedInputLabel: HTMLLabelElement = document.createElement("label")
balloonSpeedInputLabel.htmlFor = "balloon_speed"
balloonSpeedInputLabel.innerText = "Speed in Knots as in FPL"
balloonSpeedInputLabel.className ="sidebar_area_label"
balloonSpeedInputField.appendChild(balloonSpeedInputLabel)
const balloonSpeedInput: HTMLInputElement = document.createElement("input")
balloonSpeedInput.type ="text"
balloonSpeedInput.id = "balloon_speed"
balloonSpeedInput.placeholder = "0010 or 0100"
balloonSpeedInput.className="sidebar_input_large"
balloonSpeedInputField.appendChild(balloonSpeedInput)

const balloonTEETInputField: HTMLDivElement = document.createElement("div")
balloonTEETInputField.className = "sidebar_area_wrap"
document.getElementById("sidebarInner_balloon")!.appendChild(balloonTEETInputField)

const balloonTEETInputLabel: HTMLLabelElement = document.createElement("label")
balloonTEETInputLabel.htmlFor = "balloon_TEET"
balloonTEETInputLabel.innerText = "Total EET as in FPL"
balloonTEETInputLabel.className ="sidebar_area_label"
balloonTEETInputField.appendChild(balloonTEETInputLabel)
const balloonTEETInput: HTMLInputElement = document.createElement("input")
balloonTEETInput.type ="text"
balloonTEETInput.id = "balloon_TEET"
balloonTEETInput.placeholder = "0500 or 2359"
balloonTEETInput.className="sidebar_input_large"
balloonTEETInputField.appendChild(balloonTEETInput)

const balloonDriftInputField: HTMLDivElement = document.createElement("div")
balloonDriftInputField.className = "sidebar_area_wrap"
document.getElementById("sidebarInner_balloon")!.appendChild(balloonDriftInputField)

const balloonDriftInputLabel: HTMLLabelElement = document.createElement("label")
balloonDriftInputLabel.htmlFor = "balloon_drift"
balloonDriftInputLabel.innerText = "Drifting as in FPL (if known)"
balloonDriftInputLabel.className ="sidebar_area_label"
balloonDriftInputField.appendChild(balloonDriftInputLabel)
const balloonDriftInput: HTMLInputElement = document.createElement("input")
balloonDriftInput.type ="text"
balloonDriftInput.id = "balloon_drift"
balloonDriftInput.placeholder = "095 or 265"
balloonDriftInput.className="sidebar_input_large"
balloonDriftInputField.appendChild(balloonDriftInput)

function clearBalloonCircle(){
  geodesicCircleArray.forEach(geodesicCircle =>{
    geodesicCircle.removeFrom(map)
  })
  geodesicCircleArray.length = 0
  balloonMarkerArray.forEach(marker =>{
    marker.removeFrom(map)
  })
  balloonMarkerArray.length = 0
  geodesicLineArray.forEach(geodesicLine =>{
    geodesicLine.removeFrom(map)
  })
  geodesicLineArray.length = 0
}

const plotBalloonCircle: HTMLButtonElement = document.createElement("button")
plotBalloonCircle.innerText = "Plot Circle"
plotBalloonCircle.className = "sidebar_button_large"
document.getElementById("sidebarInner_balloon")!.appendChild(plotBalloonCircle)
plotBalloonCircle.addEventListener("click", function(){
  clearBalloonCircle()
  const start:string[] = calcDegToDec(balloonCoordinateInput.value)
  const speed: number = parseFloat(balloonSpeedInput.value)*1.852
  const teet: string = balloonTEETInput.value
  const decimalTeet:number = eetToDecimalHours(teet)
  const dist: number = speed*decimalTeet
  const startCoord = new L.LatLng(parseFloat(start[0]), parseFloat(start[1]))
  const geodesicCircle = new L.GeodesicCircle(startCoord, {radius: dist*1000, steps: 180})
  geodesicCircleArray.push(geodesicCircle)
  const startMarker: L.Marker<any> = L.marker([parseFloat(start[0]), parseFloat(start[1])], {icon:createIcon("coordinate")}).bindPopup(`Balloon Starting Point:\n${start[0]},${start[1]}`, {autoClose: false})
  balloonMarkerArray.push(startMarker)
  if(balloonDriftInput.value !== ""){
    const p1 = new LatLon(parseFloat(start[0]), parseFloat(start[1]))
    const p2 = p1.destinationPoint((dist*1000), parseInt(balloonDriftInput.value))
    const endMarker: L.Marker<any> = L.marker([parseFloat(p2._lat.toString()), parseFloat(p2._lon.toString())], {icon:createIcon("coordinate")}).bindPopup(`Balloon approximate destination:\n${p2._lat.toString()},${p2._lon.toString()}`, {autoClose: false})
    balloonMarkerArray.push(endMarker)
    const geodesicLine: L.Geodesic = L.geodesic([startCoord, new L.LatLng(p2._lat, p2._lon)])
    geodesicLineArray.push(geodesicLine)
    geodesicLineArray.forEach(geodesicLine =>{
      geodesicLine.addTo(map)
    })
  }
  balloonMarkerArray.forEach(marker =>{
    marker.addTo(map)
  })
  geodesicCircleArray.forEach(geodesicCircle =>{
    geodesicCircle.addTo(map)
  })
})

const removeBalloonCircle: HTMLButtonElement = document.createElement("button")
removeBalloonCircle.innerText = "Remove Circle"
removeBalloonCircle.className = "sidebar_button_large"
document.getElementById("sidebarInner_balloon")!.appendChild(removeBalloonCircle)
removeBalloonCircle.addEventListener("click", function(){
  clearBalloonCircle()
})

