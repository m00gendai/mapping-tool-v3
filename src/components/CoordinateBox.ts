import { state } from "../configs/state"
import { ParsedItem } from "../interfaces"

export function coordinateBox(value: ParsedItem){
      const box: HTMLDivElement = document.createElement("div")
      box.className="coords_box"
      box.style.height = `${(100/state.coordinateBoxSelect.length)}%`
      const boxTitle: HTMLDivElement = document.createElement("div")
      boxTitle.innerText = value.name
      box.appendChild(boxTitle)
      const boxContent: HTMLDivElement = document.createElement("div")
      boxTitle.className = "coords_box_title"
      boxContent.className = "coords_box_content"
      boxContent.innerHTML = value.name === "WGS84" ? `${value.coordinates}` :
                                value.name === "Decimal" ? `${parseFloat(value.coordinates[0].split(",")[0]).toFixed(4)} ${parseFloat(value.coordinates[0].split(",")[1]).toFixed(4)}` : 
                                `${Math.ceil(parseFloat(value.coordinates[0].split(",")[0]))} ${Math.ceil(parseFloat(value.coordinates[0].split(",")[1]))}`
      document.getElementById("coords")!.appendChild(box)
      box.appendChild(boxContent)
}