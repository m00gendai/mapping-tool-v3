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
}

export interface SidebarFlag{
    type: string
    icon: string
    text: string
}