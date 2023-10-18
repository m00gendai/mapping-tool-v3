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
    checkedLayers: [],
    layerGroupBuffer: true,
    darkmode: true,
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
      text: "Query items on map"
    },
    {
      type: "conversion",
      text: "Unit conversions"
    },
  ]

export const layerGroups:LayerGroup[] = [
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
  {
    name: "CTR",
    layers: [
      {
        name: "EB - Belgium & Luxembourg",
        id: "EBBUCTR",
        data: "",
      },
      {
        name: "EG - United Kingdom",
        id: "EGXXCTR",
        data: "",
      },
      {
        name: "LD - Croatia",
        id: "LDZOCTR",
        data: "",
      },
    ]
  },
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
      {
        name: "LY - Serbia and Montenegro",
        id: "LYPRTMA",
        data: "",
      },
    ]
  },
  {
    name: "FIR",
    layers: [
      {
        name: "BI - Iceland",
        id: "BIRDFIR",
        data: "",
      },
      {
        name: "EB - Belgium & Luxembourg",
        id: "EBBUFIR",
        data: "",
      },
      {
        name: "ED - Germany",
        id: "EDXXFIR",
        data: "",
      },
      {
        name: "EG - United Kingdom",
        id: "EGXXFIR",
        data: "",
      },
      {
        name: "EH - Netherlands",
        id: "EHAAFIR",
        data: "",
      },
      {
        name: "EI - Ireland",
        id: "EISNFIR",
        data: "",
      },
      {
        name: "LA - Albania",
        id: "LAAAFIR",
        data: "",
      },
      {
        name: "LD - Croatia",
        id: "LDZOFIR",
        data: "",
      },
      {
        name: "LE - Spain",
        id: "LEXXFIR",
        data: "",
      },
      {
        name: "LF - France",
        id: "LFXXFIR",
        data: "",
      },
      {
        name: "LI - Italy",
        id: "LIXXFIR",
        data: "",
      },
      {
        name: "LS - Switzerland",
        id: "LSASFIR",
        data: "",
      },
      {
        name: "LY - Serbia and Montenegro",
        id: "LYPRFIR",
        data: "",
      },
    ]
  },
]