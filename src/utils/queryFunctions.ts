import { calcDegToDec, parseCoordinates } from "./conversions"
import { airports } from "../EAD_Data/EAD_AD_ALL"
import { navaids } from "../EAD_Data/EAD_NAV_ALL"
import { waypoints } from "../EAD_Data/EAD_WPT_ALL"
import { state } from "../configs/state"
import LatLon from 'geodesy/latlon-ellipsoidal-vincenty.js'
import { Parsed } from "../interfaces"

// RETURNS QUERY RESULTS FOR COORDINATES
export function placeCoords(coordinatesValue:string){
    const coordsArray: string[] = coordinatesValue.split(/\s+/g) // s+ is one or more whitespace characters
    const returnCoordinates:string[][] = []
    coordsArray.forEach(coord => {
        const coords:string[] = calcDegToDec(coord)
        returnCoordinates.push([coords[0], coords[1], `${coord}<br>${coords[0]}, ${coords[1]}`])
    })
    return returnCoordinates
}

// RETURNS QUERY RESULT FOR LOCATION INDICATOR
export function placeLoci(lociValue:string){
    const newAirports = airports.map(data => {return [
        data.codeId, 
        data.geoLat,
        data.geoLong,
        data.txtName]}) 
    const newAirportCodes:string[] = newAirports.map(code => {return code[0] || ""}) // makes a one dimensional array just with airport codes
    const multiLocis:string[][] = []
    const multiPorts = lociValue.toUpperCase().split(" ") // splits the input separated by space and makes an array
    multiPorts.forEach(multiPort => { // for every searched loci...
        for(const airport of newAirports){ // ...and for every airport array of the multi dimensional airport data array...
            if(multiPort.toUpperCase() == airport[0]!.toUpperCase()){ // if the searched loci equals the airport code of the airport data array...
                multiLocis.push([airport[1]!, airport[2]!, `${airport[0]}<br>${airport[3]}`])
            } 
        }
    })
    const unknownAirports = multiPorts.filter(airport => { return newAirportCodes.indexOf(airport) == -1; }) // filters the searched locis array for items not present in the airport codes array...
    if(unknownAirports.length > 0){
        alert(`Airports ${unknownAirports.join(" ")} not found`) //... and alerts each one
    }
    
    return multiLocis
}

// RETURNS QUERY RESULT FOR NAVAID
export function placeNavaid(navaidValue:String){

    const newNavaids = navaids.map(data => {return [
        data.codeId, 
        data.geoLat,
        data.geoLong,
        data.txtName,
        data.codeType]})
    const newNavaidCodes:String[] = newNavaids.map(code => {return code[0] || ""})

        let multiNavs:string[][] = []
        const multiAids = navaidValue.toUpperCase().split(" ")
        multiAids.forEach(multiAid => {
            for(const navaid of newNavaids){
                if(multiAid.toUpperCase() == navaid[0]!.toUpperCase()){
                    multiNavs.push([navaid[1]!, navaid[2]!, `${navaid[0]} ${navaid[4]}<br>${navaid[3]}`])
                }
            }
        })
        const unknownNavaids = multiAids.filter(navaid => { return newNavaidCodes.indexOf(navaid) == -1 })
        if(unknownNavaids.length > 0){
            alert(`Navaids ${unknownNavaids.join(" ")} not found`)
        }
        return multiNavs
}

// RETURNS QUERY RESULT FOR WAYPOINTS
export function placeRep(repField:string){

    const newReps = waypoints.map(data => {return [
        data.codeId, 
        data.geoLat,
        data.geoLong
    ]})
    const newRepCodes = newReps.map(code => {return code[0]})
    let multiWays:string[][] = []
    const multiReps = repField.toUpperCase().split(" ")
    multiReps.forEach(multiRep => {
        for(const rep of newReps){
            if(multiRep.toUpperCase() == rep[0].toUpperCase()){
                multiWays.push([rep[1], rep[2], rep[0]])
            }
        }
    })
    const unknownReps = multiReps.filter(rep => { return newRepCodes.indexOf(rep) == -1 })
    if(unknownReps.length > 0){ 
        alert(`Reporting Points ${unknownReps.join(" ")} not found`)
    }
    return multiWays
}

// RETURNS QUERY RESULT FOR POINT AT BEARGING/DISTANCE FROM NAVAID
export function placeBrgDist(BrgDistValue:string){ //TODO: Find a way to convert 360° azimuth to 180/-180 bearing
    const mappedNavaidsLatLng = navaids.map(data => {return [
        data.codeId, 
        data.geoLat,
        data.geoLong,
        data.txtName]})
    const mappedWaypointsLatLng = waypoints.map(data => {return [
        data.codeId, 
        data.geoLat,
        data.geoLong,
    ]})
    const brgDistArray = BrgDistValue.split(/\s+/g) // s+ is one or more whitespace characters
    let newMarkerArray:string[][] = []
    let unknownReps:string[] = []
    brgDistArray.forEach(brgDist => {
        if(brgDist.match(/\b([a-zA-Z]){3}[0-9]{3}[0-9]{3}\b/g)){ 
            const navaid:string = brgDist.substring(0,3).toUpperCase()
            const bearing:number = parseInt(brgDist.substring(3,6))
            const distanceNM:number = parseInt(brgDist.substring(6,9))
            const distanceM:number = (distanceNM*1.852)*1000
            for(const mappedNavaid of mappedNavaidsLatLng){
                if(mappedNavaid[0] == navaid){
                    const lat:number = parseFloat(mappedNavaid[1]!)
                    const lon:number = parseFloat(mappedNavaid[2]!)
                    const p1 = new LatLon(lat, lon)
                    const p2 = p1.destinationPoint(distanceM, bearing)
                    newMarkerArray.push([p2._lat.toString(), p2._lon.toString(), `${navaid}${brgDist.substring(3,6)}${brgDist.substring(6,9)}`])
                }
            }
        }
        if(brgDist.match(/\b([a-zA-Z]){5}[0-9]{3}[0-9]{3}\b/g)){ 
            const waypoint:string = brgDist.substring(0,5).toUpperCase()
            const bearing:number = parseInt(brgDist.substring(5,8))
            const distanceNM:number = parseInt(brgDist.substring(8,11))
            const distanceM:number = (distanceNM*1.852)*1000
            for(const mappedWaypoint of mappedWaypointsLatLng){
                if(mappedWaypoint[0] == waypoint){
                    const lat:number = parseFloat(mappedWaypoint[1])
                    const lon:number = parseFloat(mappedWaypoint[2])
                    const p1 = new LatLon(lat, lon)
                    const p2 = p1.destinationPoint(distanceM, bearing)
                    newMarkerArray.push([p2._lat.toString(), p2._lon.toString(), `${waypoint}${brgDist.substring(5,8)}${brgDist.substring(8,11)}`])
                }
            }
        }
        if(!brgDist.match(/\b([a-zA-Z]){3}[0-9]{3}[0-9]{3}\b/g) && !brgDist.match(/\b([a-zA-Z]){5}[0-9]{3}[0-9]{3}\b/g)){
            unknownReps.push(brgDist)
        }
    })
    if(unknownReps.length > 0){ 
        alert(`Reporting Points ${unknownReps.join(" ")} not found`)
    }
    return newMarkerArray
}

// RETURNS QUERY RESULT FOR PLACES

export async function placePlace(placeField:string){
    let multiPlaces:string[][] = []
    const query:string[] = placeField.split(",")
    for(const search of query){
        const getPlaces = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${search}&bias=countrycode:ch&apiKey=${import.meta.env.VITE_GEOAPIFY_API_KEY}`)
        let places
        if(getPlaces.ok){
            places = await getPlaces.json()
            for(const place of places.features){
                if(!(place.properties.result_type === "amenity" && place.properties.street)){
                    const extractCoords:Parsed = parseCoordinates(`${place.properties.lat},${place.properties.lon}`, "Decimal")

                    multiPlaces.push([place.geometry.coordinates[1], place.geometry.coordinates[0], `${place.properties.address_line1}<br>${place.properties.address_line2}${state.placeCoordinateOptIn ? `<br>${extractCoords.wgs84degMin.coordinates}<br>${extractCoords.decimal.coordinates}` : ``}`])
                }
            }
        } else {
            multiPlaces.push(["ERROR", "ERROR", "ERROR"])
        }        
    }
    return multiPlaces
}