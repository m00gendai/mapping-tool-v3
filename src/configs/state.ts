import { State } from "../interfaces"
import L from "leaflet"

// ✅ Helper to safely read from localStorage
function getLocalStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key)
    if (item === null || item === undefined) return fallback
    return JSON.parse(item)
  } catch {
    return fallback
  }
}

export const state: State = {
  acceptedLegality: getLocalStorage("AMTV3_agb", false),
  popupVisible: false,
  sidebarSelect: "query",
  totalDistance: 0,
  setSpeed: 0,
  setDep: "",
  setDist: [],
  setDest: "",
  setTime: [],
  setTimeFields: 0,
  setTotalDist: 0,
  setTotalTime: 0,
  markerClicks: 0,
  layerGroupVisible: false,
  checkedLayers: getLocalStorage("AMTV3_layers", []),
  checkedAllLayers: getLocalStorage("AMTV3_layersAll", []),
  layerGroupBuffer: true,

  // ✅ Corrected null checks
  darkmode: getLocalStorage("AMTV3_darkmode", true),
  sidebar: getLocalStorage("AMTV3_sidebar", true),

  basemapSelect:
    localStorage.getItem("AMTV3_basemap") ||
    "OSM",

  baseLayer: L.tileLayer(`https://tile.openstreetmap.org/{z}/{x}/{y}.png`, {
    attribution: `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`,
  }),

  drawerVisible: false,
  coordinateConversionSelect: "WGS84 Deg Min",
  distanceConversionSelect: "Feet",
  speedConversionSelect: "km/h",
  parsedDecimalCoordinates: [],

  coordinatebox: getLocalStorage("AMTV3_coordinatebox", true),
  coordinateBoxSelect: ["WGS84", "Decimal", "Swissgrid"],
  contextMenuVisible: false,

  placeCoordOptIn: getLocalStorage("AMTV3_placeCoordOptIn", false),
  lociCoordOptIn: getLocalStorage("AMTV3_lociCoordOptIn", false),
  navaidCoordOptIn: getLocalStorage("AMTV3_navaidCoordOptIn", false),
  waypointCoordOptIn: getLocalStorage("AMTV3_waypointCoordOptIn", false),
  brgDistCoordOptIn: getLocalStorage("AMTV3_brgDistCoordOptIn", false),
  routePredictionActive: getLocalStorage("AMTV3_routePredictionActive", false),

  updatesReadDate: getLocalStorage("AMTV3_updatesReadDate", "0"),
}
