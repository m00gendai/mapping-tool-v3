import { BaseMap } from "../interfaces"

export const baseMaps:BaseMap[] =
  [
    {
      type: `OSM`,
      layer: `https://tile.openstreetmap.org/{z}/{x}/{y}.png`,
      attribution: `© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap Contributors</a>`,
      needsLabels: false,
    },
    {
      type: "ESRI World Imagery",
      layer: `https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/WMTS/tile/1.0.0/World_Imagery/{}/{}/{z}/{y}/{x}.jpg`,
      attribution: `© <a href="https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9">Esri, Maxar, Earthstar Geographics, and the GIS User Community</a>`,
      needsLabels: false,
    },
    {
      type: "Versatiles Satellite",
      layer: `https://tiles.versatiles.org/tiles/satellite/{z}/{x}/{y}`,
      attribution: `<a href="https://versatiles.org/sources/">VersaTiles sources</a>`,
      needsLabels: true,
    },
    {
      type: "SWISSTOPO_LIGHT",
      layer: `https://api.maptiler.com/maps/ch-swisstopo-lbm-vivid/256/{z}/{x}/{y}.png?key=${import.meta.env.VITE_MAPTILER_API_KEY}`,
      attribution: `<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap Contributors</a><a href="https://www.swisstopo.admin.ch/en" target="_blank">© swisstopo</a>`,
      needsLabels: false,
    },
    {
      type: "SWISSTOPO_DARK",
      layer: `https://api.maptiler.com/maps/ch-swisstopo-lbm-dark/256/{z}/{x}/{y}.png?key=${import.meta.env.VITE_MAPTILER_API_KEY}`,
      attribution: `<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">©  OpenStreetMap Contributors</a><a href="https://www.swisstopo.admin.ch/en" target="_blank">© swisstopo</a>`,
      needsLabels: false,
    },
    {
      type: "ESRI World Street Map",
      layer: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}`,
      attribution: `Tiles: © Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012`,
      needsLabels: false,
    },
  ]


  