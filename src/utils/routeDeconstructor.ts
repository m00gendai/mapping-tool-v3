import { airports } from "../EAD_Data/EAD_AD_ALL"
import { navaids } from "../EAD_Data/EAD_NAV_ALL"
import { waypoints } from "../EAD_Data/EAD_WPT_ALL"

const sameNameLocationsWaypoints = [
    "EVIAN", "ROCHE"
    ]

export function routeDeconstructor(rte:string){
    const mappedAirports:string[] = airports.map(airport => {return airport.codeId})
    const mappedWaypoints:string[] = waypoints.map(waypoint => {return waypoint.codeId})
    const mappedNavaids:string[] = navaids.map(navaid => {return navaid.codeId})
    const foundNavaids:string[] = checkNavaids(rte, mappedNavaids)
    const foundWaypoints:string[] = checkWaypoints(rte, mappedWaypoints)
    const foundBearingDistance:string[] = checkBearingDistance(rte)
    const foundLocis:string[] = checkLocis(rte, mappedAirports)
   // const foundOther = checkOther(rte, foundNavaids, foundWaypoints, foundLocis)
    const foundCoordinates = checkCoordinates(rte)
    return [foundNavaids, foundLocis, foundWaypoints, foundCoordinates, foundBearingDistance]
}

function checkNavaids(rte:string, mappedNavaids:string[]){
    const navaidMatch = rte.match(/\b([A-Z]){3}\b/g)
    let navaids = []
    if(navaidMatch){
        for(const matchingNavaid of navaidMatch) {
            if(mappedNavaids.includes(matchingNavaid)){
                navaids.push(matchingNavaid)
            }
        }
    }
    return navaids
}

function checkBearingDistance(rte:string){
    const brgDistMatchNavaid = rte.match(/\b([A-Z]){3}[0-9]{3}[0-9]{3}\b/g)
    const brgDistMatchWaypoint = rte.match(/\b([A-Z]){5}[0-9]{3}[0-9]{3}\b/g)
    let bearingDistances = []
    if(brgDistMatchNavaid){
        for(const navaid of brgDistMatchNavaid){
            bearingDistances.push(navaid)
        }
    }
    if(brgDistMatchWaypoint){
        for(const waypoint of brgDistMatchWaypoint){
            bearingDistances.push(waypoint)
        }
    }
    return bearingDistances
}

function checkLocis(rte:string, mappedAirports:string[]){
    const lociMatch = rte.match(/\b([A-Z]){4}([0-9\n]*)\b/g)
    let locis = []
    if (lociMatch) {
        for(const matchingLoci of lociMatch){
            if(mappedAirports.includes((matchingLoci.replace(/[0-9]+/, "")))){
                locis.push(matchingLoci.replace(/[0-9]+/, ""))
            }
        }
    }
    return locis
}

function checkWaypoints(rte:string, mappedWaypoints:string[]){
    const waypointMatch = rte.match(/\b([A-Z]){5}\b/g)
    const lfnMatch = rte.match(/\b(LS)([0-9]){3}\b/g)
    let waypoints = []
    if(waypointMatch){
        for (const matchingWaypoint of waypointMatch) {
            if(mappedWaypoints.includes(matchingWaypoint)){
                waypoints.push(matchingWaypoint)
                if(sameNameLocationsWaypoints.includes(matchingWaypoint)){
                    alert(`Waypoint and Location with same name exists: ${matchingWaypoint}. Please search for location manually.`)
                }
            }
        }
    }
    if(lfnMatch){
        for (const lfnWaypoint of lfnMatch){
            waypoints.push(lfnWaypoint)
        }
    }
    return waypoints
}
/*
function checkOther(rte, navaids, waypoints, locis){
    rte = _.deburr(rte)
    const otherMatch = rte.match(/\b([A-Z]){3,}\b/g)
    let otherWords = []
    let checkArray = []
    let checkArray2 = ["VFR", "IFR", "DCT", "STAY", "VOR", "NDB", "DME", "TACAN", "VORTAC", "SID", "STAR", "ILS"]
    if(navaids){
        navaids.forEach(navaid => {
            checkArray.push(navaid)
        })
    }
    if(waypoints){
        waypoints.forEach(waypoint => {
            checkArray.push(waypoint)
        })
    }
    if(locis){
        locis.forEach(loci => {
            checkArray.push(loci)
        })
    }
    if(checkArray){
        for(const item of checkArray){
            checkArray2.push(item)
        }
    }
    if(otherMatch){
        for (const match of otherMatch) {
             if(!checkArray2.includes(match)){
                otherWords.push(match)
            }
        }
    }
    return otherWords
}
*/

function checkCoordinates(rte:string){
    // coord 1234N01234E
    const coordSmall = rte.match(/([0-9]{4}[a-zA-Z]{1}[0-9]{5}[a-zA-Z]{1})/g)
    // coord 123456N0123456E
    const coordLarge = rte.match(/([0-9]{6}[a-zA-Z]{1}[0-9]{7}[a-zA-Z]{1})/g)
    let coordAll = []
    if(coordSmall){
        for(const coord of coordSmall){
            coordAll.push(coord)
        }
    } 
    if(coordLarge){
        for(const coord of coordLarge){
                coordAll.push(coord)
        }
    } 
    return coordAll
}