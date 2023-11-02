export interface QueryInput{
    designation: string
    value: string
    type: string
    placeholder: string
  }

export interface BaseMap{
  type: string
  layer: string
  attribution: string
}

export interface State{
    popupVisible: boolean
    sidebarSelect: string
    totalDistance: number
    setSpeed: number
    setDep: string
    setDist: number[]
    setDest: string
    setTime: number[]
    setTimeFields: number
    setTotalDist: number
    setTotalTime:number
    markerClicks: number
    layerGroupVisible: boolean
    checkedLayers: string[]
    layerGroupBuffer: boolean
    darkmode: boolean
    sidebarVisible: boolean
    basemapSelect: string
    baseLayer: L.TileLayer
    drawerVisible: boolean
    coordinateConversionSelect: string
    parsedDecimalCoordinates: string[]
    coordinateBoxVisible: boolean
    coordinateBoxSelect: string[]
}

export interface SidebarFlag{
    type: string
    text: string
}

export interface LayerGroup{
    name: string
    layers:LayerGroup_layer[]
}

export interface LayerGroup_layer{
    name: string
    id: string
    data: string
}

export interface JSONLayer {
    type: string
    features: Feature[]
  }
  
  export interface Feature {
    type: string
    properties: Properties
    geometry: Geometry
  }
  
  export interface Properties {
    ICAO: string
    Type: string
    Name: string
    Upper: string
    Lower: string
    Unit: Unit[]
  }
  
  export interface Unit {
    Name: string
    Callsign: string
  }
  
  export interface Geometry {
    type: string
    coordinates: number[][][]
  }
  
  export interface ChartLayer {
    id:string
    country: string
    type: string
    url: string
    description: string
  }

export interface Coord{
	verbatimCoordinates: string
	verbatimLatitude: string
	verbatimLongitude: string
	decimalLatitude: number
	decimalLongitude: number
	decimalCoordinates: string
}

export interface Parsed{
  wgs84degMin: ParsedItem
  wgs84degMinSec: ParsedItem
  decimal: ParsedItem
  swissgrid: ParsedItem
}

export interface ParsedItem{
  coordinates: string[]
  name: string
}

export interface Forwarded{
  x: number
  y: number
}

export interface Setting{
  name: string
  type: string
  max?: string | undefined
  min?: string | undefined
  step?: string | undefined
  item?: Item[] | undefined
}

interface Item{
  name: string
  value: string | number
}