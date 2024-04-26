import { settings } from "../configs/settingsConfig"
import { state } from "../configs/state"

export function generateSettings(){
    settings.forEach(setting =>{
        const settingsItem: HTMLDivElement = document.createElement("div")
        document.getElementById("sidebarInner_settings")!.appendChild(settingsItem)
        settingsItem.className="sidebarInner_settings_item"
      
        const settingsTitle = document.createElement("div")
        settingsItem.appendChild(settingsTitle)
        settingsTitle.innerText = setting.name
        settingsTitle.title = setting.description
        settingsTitle.className = "sidebarInner_settings_title"
      
        if(setting.type === "range"){
            const rangeBox: HTMLDivElement = document.createElement("div")
            settingsItem.appendChild(rangeBox)
            rangeBox.className="sidebarInner_settings_rangebox"
            const range: HTMLInputElement = document.createElement("input")
            rangeBox.appendChild(range)
            range.type = setting.type
            range.min = setting.min || ""
            range.max = setting.max || ""
            range.step = setting.step || ""
            const customElement: HTMLDivElement = createRangeInput(setting.name)
            customElement.id = `range_${setting.name}`
            rangeBox.appendChild(customElement)
            const stateKey = setting.id as keyof typeof state
            range.value = state[stateKey] ? "1" : "0"
            range.value === "1" ? toggleSwitchOn(customElement) : toggleSwitchOff(customElement)
            rangeBox.addEventListener("click", function(){
                if(range.value === "0"){
                    if(setting.warning && !confirm(setting.warning)){
                        return
                    }
                    setting.function? setting.function() : null
                    toggleSwitchOn(customElement)
                    localStorage.setItem(`AMTV3_${setting.id}`, JSON.stringify(state[stateKey]))
                }
                if(range.value === "1"){
                    setting.function? setting.function() : null
                    toggleSwitchOff(customElement)
                    localStorage.setItem(`AMTV3_${setting.id}`, JSON.stringify(state[stateKey]))
                }
                range.value = range.value === "1" ? "0" : "1"
            })
        }
    })    
}

function createRangeInput(name:string){
    const track: HTMLDivElement = document.createElement("div")
    track.className = "custom_range_track"

    const thumb: HTMLDivElement = document.createElement("div")
    thumb.className = "custom_range_thumb"
    track.appendChild(thumb)
    track.id = `range_${name}`
    return track
}

function toggleSwitchOn(customElement:HTMLDivElement){
    customElement.children[0].classList.remove("range_thumb_left")
    customElement.children[0].classList.add("range_thumb_right")
    customElement.children[0].classList.remove("off")
    customElement.children[0].classList.add("on")
}

function toggleSwitchOff(customElement:HTMLDivElement){
    customElement.children[0].classList.remove("range_thumb_right")
    customElement.children[0].classList.add("range_thumb_left")
    customElement.children[0].classList.remove("on")
    customElement.children[0].classList.add("off")
}

