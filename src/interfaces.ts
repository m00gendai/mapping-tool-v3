export interface QueryInput{
    designation: string
    value: string
    type: string
  }

export interface State{
    popupVisible: boolean
    sidebarSelect: string
    totalDistance: number
}

export interface SidebarFlag{
    type: string
    icon: string
    text: string
}