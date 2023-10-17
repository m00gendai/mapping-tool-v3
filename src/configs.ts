import { QueryInput, State, SidebarFlag, LayerGroup } from "./interfaces"

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
    layerGroupVisible: false,
    checkedLayers: []
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
      icon: "/position-marker.svg",
      text: "Query items on map"
    },
    {
      type: "conversion",
      icon: "/calculator.svg",
      text: "Unit conversions"
    },
  ]

export const layerGroups:LayerGroup[] = [
  {
    name: "TMA",
    layers: [
      {
        name: "EB - Belgium & Luxembourg",
        id: "EBBUTMA",
        data: "",
      },
      {
        name: "LD - Croatia",
        id: "LDZOTMA",
        data: "",
      },
    ]
  },
  {
    name: "CTR",
    layers: [
      {
        name: "EB - Belgium & Luxembourg",
        id: "EBBUCTR",
        data: "",
      },
    ]
  },
  {
    name: "Other",
    layers: [
      {
        name: "LSAG / LSAZ Boudnary",
        id: "LSASBDRY",
        data: "",
      },
      {
        name: "Italy ARO Boudnary",
        id: "LIMMBDRY",
        data: "",
      },
    ]
  },{
    name: "FIR",
    layers: [
      {
        name: "EB - Belgium & Luxembourg",
        id: "EBBUFIR",
        data: "",
      },
    ]
  },
  {
    name: "VFR Reporting Points",
    layers: [
      {
        name: "LD - Croatia",
        id: "LDZOREP",
        data: "",
      },
      {
        name: "LJ - Slovenia",
        id: "LJLAREP",
        data: "",
      },
    ]
  },
]