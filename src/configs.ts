import { QueryInput, State, SidebarFlag, LayerGroup, BaseMap, ChartLayer, Setting, Parsed, Info, Distance, Speed } from "./interfaces"
import L from "leaflet"

const date: Date = new Date()
const currentYear:number = date.getFullYear()

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
    checkedLayers: typeof localStorage.getItem("AMTV3_layers") === "string" ? JSON.parse(localStorage.getItem("AMTV3_layers") || "{}") : [],
    layerGroupBuffer: true,
    darkmode: typeof localStorage.getItem("AMTV3_darkmode") !== null ? JSON.parse(localStorage.getItem("AMTV3_darkmode") || "{}") : true,
    sidebarVisible: typeof localStorage.getItem("AMTV3_sidebar") !== null ? JSON.parse(localStorage.getItem("AMTV3_sidebar") || "{}") : true,
    basemapSelect: typeof localStorage.getItem("AMTV3_basemap") === "string" ? localStorage.getItem("AMTV3_basemap") || "{}" : "OSM",
    baseLayer: L.tileLayer(`https://tile.openstreetmap.org/{z}/{x}/{y}.png`, {
      attribution: `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`,
  }),
    drawerVisible: false,
    coordinateConversionSelect: "WGS84 Deg Min",
    distanceConversionSelect: "Feet",
    speedConversionSelect: "km/h",
    parsedDecimalCoordinates: [],
    coordinateBoxVisible: typeof localStorage.getItem("AMTV3_coordinatebox") !== null ? JSON.parse(localStorage.getItem("AMTV3_coordinatebox") || "{}") : true,
    coordinateBoxSelect: ["WGS84", "Decimal", "Swissgrid"],
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
        name: "LS - Geneva/Zurich Boundary",
        id: "LSASBDRY",
        data: "",
      },
      {
        name: "LI - Italy ARO Boundary",
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

export const distanceConversions: string[] = [
  "Feet", "Meter", "Statute Mile", "Nautical Mile", "Kilometer"
]

export const speedConversions: string[] = [
  "km/h", "mph", "m/s", "Knots", "Mach"
]

export const settings:Setting[] = [
  {
    id: "darkmodeToggle",
    name: "Darkmode",
    type: "range",
    max: "1",
    min: "0",
    step: "1"
  },
  {
    id: "coordinateBox",
    name: "Coordinate Tooltip",
    type: "range",
    max: "1",
    min: "0",
    step: "1",
  },
  {
    id: "sidebarToggle",
    name: "Show sidebar by default",
    type: "range",
    max: "1",
    min: "0",
    step: "1",
  }
]


export const parsed: Parsed = {
  wgs84degMin: {name: "WGS84", coordinates: []},
  wgs84degMinSec: {name: "WGS84 dms", coordinates: []},
  decimal: {name: "Decimal", coordinates: []},
  swissgrid: {name: "Swissgrid", coordinates: []},
}

export const distances:Distance = {
  m: {name: "Meter", value: 0},
  ft: {name: "Feet", value: 0},
  sm: {name: "Statute Mile", value: 0},
  nm: {name: "Nautical Mile", value: 0},
  km: {name: "Kilometer", value: 0},
}

export const speeds:Speed = {
  kmh: {name: "km/h", value: 0},
  mph: {name: "mph", value: 0},
  ms: {name: "m/s", value: 0},
  kt: {name: "Knots", value: 0},
  mach: {name: "Mach", value: 0},
}

export const infos:Info[] = [
  {
    title: "General",
    content: `AIM Mapping Tool is an open source application developed by <a href="https://linkedin.com/in/marcel-weber-3a05a61bb" target="_blank">Marcel Weber</a> as a supplementary tool for <a href="https://www.skyguide.ch/services/aeronautical-information-management" target="_blank">skyguide AIM Services</a>, 
              specifically to aid in plotting VFR flight plan routes. 
              Although it features official Swiss federal map and Eurocontrol data, it is not an official application and thus 
              shall not be used for navigational purposes. `
  },
  {
    title: "EAD Data AIRAC Date",
    content: `19 MAY 22 uploaded 21.05.2022`
  },
  {
    title: "Overlay Data Sources",
    content: `
    <ul>
      <li>Swiss VFR Chart and Drone Areas via <a href="https://www.geo.admin.ch/en/geo-services/geo-services/portrayal-services-web-mapping/web-map-tiling-services-wmts.html" target="_blank">swisstopo</a></li>
      <li>French VFR Chart via <a href="https://geoservices.ign.fr/" target="_blank">IGN</a></li>
      <li>German VFR Chart via <a href="https://www.dfs.de/dfs_homepage/en/Services/Customer%20Relations/INSPIRE/" target="_blank">DFS</a></li>
      <li>Airspace layers (CTR, TMA) via <a href="https://www.openaip.net/" target="_blank">openAIP.net</a>, custom linted & validated (and sometimes fixed) by Marcel Weber</li>
      <li>Airspace layer Switzerland from <a href="https://www.skyguide.ch/services/aeronautical-information-management" target="_blank">skyguide AIM Services</a></li>
      <li>Airspace layers (FIR) by <a href="https://linkedin.com/in/marcel-weber-3a05a61bb" target="_blank">Marcel Weber</a></li>
      <li>VFR Reporting Points Slovenia & Croatia by <a href="https://linkedin.com/in/marcel-weber-3a05a61bb" target="_blank">Marcel Weber</a></li>
      <li>LSAG/LSAZ Boundary by <a href="https://linkedin.com/in/marcel-weber-3a05a61bb" target="_blank">Marcel Weber</a></li>
      <li>Italy ARO Boundary by <a href="https://linkedin.com/in/marcel-weber-3a05a61bb" target="_blank">Marcel Weber</a></li>
    </ul>
    `
  },
  {
    title: "POI Data Sources",
    content: `
    <ul>
      <li>Place names and coordinates via <a href="https://www.geoapify.com/places-api" target="_blank">geoapify</a></li>
      <li>ICAO Location Indicators, Navaids and Waypoints from <a href="https://www.ead.eurocontrol.int/cms-eadbasic/opencms/en/login/ead-basic/" target="_blank">European AIS Database</a></li>
    </ul>
    `
  },
  {
    title: "Attributions",
    content: `
    <ul>
      <li>Markers by <a href="https://www.flaticon.com/packs/location-59" target="_blank">Freepik - Flaticon</a></li>
      <li>Flag Markers by <a href="https://www.flaticon.com/packs/country-flags" target="_blank">Freepik - Flaticon</a></li>
    </ul>
    `
  },
  {
    title: "Legal",
    content: `
    © 2021-${currentYear} <a href="https://linkedin.com/in/marcel-weber-3a05a61bb" target="_blank">Marcel Weber</a> for <a href="https://www.skyguide.ch/services/aeronautical-information-management" target="_blank">skyguide AIM Services</a>`
  }
]