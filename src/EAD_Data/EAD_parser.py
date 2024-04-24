import csv

with open("Navaid.csv", newline="") as navaidFile:
    reader = csv.reader(navaidFile, delimiter=",")
    f = open("EAD_NAV_ALL.ts", "w")
    f.write("")
    f.close()
    x = open("EAD_NAV_ALL.ts", "a")
    x.write('import {EADdata} from "../interfaces"\n')
    x.write("export const navaids: EADdata[] = [\n")
    for row in reader:
        tp = ""
        if str(row[4]) == "VOR_DME":
            tp = "VOR/DME"
        else:
            tp = row[4]
        x.write(f'{{\n\t"codeId": "{row[2]}",\n\t"geoLat": "{row[1]}",\n\t"geoLong": "{row[0]}",\n\t"txtName": "{row[3]}",\n\t"codeType": "{tp}"\n}},\n')
    x.write("]")
    x.close()

with open("AirportHeliports.csv", newline="") as navaidFile:
    reader = csv.reader(navaidFile, delimiter=",")
    f = open("EAD_AD_ALL.ts", "w")
    f.write("")
    f.close()
    x = open("EAD_AD_ALL.ts", "a")
    x.write('import {EADdata} from "../interfaces"\n')
    x.write("export const airports: EADdata[] = [\n")
    for row in reader:
        if row[4] != "":
            adName = row[3].replace('"', "'")
            x.write(f'{{\n\t"codeId": "{row[4]}",\n\t"geoLat": "{row[1]}",\n\t"geoLong": "{row[0]}",\n\t"txtName": "{adName}",\n}},\n')
    x.write("]")
    x.close()

with open("DesignatedPoint.csv", newline="") as navaidFile:
    reader = csv.reader(navaidFile, delimiter=",")
    f = open("EAD_WPT_ALL.ts", "w")
    f.write("")
    f.close()
    x = open("EAD_WPT_ALL.ts", "a")
    x.write('import {EADdata} from "../interfaces"\n')
    x.write("export const waypoints: EADdata[] = [\n")
    for row in reader:
        if row[4] == "ICAO":
           x.write(f'{{\n\t"codeId": "{row[2]}",\n\t"geoLat": "{row[1]}",\n\t"geoLong": "{row[0]}",\n}},\n')
    x.write("]")
    x.close()

    