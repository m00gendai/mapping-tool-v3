import { calcDegToDec } from "./conversions"
import {airports} from "../EAD_Data/EAD_AD_ALL"
import {navaids} from "../EAD_Data/EAD_NAV_ALL"

// RETURNS QUERY RESULTS FOR COORDINATES
export function placeCoords(coordinatesValue:string){
    const coordsArray: string[] = coordinatesValue.split(/\s+/g) // s+ is one or more whitespace characters
    const zeroZeroCoords:string[][] = [] // initialises normalized array of string coordinates (normalized to 6 and 7 characters)
    
    coordsArray.forEach(coordinate => {
        if(coordinate.match("([0-9]{4}[a-zA-Z]{1}[0-9]{5}[a-zA-Z]{1})")){ // checks for deg min coords only, format 4715N00725E
            const coordinateNortSouth:string = `${coordinate.substring(0,4)}00${coordinate.substring(4,5).toUpperCase()}`
            const coordinateEastWest:string = `${coordinate.substring(5,10)}00${coordinate.substring(10).toUpperCase()}`
            zeroZeroCoords.push([coordinateNortSouth, coordinateEastWest])
        } else if(coordinate.match("([0-9]{6}[a-zA-Z]{1}[0-9]{7}[a-zA-Z]{1})")){ // checks for deg min coords only, format 471501N0072502E
            const coordinateNortSouth:string = `${coordinate.substring(0,6)}${coordinate.substring(6,7).toUpperCase()}`
            const coordinateEastWest:string = `${coordinate.substring(7,14)}${coordinate.substring(14).toUpperCase()}`
            zeroZeroCoords.push([coordinateNortSouth, coordinateEastWest])
        }
    })

    const decimalArray: string[][] = []
    zeroZeroCoords.forEach(coordinate => {
        const nsdeg:string = coordinate[0].substring(0,2)
        const nsmin:string = coordinate[0].substring(2,4)
        const nssec:string = coordinate[0].substring(4,6)
        const ewdeg:string = coordinate[1].substring(0,3)
        const ewmin:string = coordinate[1].substring(3,5)
        const ewsec:string = coordinate[1].substring(5,7)
        const nsSel:string = coordinate[0].substring(6)
        const ewSel:string = coordinate[1].substring(7)
        decimalArray.push(calcDegToDec(nsdeg, nsmin, nssec, ewdeg, ewmin, ewsec, nsSel, ewSel)!)
    })
    
    const returnCoordinates:string[][] = []
    decimalArray.forEach((decimalCoordinate:string[], index:number) => {
        returnCoordinates.push([decimalCoordinate[0], decimalCoordinate[1], `Decimal: ${decimalCoordinate[0]} ${decimalCoordinate[1]}<br> WGS84: ${zeroZeroCoords[index].join(" ")}`])
    })
    
    return returnCoordinates
}

// RETURNS QUERY RESULT FOR LOCATION INDICATOR
export function placeLoci(lociValue:string){
    const newAirports = airports.map(data => {return [
        data.codeId, 
        data.geoLat.charAt(data.geoLat.length-1) == "N" ? data.geoLat.substring(0, data.geoLat.length-1) : `-${data.geoLat.substring(0, data.geoLat.length-1)}`,  
        data.geoLong.charAt(data.geoLong.length-1) == "E" ? data.geoLong.substring(0, data.geoLong.length-1) : `-${data.geoLong.substring(0, data.geoLong.length-1)}`,
        data.txtName]}) 
    const newAirportCodes:string[] = newAirports.map(code => {return code[0]}) // makes a one dimensional array just with airport codes
    const multiLocis:string[][] = []
    const multiPorts = lociValue.toUpperCase().split(" ") // splits the input separated by space and makes an array
    multiPorts.forEach(multiPort => { // for every searched loci...
        for(const airport of newAirports){ // ...and for every airport array of the multi dimensional airport data array...
            if(multiPort.toUpperCase() == airport[0].toUpperCase()){ // if the searched loci equals the airport code of the airport data array...
                multiLocis.push([airport[1], airport[2], `${airport[0]}<br>${airport[3]}`])
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
        data.geoLat.charAt(data.geoLat.length-1) == "N" ? data.geoLat.substring(0, data.geoLat.length-1) : `-${data.geoLat.substring(0, data.geoLat.length-1)}`,  
        data.geoLong.charAt(data.geoLong.length-1) == "E" ? data.geoLong.substring(0, data.geoLong.length-1) : `-${data.geoLong.substring(0, data.geoLong.length-1)}`,
        data.txtName ? data.txtName : "",
        data.codeType ? data.codeType : "DME or TACAN"]})
    const newNavaidCodes:String[] = newNavaids.map(code => {return code[0]})

        let multiNavs:string[][] = []
        const multiAids = navaidValue.toUpperCase().split(" ")
        multiAids.forEach(multiAid => {
            for(const navaid of newNavaids){
                if(multiAid.toUpperCase() == navaid[0].toUpperCase()){
                    multiNavs.push([navaid[1], navaid[2], `${navaid[0]} ${navaid[4]}<br>${navaid[3]}`])
                }
            }
        })
        const unknownNavaids = multiAids.filter(navaid => { return newNavaidCodes.indexOf(navaid) == -1 })
        if(unknownNavaids.length > 0){
            alert(`Navaids ${unknownNavaids.join(" ")} not found`)
        }
        return multiNavs
    
}