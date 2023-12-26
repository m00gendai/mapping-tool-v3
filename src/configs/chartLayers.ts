import { ChartLayer } from "../interfaces"

export const chartLayers:ChartLayer[] = [
  {
    id: "LSVFR",
    country: "LS",
    type: "VFR",
    url: "https://wmts.geo.admin.ch/1.0.0/ch.bazl.luftfahrtkarten-icao/default/current/3857/{z}/{x}/{y}.png",
    description: "Switzerland VFR Chart"
  },
  {
    id: "LSMIL",
    country: "LS",
    type: "MIL",
    url: 'https://wmts20.geo.admin.ch/1.0.0/ch.vbs.milairspacechart/default/current/3857/{z}/{x}/{y}.png',
    description: "Switzerlad MIL Airspace Chart"
  },
  {
    id: "LSMILPIL",
    country: "LS",
    type: "MIL",
    url: "https://wmts.geo.admin.ch/1.0.0/ch.vbs.swissmilpilotschart/default/current/3857/{z}/{x}/{y}.png",
    description: "Switzerland MIL Pilot Chart",
  },
  {
    id: "LSGLD",
    country: "LS",
    type: "GLD",
    url: "https://wmts.geo.admin.ch/1.0.0/ch.bazl.segelflugkarte/default/current/3857/{z}/{x}/{y}.png",
    description: "Switzerland Gilder Chart"
  },
  {
    id: "LSAREA",
    country: "LS",
    type: "AREA",
    url: "https://wmts.geo.admin.ch/1.0.0/ch.vbs.sperr-gefahrenzonenkarte/default/current/3857/{z}/{x}/{y}.png",
    description: "Switzerland Sperr- und Gefahrenzonen Chart"
  },
  {
    id: "LFVFR",
    country: "LF",
    type: "VFR",
    url: `https://wxs.ign.fr/${import.meta.env.VITE_IGN_FRANCE_API_KEY}/geoportail/wmts?service=WMTS&request=GetTile&version=1.0.0&tilematrixset=PM&tilematrix={z}&tilecol={x}&tilerow={y}&layer=GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN-OACI&format=image/jpeg&style=normal`,
    description: "France VFR Chart"
  },
  {
    id: "EDVFR",
    country: "ED",
    type: "VFR",
    url: `https://ais.dfs.de/static-maps/icao500/tiles/{z}/{x}/{y}.png`,
    description: "Germany VFR Chart"
  },
  {
    id: "USIFRHI",
    country: "KD",
    type: "IFR",
    url: "https://wms.chartbundle.com/tms/v1.0/enrh/{z}/{x}/{y}.png?type=google",
    description: "USA IFR ENR High"
  },
  {
    id: "USIFRLO",
    country: "KD",
    type: "IFR",
    url: "https://wms.chartbundle.com/tms/v1.0/enrl/{z}/{x}/{y}.png?type=google",
    description: "USA IFR ENR Low"
  },
]