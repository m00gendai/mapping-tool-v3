import { calcDegToDec } from "./conversions"

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