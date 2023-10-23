import * as L from "leaflet"
import { LatLngBoundsLiteral } from "leaflet"
import 'leaflet/dist/leaflet.css';
import "./styles/globals.css"
import { placeCoords, placeLoci, placeNavaid, placeBrgDist, placeRep, placePlace } from "./utils/queryFunctions"
import { routeDeconstructor } from "./utils/routeDeconstructor"
import { fieldDesignations, queryAllState, state, sidebarFlags, layerGroups, baseMaps, chartLayers } from "./configs"
import { generateArcLine, createIcon, buildTable, createSVG, getBaseLayer, getBaseAttribution } from "./utils/generalUtils"
import "leaflet-polylinedecorator"
import { ChartLayer, QueryInput, State } from "./interfaces"
import { getLayer } from "./layers"
import { getChart } from "./charts"

const map: L.Map = L.map('map', {zoomControl:false}).setView([46.80, 8.22], 8);
const markerArray: L.Marker[] = []
const polylineMarkerArray: L.Marker[] = []
const polylineArray: L.Polyline[] = []
const polylineDecoratorArry: L.PolylineDecorator[] = []
const layerArray: (string | L.GeoJSON)[][] = []
const chartArray: L.TileLayer[] = []

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

state.baseLayer.addTo(map)



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
  basemapButton.innerHTML = basemap.type
  basemapButton.addEventListener("click", function(){
    state.baseLayer.removeFrom(map)
    state.baseLayer = L.tileLayer(getBaseLayer(basemap.type), {
      attribution: getBaseAttribution(basemap.type)
    })
    state.baseLayer.addTo(map)
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

layerGroup.addEventListener("click", function(){
layerGroup.style.gridTemplateColumns = "repeat(auto-fill, minmax(250px, 1fr))"
layerGroup.style.placeItems = "start center"
  state.layerGroupBuffer = true
  if(!state.layerGroupVisible){
    layerGroup.innerHTML = ""
    layerGroup.style.width = `60vw`
    layerGroup.style.overflow = "hidden"
    setTimeout(function(){
      layerGroup.style.height = "auto"
      layerGroup.style.overflow = "visible"
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
      group.layers.forEach(layer =>{
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
              const setLayer:L.GeoJSON = getLayer(layer)
              console.log(setLayer)
              setLayer.addTo(map)
              layerArray.push([layer.id, setLayer])
            }
          }
          if(!column_content_checkbox.checked){
            const removeItemIndex = state.checkedLayers.indexOf(layer.id)
            state.checkedLayers.splice(removeItemIndex, 1)
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