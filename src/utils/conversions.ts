import convert from "geo-coordinates-parser"
import { Coord, Forwarded } from "../interfaces"
import { parsed, distances, speeds } from "../configs/generalConfigs"
import "proj4"
import { Dms } from "geodesy/latlon-ellipsoidal-datum"
import transformation from "transform-coordinates"

export function parseCoordinates(value:string, option:string){
	// Options: "WGS84 Deg Min", "WGS84 Deg Min Sec", "Decimal", "Swissgrid"	

	for(const [_key, value] of Object.entries(parsed)){
		value.coordinates.length = 0
	}

	if(option === "WGS84 Deg Min"){
		// checks for deg min coords only, format 4715N00725E)
		value.split(" ").forEach(value => {
			if(!value.match("^([0-9]{4}[NSns]{1}[0-9]{5}[EWew]{1})$")){
				alert(`Error with coordinate ${value}.\nOnly WGS84 coordinates in ICAO Format and Degress Minutes allowed.\nPlease adhere to format {ddmm}{N|S}{dddmm}{E|W}\nExample: 4710N00710E`)
				return
			}
		})
		parsed.wgs84degMin.coordinates = [...parsed.wgs84degMin.coordinates, ...value.split(" ")]
		parsed.wgs84degMinSec.coordinates = [...parsed.wgs84degMinSec.coordinates, ...value.split(" ").map(value => {
			return `${Dms.toLat(parseFloat(calcDegToDec(value)[0]), "dms").replaceAll(/°|\′|\″| /g, "")}${Dms.toLon(parseFloat(calcDegToDec(value)[1]), "dms").replaceAll(/°|\′|\″| /g, "")}`
		})]
		const decimal:string[][] = value.split(" ").map(value => calcDegToDec(value))
		parsed.decimal.coordinates = [...parsed.decimal.coordinates, ...decimal.map(value => `${value[0]},${value[1]}`) ]
		const c:Forwarded[] = decimal.map(value=> {
			const transform = transformation('EPSG:4326', 'EPSG:2056')
			return transform.forward({x: parseFloat(value[1]), y: parseFloat(value[0])})
		})
		parsed.swissgrid.coordinates = [...parsed.swissgrid.coordinates, ...c.map(value=> `${value.x},${value.y}`)]
	}
	if(option === "WGS84 Deg Min Sec"){
		// checks for deg min sec coords only, format 471500N0072500E)
		value.split(" ").forEach(value => {
			if(!value.match("^([0-9]{6}[NSns]{1}[0-9]{7}[EWew]{1})$")){
				alert(`Error with coordinate ${value}.\nOnly WGS84 coordinates in ICAO Format and Degress Minutes Seconds allowed.\nPlease adhere to format {ddmmss}{N|S}{ddmmss}{E|W}\nExample: 471015N0071015E`)
				return
			}
		})
		parsed.wgs84degMin.coordinates = [...parsed.wgs84degMin.coordinates, ...value.split(" ").map(value => {
			return `${Dms.toLat(parseFloat(calcDegToDec(value)[0]), "dm", 0).replaceAll(/°|\′|\″| /g, "")}${Dms.toLon(parseFloat(calcDegToDec(value)[1]), "dm", 0).replaceAll(/°|\′|\″| /g, "")}`
		})]
		parsed.wgs84degMinSec.coordinates = [...parsed.wgs84degMinSec.coordinates, ...value.split(" ")]
		const decimal:string[][] = value.split(" ").map(value => calcDegToDec(value))
		parsed.decimal.coordinates = [...parsed.decimal.coordinates, ...decimal.map(value => `${value[0]},${value[1]}`) ]
		const c:Forwarded[] = decimal.map(value=> {
			const transform = transformation('EPSG:4326', 'EPSG:2056')
			return transform.forward({x: parseFloat(value[1]), y: parseFloat(value[0])})
		})
		parsed.swissgrid.coordinates = [...parsed.swissgrid.coordinates, ...c.map(value=> `${value.x},${value.y}`)]
	}
	if(option === "Decimal"){
		// checks for decimal degree coords only, format 47.1...,7.1...)
		value.split(" ").forEach(value => {
			if(!value.match("^-*([0-9]{1,2})(.([0-9]+))?,-*([0-9]{1,3})(.([0-9]+))?$")){
				alert(`Error with coordinate ${value}.\nOnly decimal coordinates allowed.\nPlease adhere to format {d}.{n},{d}.{n}\nExample: 47.1333,7.1333`)
				return
			}
		})
		parsed.wgs84degMin.coordinates = [...parsed.wgs84degMin.coordinates, ...value.split(" ").map(value => {
			return `${Dms.toLat(parseFloat(value.split(",")[0]), "dm", 0).replaceAll(/°|\′|\″| /g, "")}${Dms.toLon(parseFloat(value.split(",")[1]), "dm", 0).replaceAll(/°|\′|\″| /g, "")}`
		})]
		parsed.wgs84degMinSec.coordinates = [...parsed.wgs84degMinSec.coordinates, ...value.split(" ").map(value => {
			return `${Dms.toLat(parseFloat(value.split(",")[0]), "dms", 0).replaceAll(/°|\′|\″| /g, "")}${Dms.toLon(parseFloat(value.split(",")[1]), "dms", 0).replaceAll(/°|\′|\″| /g, "")}`
		})]
		parsed.decimal.coordinates = [...parsed.decimal.coordinates, ...value.split(" ")]
		const c:Forwarded[] = value.split(" ").map(value=> {
			const transform = transformation('EPSG:4326', 'EPSG:2056')
			return transform.forward({x: parseFloat(value.split(",")[1]), y: parseFloat(value.split(",")[0])})
		})
		parsed.swissgrid.coordinates = [...parsed.swissgrid.coordinates, ...c.map(value=> `${value.x},${value.y}`)]
	}
	if(option === "Swissgrid"){
		value.split(" ").forEach(value => {
			if(!value.match("^(2)([0-9]{6})([.]*)([0-9]*),(1)([0-9]{6})([.]*)([0-9]*)$")){
				alert(`Error with coordinate ${value}.\nOnly Swissgrid LV95 coordinates allowed.\nPlease adhere to format 2{nnnnnn},1{nnnnnn}. Decimal values allowed.\nExample: 2600000,1200000 or 2600000.125,1200000.125`)
				return
			}
		})
		const c:Forwarded[] = value.split(" ").map(value=> {
			const transform = transformation('EPSG:2056', 'EPSG:4326')
			return transform.forward({x: parseFloat(value.split(",")[0]), y: parseFloat(value.split(",")[1])})})
		parsed.wgs84degMin.coordinates = [...parsed.wgs84degMin.coordinates, ...c.map(value => {
			return `${Dms.toLat(value.y, "dm", 0).replaceAll(/°|\′|\″| /g, "")}${Dms.toLon(value.x, "dm", 0).replaceAll(/°|\′|\″| /g, "")}`
		})]
		parsed.wgs84degMinSec.coordinates = [...parsed.wgs84degMinSec.coordinates, ...c.map(value => {
			return `${Dms.toLat(value.y, "dms", 0).replaceAll(/°|\′|\″| /g, "")}${Dms.toLon(value.x, "dms", 0).replaceAll(/°|\′|\″| /g, "")}`
		})]
		parsed.decimal.coordinates = [...parsed.decimal.coordinates, ...c.map(value => `${value.y},${value.x}`)]
		parsed.swissgrid.coordinates = [...parsed.swissgrid.coordinates, ...value.split(" ")]
	}
	return parsed
}

// function to convert DEG MIN SEC to DECIMAL
export function calcDegToDec(coord:string) {
	let converted:Coord
	try{
		converted = convert(coord)
		return [converted.decimalLatitude.toString(), converted.decimalLongitude.toString()]
	}
	catch{
		alert(`Error with coordinate ${coord}.\nOnly WGS84 coordinates in ICAO Format and Degress Minutes (and Seconds) allowed.\nPlease adhere to format {ddmmss}{N|S}{dddmmss}{E|W}\nExample: 4710N00710E`)
		return ["ERROR", "ERROR"]
	}
	
}

export function eetToDecimalHours(eet:string){
	const hours: number = parseInt(eet.substring(0,2))
	const minutes: number = parseInt(eet.substring(2,4))
	const decimalMinutes: number = minutes/60
	const decimalHours:number = hours + decimalMinutes
	return decimalHours
}

export function convertDistance(value:string, unit: string){
	if(isNaN(parseFloat(value))){
		alert(`${value} is not a recognized number format.`)
		return
	}
	if(unit === "Meter"){
		fillFromMeter(parseFloat(value))
	}
	if(unit === "Feet"){
		fillFromMeter(parseFloat(value)/3.2808)
	}
	if(unit === "Statute Mile"){
		fillFromMeter(parseFloat(value)/0.00062137)
	}
	if(unit === "Natical Mile"){
		fillFromMeter(parseFloat(value)*1852)
	}
	if(unit === "Kilometer"){
		fillFromMeter(parseFloat(value)*1000)
	}
}

function fillFromMeter(value: number){
	distances.m.value = value
	distances.ft.value = value*3.2808
	distances.sm.value = value*0.00062137
	distances.nm.value = value/1852
	distances.km.value = value/1000
}

export function convertSpeed(value:string, unit: string){
	if(isNaN(parseFloat(value))){
		alert(`${value} is not a recognized number format.`)
		return
	}
	if(unit === "km/h"){
		fillFromMs(parseFloat(value)/3.6)
	}
	if(unit === "mph"){
		fillFromMs(parseFloat(value)/2.237)
	}
	if(unit === "m/s"){
		fillFromMs(parseFloat(value))
	}
	if(unit === "Knots"){
		fillFromMs(parseFloat(value)/1.944)
	}
	if(unit === "Mach"){
		fillFromMs(parseFloat(value)*343)
	}
}

function fillFromMs(value: number){
	speeds.ms.value = value
	speeds.kmh.value = value*3.6
	speeds.mph.value = value*2.237
	speeds.kt.value = value*1.944
	speeds.mach.value = value/343
}