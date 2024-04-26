import { Setting } from "../interfaces"
import { buildSidebarFlags, layerGroup, vfrLayerDrawerTrigger } from "../main"
import { createSVG } from "../utils/generalUtils"
import { toolbarButtons } from "./generalConfigs"
import { state } from "./state"

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

export const settings:Setting[] = [
    {
      id: "darkmode",
      name: "Darkmode",
      type: "range",
      description: "Switches between a light and dark background for the interface",
      max: "1",
      min: "0",
      step: "1",
      function: triggerColorChange
    },
    {
      id: "coordinatebox",
      name: "Coordinate Tooltip",
      type: "range",
      description: "Switches the box that displays the current coordinates when moving the cursor around the map on or off",
      max: "1",
      min: "0",
      step: "1",
      function: coordinateBoxVisibility
    },
    {
      id: "sidebar",
      name: "Show sidebar by default",
      type: "range",
      description: "Sets if the sidebar is hidden or visible on start. Does not impact the sidebar functionality",
      max: "1",
      min: "0",
      step: "1",
      function: sidebarVisibility
    },
    {
      id: "placeCoordOptIn",
      name: "Show Coordinates in Place Popups",
      type: "range",
      description: "Opt in or out of including coordinates in Place Marker Popup",
      max: "1",
      min: "0",
      step: "1",
      function: placeCoordinateToggle
    },
    {
        id: "lociCoordOptIn",
        name: "Show Coordinates in LOCI Popups",
        type: "range",
        description: "Opt in or out of including coordinates in LOCI Marker Popup",
        max: "1",
        min: "0",
        step: "1",
        function: lociCoordinateToggle
      },
      {
        id: "navaidCoordOptIn",
        name: "Show Coordinates in NAVAID Popups",
        type: "range",
        description: "Opt in or out of including coordinates in NAVAID Marker Popup",
        max: "1",
        min: "0",
        step: "1",
        function: navaidCoordinateToggle
      },
    {
      id: "routePredictionActive",
      name: "Route Prediction",
      type: "range",
      description: "Opt in or out of the Route Prediction functionality",
      max: "1",
      min: "0",
      step: "1",
      function: routePredictionToggle,
      warning: warning_routePrediction
    }
  ]
  
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

  function coordinateBoxVisibility(){
    state.coordinatebox = !state.coordinatebox
  }

  function sidebarVisibility(){
    state.sidebar = !state.sidebar
  }

  function placeCoordinateToggle(){
    state.placeCoordOptIn = !state.placeCoordOptIn
  }

  function lociCoordinateToggle(){
    state.lociCoordOptIn = !state.lociCoordOptIn
  }

  function navaidCoordinateToggle(){
    state.navaidCoordOptIn = !state.navaidCoordOptIn
  }

  function routePredictionToggle(){
    state.routePredictionActive = !state.routePredictionActive
  }

