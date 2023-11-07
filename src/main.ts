import * as L from "leaflet"
import { LatLngBoundsLiteral } from "leaflet"
import 'leaflet/dist/leaflet.css';
import "./styles/globals.css"
import { placeCoords, placeLoci, placeNavaid, placeBrgDist, placeRep, placePlace } from "./utils/queryFunctions"
import { routeDeconstructor } from "./utils/routeDeconstructor"
import { fieldDesignations, queryAllState, state, sidebarFlags, layerGroups, baseMaps, chartLayers, coordinateConversions, settings, infos, distanceConversions, distances, speeds, speedConversions, toolbarButtons, toolbarFunctions } from "./configs"
import { generateArcLine, createIcon, buildTable, createSVG, getBaseLayer, getBaseAttribution, sortLayersByName, disableControls } from "./utils/generalUtils"
import "leaflet-polylinedecorator"
import { QueryInput, State, Parsed, LayerGroup_layer } from "./interfaces"
import { getLayer } from "./layers"
import { getChart } from "./charts"
import { parseCoordinates, calcDegToDec, eetToDecimalHours, convertDistance, convertSpeed } from "./utils/conversions"
import "leaflet.geodesic"
import { coordinateBox } from "./components/CoordinateBox"
import LatLon from 'geodesy/latlon-ellipsoidal-vincenty.js'

document.onreadystatechange = function() {
  if (document.readyState !== "complete") {
      document.getElementById("app")!.style.display = "none"
      document.getElementById("polylineField")!.style.display = "none"
  } else {
    document.getElementById("app")!.style.display = "flex"
    document.getElementById("zoom")!.style.width = "1.5rem"
    document.getElementById("zoom")!.style.height = "3rem"
    document.getElementById("polylineField")!.style.width = "50rem"
    document.getElementById("polylineField")!.style.height = "9rem";
    document.getElementById("sidebar")!.style.height = "100%";
    document.getElementById("sidebar")!.style.width = "calc(25vw + 1rem)";
    if(!JSON.parse(localStorage.getItem("AMTV3_darkmode") || "{}" )){
        document.body.classList.toggle("lightMode")
    }
    if(typeof localStorage.getItem("AMTV3_basemap") === "string"){
      state.baseLayer = L.tileLayer(getBaseLayer(localStorage.getItem("AMTV3_basemap") || "{}"))
      state.basemapSelect = localStorage.getItem("AMTV3_basemap") || "{}"
    } 
    state.baseLayer.addTo(map)
    if(typeof localStorage.getItem("AMTV3_sidebar") === "string"){
      if(!JSON.parse(localStorage.getItem("AMTV3_sidebar") || "{}")){
        document.getElementById("sidebar")!.style.left = "calc(-25vw - 2rem)"
        document.getElementById("coords")!.style.left = "calc(1rem + 10px)"
        document.getElementById("sidebarToggle")!.innerHTML = createSVG("sidebarToggle_right", state)
      }
      if(JSON.parse(localStorage.getItem("AMTV3_sidebar") || "{}")){
        document.getElementById("sidebar")!.style.left = "0rem"
        document.getElementById("coords")!.style.left ="calc(25vw + 1rem + 10px)"
        document.getElementById("sidebarToggle")!.innerHTML = createSVG("sidebarToggle_left", state)
      }
    }
  }
};

export const map: L.Map = L.map('map', {zoomControl:false}).setView([46.80, 8.22], 8);
export const markerArray: L.Marker[] = []
export const polylineMarkerArray: L.Marker[] = []
export const polylineArray: L.Polyline[] = []
export const polylineDecoratorArry: L.PolylineDecorator[] = []
const layerArray: (string | L.GeoJSON)[][] = []
const chartArray: L.TileLayer[] = []
const geodesicCircleArray: L.GeodesicCircle[] = []
const balloonMarkerArray: L.Marker[] = []
const geodesicLineArray: L.Geodesic[] = []

map.addEventListener("mousemove", function(e){
  if(state.coordinateBoxVisible && !state.contextMenuVisible){
    document.getElementById("coords")!.style.display = "flex"
    const coordinates:Parsed = parseCoordinates(`${e.latlng.lat},${e.latlng.lng}`, "Decimal")
    document.getElementById("coords")!.innerHTML = ""
    document.getElementById("coords")!.style.height = "3rem"
    for(const [_key, value] of Object.entries(coordinates)){
      if(state.coordinateBoxSelect.includes(value.name)){
        coordinateBox(value)
      }
    }
  } else {
    document.getElementById("coords")!.style.display = "none"
  } 
})

map.addEventListener("contextmenu", function(e:L.LeafletMouseEvent){
  if(document.getElementById("contextMenu")){
    document.getElementById("map")!.removeChild(document.getElementById("contextMenu")!)
  }
  state.contextMenuVisible = true
  const coordinates:Parsed = parseCoordinates(`${e.latlng.lat},${e.latlng.lng}`, "Decimal")
  const contextMenu: HTMLDivElement = document.createElement("div")
  document.getElementById("map")!.appendChild(contextMenu)
  contextMenu.className="contextMenu"
  contextMenu.id = "contextMenu"

  
  const item1 = document.createElement("div")
  contextMenu.appendChild(item1)
  item1.innerText = "Set Marker"
  item1.className = "contextMenu_item"
  item1.addEventListener("click", function(){
    addMarker([
      [coordinates.decimal.coordinates[0].split(",")[0],
      coordinates.decimal.coordinates[0].split(",")[1],
      `Custom Marker<br>
      Decimal: 
      ${parseFloat(coordinates.decimal.coordinates[0].split(",")[0]).toFixed(4)},
      ${parseFloat(coordinates.decimal.coordinates[0].split(",")[1]).toFixed(4)}
      <br>
      WGS84: ${coordinates.wgs84degMin.coordinates}
      <br>
      Swissgrid: 
      ${Math.ceil(parseFloat(coordinates.swissgrid.coordinates[0].split(",")[0]))} 
      ${Math.ceil(parseFloat(coordinates.swissgrid.coordinates[0].split(",")[1]))}
      `]],
      "custom"
    )
    markerArray.forEach(marker =>{
      marker.addTo(map)
      marker.addEventListener("dblclick", function(){
        plotMarker(marker)
      })
    })
    document.getElementById("map")!.removeChild(document.getElementById("contextMenu")!)
    state.contextMenuVisible = false
  })
  const divider1 = document.createElement("hr")
  contextMenu.appendChild(divider1)
  const item2 = document.createElement("div")
  contextMenu.appendChild(item2)
  item2.innerText = "Delete all Markers"
  item2.className = "contextMenu_item"
  item2.addEventListener("click", function(){
    toolbarFunctions["clearMarker"]()
    toolbarFunctions["removePolyline"]()
  })
  const item3 = document.createElement("div")
  contextMenu.appendChild(item3)
  item3.innerText = "Delete all Marker Lines"
  item3.className = "contextMenu_item"
  item3.addEventListener("click", function(){
    toolbarFunctions["removePolyline"]()
  })
  const item4 = document.createElement("div")
  contextMenu.appendChild(item4)
  item4.innerText = "Toggle Marker Popups"
  item4.className = "contextMenu_item"
  item4.addEventListener("click", function(){
    toolbarFunctions["togglePopup"]()
  })
  const divider2 = document.createElement("hr")
  contextMenu.appendChild(divider2)
  const item5 = document.createElement("div")
  contextMenu.appendChild(item5)
  item5.innerText = "Focus Switzerland"
  item5.className = "contextMenu_item"
  item5.addEventListener("click", function(){
    toolbarFunctions["focusSwitzerland"]()
  })
  const item6 = document.createElement("div")
  contextMenu.appendChild(item6)
  item6.innerText = "Focus Europe"
  item6.className = "contextMenu_item"
  item6.addEventListener("click", function(){
    toolbarFunctions["focusEurope"]()
  })
  const item7 = document.createElement("div")
  contextMenu.appendChild(item7)
  item7.innerText = "Focus World"
  item7.className = "contextMenu_item"
  item7.addEventListener("click", function(){
    toolbarFunctions["focusWorld"]()
  })


  const mapContainerWidth = getComputedStyle(document.getElementById("map")!).width
  const mapContainerHeight = getComputedStyle(document.getElementById("map")!).height
  const contextMenuWidth = getComputedStyle(document.getElementById("contextMenu")!).width
  const contextMenuHeight = getComputedStyle(document.getElementById("contextMenu")!).height
  let lower = false
  let wider = false
  contextMenu.style.top = `${e.containerPoint.y}px`
  if(e.containerPoint.y + parseFloat(contextMenuHeight) > parseFloat(mapContainerHeight)){
    lower = true
  }
  contextMenu.style.left = `${e.containerPoint.x}px`
  if(e.containerPoint.x + parseFloat(contextMenuWidth) > parseFloat(mapContainerWidth)){
    wider = true
  }
  contextMenu.style.transform = `translate(${wider ? "-100%" : "0%"}, ${lower ? "-100%" : "0%"})`
  document.getElementById("map")!.appendChild(contextMenu)
  
})

document.getElementById("map")!.addEventListener("click", function(){
  if(state.contextMenuVisible){
    document.getElementById("map")!.removeChild(document.getElementById("contextMenu")!)
    state.contextMenuVisible = false
  }
})

document.getElementById("polylineField")!.style.display = "none"
export const speedInput = document.getElementById("polylineField_speed")! as HTMLInputElement
speedInput.value = ""


function resizeMinimap(map:L.Map){
  setTimeout(function(){
    map.invalidateSize(true)
    map.setView([46.80, 8.22], 6);
  },100)
}

function setSidebarVisibility(state:State){
  const sidebars:NodeList = document.querySelectorAll(".sidebarInner")
  sidebars.forEach(sidebar =>{
    const item = sidebar as HTMLElement
    document.getElementById(`${item.id}`)!.style.display = "none"
  })
  document.getElementById(`sidebarInner_${state.sidebarSelect}`)!.style.display = "flex"
  if(state.sidebarSelect === "basemap" && document.getElementById(`sidebarInner_${state.sidebarSelect}`)!.childElementCount === 0){
    baseMaps.forEach(basemap =>{
      const basemapButton = document.createElement("div")
      basemapButton.className="basemapSelect"
      basemapButton.id = `basemapSelect_${basemap.type}`
      const basemapButtonInner = document.createElement("div")
      basemapButtonInner.className="basemapSelect_inner"
      basemapButton.appendChild(basemapButtonInner)
      const mapThumb: L.Map = L.map(basemapButtonInner, {zoomControl:false})  
      disableControls(mapThumb)
      resizeMinimap(mapThumb)
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
  }
  if(state.sidebarSelect === "info" && document.getElementById(`sidebarInner_${state.sidebarSelect}`)!.childElementCount === 0){
    infos.forEach(info =>{
      const title:HTMLHeadingElement = document.createElement("h1")
      title.innerHTML = info.title
      document.getElementById(`sidebarInner_${state.sidebarSelect}`)!.appendChild(title)
      const content:HTMLDivElement = document.createElement("div")
      content.className="textcontent"
      content.innerHTML = info.content
      document.getElementById(`sidebarInner_${state.sidebarSelect}`)!.appendChild(content)
    })
  }
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
          {offset: 10, repeat: 20, symbol: L.Symbol.arrowHead({pixelSize: 10, pathOptions:{fillOpacity: 1, weight: 0, color: "red"}})}
      ]
    })
    polylineDecoratorArry.push(decorator)
  })
  polylineDecoratorArry.forEach(decorator =>{
    decorator.addTo(map)
  })
}

async function queryTriggerAll(from: string){
  toolbarFunctions["clearMarker"]()
  toolbarFunctions["removePolyline"]()
  queryAllState.value = ""
  const targetA = document.getElementById(`sidebar_textarea_queryAll`) as HTMLInputElement
  const targetB = document.getElementById(`alternativeQueryAll_textbox`) as HTMLInputElement
  const value: string = from === "sidebar" ? targetA.value : targetB.value
  if(from === "sidebar"){
    targetB.value = targetA.value
  }
  if(from === "map"){
    targetA.value = targetB.value
  }
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
  queryTriggerAll("sidebar")
})

queryAllField.addEventListener("keypress", function(e){
  if(e.key === "Enter"){
    e.preventDefault()
    queryTriggerAll("sidebar")
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








toolbarButtons.forEach(btn =>{
  const button: HTMLButtonElement = document.createElement("button")
  button.innerHTML = createSVG(btn.name, state)
  button.id = `toolbar_button_${btn.name}`
  button.className = "toolbar_button"
  button.title = btn.description
  document.getElementById("toolbar")?.appendChild(button)
  button.addEventListener("click", function(){
   toolbarFunctions[btn.name]()
  })
})

function triggerColorChange(){
  document.body.classList.toggle("lightMode")
  state.darkmode = !state.darkmode
  buildSidebarFlags()
  layerGroup.innerHTML = createSVG("layerGroup", state)
  document.getElementById("sidebarToggle")!.innerHTML = createSVG("sidebarToggle_left", state)
  document.getElementById("zoomIn")!.innerHTML = createSVG("zoomIn", state)
  document.getElementById("zoomOut")!.innerHTML = createSVG("zoomOut", state)
  vfrLayerDrawerTrigger.innerHTML = createSVG("drawer", state)
  toolbarButtons.forEach(btn =>{
    document.getElementById(`toolbar_button_${btn.name}`)!.innerHTML = createSVG(btn.name, state)
  })
}

const layerGroup = document.getElementById("layerGroup") as HTMLDivElement
layerGroup.innerHTML = createSVG("layerGroup", state)
layerGroup.style.width ="3rem"
layerGroup.style.height = "3rem"
layerGroups.forEach(group =>{
  group.layers.forEach(async layer =>{
    if(state.checkedLayers.includes(layer.id)){
      const setLayer:L.GeoJSON =  await getLayer(layer)
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
    layerGroup.style.maxHeight = "calc(100svh - 30px)"
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
        column_content_checkbox.addEventListener("click", async function(){
          if(column_content_checkbox.checked){
            if(!state.checkedLayers.includes(layer.id)){
              state.checkedLayers = [...state.checkedLayers, layer.id]
              localStorage.setItem("AMTV3_layers", JSON.stringify(state.checkedLayers))
              const setLayer:L.GeoJSON = await getLayer(layer)
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
      layerGroup.style.overflowY = "hidden"
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
    document.getElementById("coords")!.style.left = "calc(1rem + 10px)"
    document.getElementById("sidebarToggle")!.innerHTML = createSVG("sidebarToggle_right", state)
  }
  if(!state.sidebarVisible){
    document.getElementById("sidebar")!.style.left = "0rem"
    document.getElementById("coords")!.style.left ="calc(25vw + 1rem + 10px)"
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
    state.parsedDecimalCoordinates = parsedCoordinates.decimal.coordinates
    for(const [key, value] of Object.entries(parsedCoordinates)){
      if(key === "wgs84degMin"){
        const textarea = document.getElementById(`sidebar_textarea_conversion_0`)! as HTMLTextAreaElement
        textarea.value = value.coordinates.join(" ").toUpperCase()
      }
      if(key === "wgs84degMinSec"){
        const textarea = document.getElementById(`sidebar_textarea_conversion_1`)! as HTMLTextAreaElement
        textarea.value = value.coordinates.join(" ").toUpperCase()
      }
      if(key === "decimal"){
        const textarea = document.getElementById(`sidebar_textarea_conversion_2`)! as HTMLTextAreaElement
        textarea.value = value.coordinates.join(" ").toUpperCase()
      }
      if(key === "swissgrid"){
        const textarea = document.getElementById(`sidebar_textarea_conversion_3`)! as HTMLTextAreaElement
        textarea.value = value.coordinates.join(" ").toUpperCase()
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

const detailsDistance:HTMLDetailsElement = document.createElement("details")
detailsDistance.className="sidebar_area_details"
/*@ts-expect-error */
const summaryDistance:HTMLSummaryElement = document.createElement("summary")
summaryDistance.innerText = "Distance Conversions"
summaryDistance.className="sidebar_area_summary"
detailsDistance.appendChild(summaryDistance)
document.getElementById("sidebarInner_conversion")!.appendChild(detailsDistance)

const distanceConversionInput: HTMLSelectElement = document.createElement("select")
distanceConversionInput.className="sidebar_area_select"
detailsDistance.appendChild(distanceConversionInput)
distanceConversionInput.addEventListener("change", function(){
  state.distanceConversionSelect = distanceConversionInput.value
})

distanceConversions.forEach(conversion =>{
  const option:HTMLOptionElement = document.createElement("option")
  option.value = conversion
  option.text = conversion
  distanceConversionInput.appendChild(option)
})

const distanceConversionInputField:HTMLInputElement = document.createElement("input")
detailsDistance.appendChild(distanceConversionInputField)
distanceConversionInputField.className="sidebar_input_large_noMargin"
distanceConversionInputField.addEventListener("keypress", function(e){
  if(e.key === "Enter"){
    e.preventDefault()
    convertDistance(distanceConversionInputField.value, state.distanceConversionSelect)
    for(const [_key, value] of Object.entries(distances)){
      const target = document.getElementById(`sidebar_textarea_conversion_${value.name}`)! as HTMLInputElement
      target.value = value.value
    }
  }
})

const convertDistanceButton: HTMLButtonElement = document.createElement("button")
detailsDistance.appendChild(convertDistanceButton)
convertDistanceButton.innerText = "Convert Distance"
convertDistanceButton.className="sidebar_button_large"
convertDistanceButton.addEventListener("click", function(){
  convertDistance(distanceConversionInputField.value, state.distanceConversionSelect)
    for(const [_key, value] of Object.entries(distances)){
      const target = document.getElementById(`sidebar_textarea_conversion_${value.name}`)! as HTMLInputElement
      target.value = value.value
    }
})

distanceConversions.forEach((conversion) =>{
  const textareaField: HTMLDivElement = document.createElement("div")
  textareaField.className=`sidebar_area_wrap`
  const label:HTMLLabelElement = document.createElement("label")
  label.htmlFor = "sidebar_textarea_conversion_${index}"
  label.innerText=conversion
  label.className = "sidebar_area_label"
  textareaField.appendChild(label)
  const textarea: HTMLInputElement = document.createElement("input")
  textareaField.appendChild(textarea)
  detailsDistance.appendChild(textareaField)
  textarea.className="sidebar_input_large"
  textarea.disabled = true
  textarea.id = `sidebar_textarea_conversion_${conversion}`
})

const detailsSpeed:HTMLDetailsElement = document.createElement("details")
detailsSpeed.className="sidebar_area_details"
/*@ts-expect-error */
const summarySpeed:HTMLSummaryElement = document.createElement("summary")
summarySpeed.innerText = "Speed Conversions"
summarySpeed.className="sidebar_area_summary"
detailsSpeed.appendChild(summarySpeed)
document.getElementById("sidebarInner_conversion")!.appendChild(detailsSpeed)

const speedConversionInput: HTMLSelectElement = document.createElement("select")
speedConversionInput.className="sidebar_area_select"
detailsSpeed.appendChild(speedConversionInput)
speedConversionInput.addEventListener("change", function(){
  state.speedConversionSelect = speedConversionInput.value
})

speedConversions.forEach(conversion =>{
  const option:HTMLOptionElement = document.createElement("option")
  option.value = conversion
  option.text = conversion
  speedConversionInput.appendChild(option)
})

const speedConversionInputField:HTMLInputElement = document.createElement("input")
detailsSpeed.appendChild(speedConversionInputField)
speedConversionInputField.className="sidebar_input_large_noMargin"
speedConversionInputField.addEventListener("keypress", function(e){
  if(e.key === "Enter"){
    e.preventDefault()
    convertSpeed(speedConversionInputField.value, state.speedConversionSelect)
    for(const [_key, value] of Object.entries(speeds)){
      const target = document.getElementById(`sidebar_textarea_conversion_${value.name}`)! as HTMLInputElement
      target.value = value.value
    }
  }
})

const convertSpeedButton: HTMLButtonElement = document.createElement("button")
detailsSpeed.appendChild(convertSpeedButton)
convertSpeedButton.innerText = "Convert Speed"
convertSpeedButton.className="sidebar_button_large"
convertSpeedButton.addEventListener("click", function(){
  convertSpeed(speedConversionInputField.value, state.speedConversionSelect)
    for(const [_key, value] of Object.entries(speeds)){
      const target = document.getElementById(`sidebar_textarea_conversion_${value.name}`)! as HTMLInputElement
      target.value = value.value
    }
})

speedConversions.forEach((conversion) =>{
  const textareaField: HTMLDivElement = document.createElement("div")
  textareaField.className=`sidebar_area_wrap`
  const label:HTMLLabelElement = document.createElement("label")
  label.htmlFor = "sidebar_textarea_conversion_${index}"
  label.innerText=conversion
  label.className = "sidebar_area_label"
  textareaField.appendChild(label)
  const textarea: HTMLInputElement = document.createElement("input")
  textareaField.appendChild(textarea)
  detailsSpeed.appendChild(textareaField)
  textarea.className="sidebar_input_large"
  textarea.disabled = true
  textarea.id = `sidebar_textarea_conversion_${conversion}`
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

settings.forEach(setting =>{
  const settingsItem: HTMLDivElement = document.createElement("div")
  document.getElementById("sidebarInner_settings")!.appendChild(settingsItem)
  settingsItem.className="sidebarInner_settings_item"

  const settingsTitle = document.createElement("div")
  settingsItem.appendChild(settingsTitle)
  settingsTitle.innerText = setting.name
  settingsTitle.className = "sidebarInner_settings_title"

  if(setting.type === "range"){
    const rangeBox: HTMLDivElement = document.createElement("div")
    settingsItem.appendChild(rangeBox)
    rangeBox.className="sidebarInner_settings_rangebox"
    const range: HTMLInputElement = document.createElement("input")
    rangeBox.appendChild(range)
    range.type = setting.type
    range.min = setting.min || ""
    range.max = setting.max || ""
    range.step = setting.step || ""
    const customElement: HTMLDivElement = createRangeInput(setting.name)
    customElement.id = `range_${setting.name}`
    rangeBox.appendChild(customElement)
    if(setting.id === "darkmodeToggle"){
      range.value = state.darkmode ? "1" : "0"
      range.value === "1" ? toggleSwitchOn(customElement) : toggleSwitchOff(customElement)
      rangeBox.addEventListener("click", function(){
        if(range.value === "0"){
          triggerColorChange()
          toggleSwitchOn(customElement)
          localStorage.setItem("AMTV3_darkmode", JSON.stringify(state.darkmode))
        }
        if(range.value === "1"){
          triggerColorChange()
          toggleSwitchOff(customElement)
          localStorage.setItem("AMTV3_darkmode", JSON.stringify(state.darkmode))
        }
        range.value = range.value === "1" ? "0" : "1"
      })
    }
    if(setting.id === "coordinateBox"){
      range.value = state.coordinateBoxVisible ? "1" : "0"
      range.value === "1" ? toggleSwitchOn(customElement) : toggleSwitchOff(customElement)
      rangeBox.addEventListener("click", function(){
        if(range.value === "0"){
          state.coordinateBoxVisible = true
          toggleSwitchOn(customElement)
          localStorage.setItem("AMTV3_coordinatebox", JSON.stringify(state.coordinateBoxVisible))
        }
        if(range.value === "1"){
          state.coordinateBoxVisible = false
          toggleSwitchOff(customElement)
          localStorage.setItem("AMTV3_coordinatebox", JSON.stringify(state.coordinateBoxVisible))
          document.getElementById("coords")!.style.display = "none"
        }
        range.value = range.value === "1" ? "0" : "1"
      })
    }
    if(setting.id === "sidebarToggle"){
      range.value = state.sidebarVisible ? "1" : "0"
      range.value === "1" ? toggleSwitchOn(customElement) : toggleSwitchOff(customElement)
      rangeBox.addEventListener("click", function(){
        if(range.value === "0"){
          state.sidebarVisible = true
          toggleSwitchOn(customElement)
          localStorage.setItem("AMTV3_sidebar", JSON.stringify(state.sidebarVisible))
        }
        if(range.value === "1"){
          state.sidebarVisible = false
          toggleSwitchOff(customElement)
          localStorage.setItem("AMTV3_sidebar", JSON.stringify(state.sidebarVisible))
        }
        range.value = range.value === "1" ? "0" : "1"
      })
    }
  }
})

function toggleSwitchOn(customElement:HTMLDivElement){
  customElement.children[0].classList.remove("range_thumb_left")
  customElement.children[0].classList.add("range_thumb_right")
  customElement.children[0].classList.remove("off")
  customElement.children[0].classList.add("on")
}

function toggleSwitchOff(customElement:HTMLDivElement){
  customElement.children[0].classList.remove("range_thumb_right")
  customElement.children[0].classList.add("range_thumb_left")
  customElement.children[0].classList.remove("on")
  customElement.children[0].classList.add("off")
}

function createRangeInput(name:string){
  const track: HTMLDivElement = document.createElement("div")
  track.className = "custom_range_track"
  
  const thumb: HTMLDivElement = document.createElement("div")
  thumb.className = "custom_range_thumb"
  track.appendChild(thumb)
  track.id = `range_${name}`
  return track
}

const minimalQueryAllTextBox: HTMLTextAreaElement = document.createElement("textarea")
document.getElementById("alternativeQueryAll")!.appendChild(minimalQueryAllTextBox)
minimalQueryAllTextBox.id = "alternativeQueryAll_textbox"
minimalQueryAllTextBox.placeholder = "Query entire route"

const minimalQueryAllButton: HTMLButtonElement = document.createElement("button")
document.getElementById("alternativeQueryAll")!.appendChild(minimalQueryAllButton)
minimalQueryAllButton.className = "alternativeQueryAll_button"
minimalQueryAllButton.innerHTML = createSVG("minimalSearch", state)

minimalQueryAllButton.addEventListener("click", function(){
  queryTriggerAll("map")
})

minimalQueryAllTextBox.addEventListener("keypress", function(e){
  if(e.key === "Enter"){
    e.preventDefault()
    queryTriggerAll("map")
  }
})