export interface QueryInput{
    designation: string
    value: string
    type: string
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
}

export interface SidebarFlag{
    type: string
    icon: string
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
  