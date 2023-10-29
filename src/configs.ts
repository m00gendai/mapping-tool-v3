import { QueryInput, State, SidebarFlag, LayerGroup, BaseMap, ChartLayer } from "./interfaces"
import L from "leaflet"

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
    checkedLayers: typeof localStorage.getItem("AMTV3_layers") === "string" ? JSON.parse(localStorage.getItem("AMTV3_layers") || "{}") : ["LSASBDRY"],
    layerGroupBuffer: true,
    darkmode: typeof localStorage.getItem("AMTV3_darkmode") !== null ? JSON.parse(localStorage.getItem("AMTV3_darkmode") || "{}") : true,
    sidebarVisible: true,
    basemapSelect: typeof localStorage.getItem("AMTV3_basemap") === "string" ? localStorage.getItem("AMTV3_basemap") || "{}" : "OSM",
    baseLayer: L.tileLayer(`https://tile.openstreetmap.org/{z}/{x}/{y}.png`, {
      attribution: `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`,
  }),
    drawerVisible: false,
    coordinateConversionSelect: "WGS84 Deg Min",
    parsedDecimalCoordinates: []
  }

export const baseMaps:BaseMap[] =
  [
    {
      type: `OSM`,
      layer: `https://tile.openstreetmap.org/{z}/{x}/{y}.png`,
      attribution: `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`,
    },
    {
      type: "ESRI World Imagery",
      layer: `https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/WMTS/tile/1.0.0/World_Imagery/{}/{}/{z}/{y}/{x}.jpg`,
      attribution: `&copy <a href="https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9">Esri, Maxar, Earthstar Geographics, and the GIS User Community</a>`
    },
    {
      type: "SWISSTOPO_LIGHT",
      layer: `https://api.maptiler.com/maps/ch-swisstopo-lbm-vivid/256/{z}/{x}/{y}.png?key=${import.meta.env.VITE_MAPTILER_API_KEY}`,
      attribution: `<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a> © swisstopo <a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a> <a href="https://www.swisstopo.admin.ch/en/home.html" target="_blank">&copy; swisstopo</a>`
    },
    {
      type: "SWISSTOPO_DARK",
      layer: `https://api.maptiler.com/maps/ch-swisstopo-lbm-dark/256/{z}/{x}/{y}.png?key=${import.meta.env.VITE_MAPTILER_API_KEY}`,
      attribution: `<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a> © swisstopo <a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a> <a href="https://www.swisstopo.admin.ch/en/home.html" target="_blank">&copy; swisstopo</a>`
    },
    {
      type: "STADIA ALIDADE SMOOTH",
      layer: `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png`,
      attribution: `&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`
    },
    {
      type: "STADIA ALIDADE SMOOTH DARK",
      layer: `https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png`,
      attribution: `&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`
    },
    {
      type: "STADIA OSM Bright",
      layer: `https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png`,
      attribution: `&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`
    },
    {
      type: "ESRI World Street Map",
      layer: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}`,
      attribution: `Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012`
    }
  ]

export const fieldDesignations: QueryInput[] = [
    {
      designation: "LOCI",
      value: "",
      type: "airport",
      placeholder: "LSPF LOWI LIML",
    },
    {
      designation: "PLACE",
      value: "",
      type: "location",
      placeholder: "Hallau,Bad Zurzach,Freiburg im Breisgau,Dübendorf",
    },
    {
      designation: "NAVAID",
      value: "",
      type: "navaid",
      placeholder: "TRA ZUE KLO",
    },
    {
      designation: "WAYPOINT",
      value: "",
      type: "waypoint",
      placeholder: "TITIX SONGI AMIKI",
    },
    {
      designation: "COORD", 
      value: "",
      type: "coordinate",
      placeholder: "4741N00827E 472425N0083823E",
    },
    {
      designation: "BRG/DIST",
      value: "",
      type: "brgdist",
      placeholder: "TRA090120 MOLUS120010",
    },
  ]

export const queryAllState:QueryInput = {
    designation: "ALL",
    value: "",
    type: "",
    placeholder: "-LSPF1400\n-N0120VFR SCHAFFHAUSEN ZUE 4737N00920E AMIKI GERSA045020 LSZK\n-LSMD0130 LSZH LSPH",
}

export const sidebarFlags:SidebarFlag[] = [
    {
      type: "query",
      text: "Query items on map"
    },
    {
      type: "basemap",
      text: "Select Base Map"
    },
    {
      type: "conversion",
      text: "Unit conversions"
    },
    {
      type: "balloon",
      text: "Balloon Flight Area"
    },
    {
      type: "settings",
      text: "Settings"
    },
    {
      type: "info",
      text: "Info & Legal"
    },
  ]

export const layerGroups:LayerGroup[] = [
  {
    name: "Other",
    layers: [
      {
        name: "LS - Geneva/Zurich Boudnary",
        id: "LSASBDRY",
        data: "",
      },
      {
        name: "LI - Italy ARO Boudnary",
        id: "LIMMBDRY",
        data: "",
      },
      {
        name: "LS - Drone Areas",
        id: "LSASDRONE",
        data: "",
      }
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
      {
        name: "LK - Czech Republic",
        id: "LKAACTR",
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
        name: "LK - Czech Republic",
        id: "LKAATMA",
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
        name: "LK - Czech Republic",
        id: "LKAAFIR",
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

export const chartLayers:ChartLayer[] = [
  {
    id: "LSVFR",
    country: "LS",
    type: "VFR",
    url: 'https://wmts20.geo.admin.ch/1.0.0/ch.vbs.milairspacechart/default/current/3857/{z}/{x}/{y}.png',
    description: "Switzerland VFR Chart"
  },
  {
    id: "LSGLD",
    country: "LS",
    type: "GLD",
    url: "https://wmts.geo.admin.ch/1.0.0/ch.bazl.segelflugkarte/default/current/3857/{z}/{x}/{y}.png",
    description: "Switzerland Gilder Chart"
  }
]

export const coordinateConversions:string[] = [
  "WGS84 Deg Min", "WGS84 Deg Min Sec", "Decimal", "Swissgrid"
]