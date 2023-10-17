import { QueryInput, State, SidebarFlag } from "./interfaces"

export const state: State ={
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
  }

export const fieldDesignations: QueryInput[] = [
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

export const queryAllState:QueryInput = {
    designation: "ALL",
    value: "",
    type: ""
}

export const sidebarFlags:SidebarFlag[] = [
    {
      type: "query",
      icon: "public/position-marker.svg",
      text: "Query items on map"
    },
    {
      type: "conversion",
      icon: "public/calculator.svg",
      text: "Unit conversions"
    },
  ]