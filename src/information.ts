import { Info, Update } from "./interfaces"
import { currentYear } from "./configs/generalConfigs"

export const updates:Update[] = [
  {
    date: "30. Sep 2026",
    content: `
      <ul>
        <li>Updated to EAD Data AIRAC 30 SEP 26</li>
        <li>Removed broken Stadia Base Maps</li>
        <li>Added new Satellite Base Map</li>
        <li>Added place labels to Satellite Base Maps</li>
        <li>Removed Broken France VFR Chart</li>
        <li>Fixed broken US IFR Low & High Charts</li>
        <li>Added US VFR Sectional & Terminal Charts</li>
        <li>Added formatting guide to Coordinate Conversion input field</li>
        <li>Removed Italian ARO Boundary</li>
      </ul>
      `
  },
  {
    date: "21. Mar 2026",
    content: `
      <ul>
        <li>Updated to EAD Data AIRAC 19 MAR 26</li>
        <li>Corrected Karlovy Vary TMA Location Indicator to LKKV instead of LKKN</li>
      </ul>
      `
  },
  {
    date: "26. Nov 2025",
    content: `
      <ul>
        <li>Updated to EAD Data AIRAC 27 NOV 25</li>
      </ul>
      `
  },
  {
    date: "14. Oct 2025",
    content: `
      <ul>
        <li>Fixed Setting "Show Coordinates in BRG/DIST Popups not working</li>
        <li>Added possibility to query French Private Airfields (eg. LF1234) in ALL and LOCI queries</li>
        <li>Added possibility to query non ICAO Airfields (eg. K6MN3) in LOCI query only</li>
        <li>Added possibility to query non ICAO Waypoints (eg. TH904) in WAYPOINT query only</li>
        <li>Added possibility to query one and two letter Navaids (eg. J or KY) in NAVAID query only</li>
        <li>Implemented update notifications</li>
      </ul>
      `
  },
]

export const infos:Info[] = [
  {
    title: "General",
    content: `AIM Mapping Tool is an open source application developed by <a href="https://linkedin.com/in/marcel-weber-3a05a61bb" target="_blank">Marcel Weber</a> as a supplementary tool for <a href="https://www.skyguide.ch/services/aeronautical-information-management" target="_blank">skyguide AIM Services</a>, 
              specifically to aid in plotting VFR flight plan routes. 
              Although it features official Swiss federal map and Eurocontrol data, it is not an official application and thus 
              shall not be used for navigational purposes. `
  },
  {
    title: "EAD Data AIRAC Date",
    content: `30 SEP 2026 uploaded 01.10.2026`
  },
  {
    title: "Overlay Data Sources",
    content: `
    <ul>
      <li>Swiss VFR Charts and Drone Areas via <a href="https://www.geo.admin.ch/en/geo-services/geo-services/portrayal-services-web-mapping/web-map-tiling-services-wmts.html" target="_blank">swisstopo</a></li>
      <li>German VFR Chart via <a href="https://www.dfs.de/dfs_homepage/en/Services/Customer%20Relations/INSPIRE/" target="_blank">DFS</a></li>
      <li>USA Charts via <a href="https://tiles.arcgis.com/tiles/ssFJjBXIUyZDrSYZ/arcgis/rest/services?f=html" target="_blank">FAA ArcGID Repository</a></li>
      <li>Airspace layers (CTR, TMA) via <a href="https://www.openaip.net/" target="_blank">openAIP.net</a>, custom linted & validated (and sometimes fixed) by <a href="https://linkedin.com/in/marcel-weber-3a05a61bb" target="_blank">Marcel Weber</a></li>
      <li>Airspace layer Switzerland from <a href="https://www.skyguide.ch/services/aeronautical-information-management" target="_blank">skyguide AIM Services</a></li>
      <li>Airspace layers (FIR) by <a href="https://linkedin.com/in/marcel-weber-3a05a61bb" target="_blank">Marcel Weber</a></li>
      <li>VFR Reporting Points Slovenia & Croatia by <a href="https://linkedin.com/in/marcel-weber-3a05a61bb" target="_blank">Marcel Weber</a></li>
      <li>LSAG/LSAZ Boundary by <a href="https://linkedin.com/in/marcel-weber-3a05a61bb" target="_blank">Marcel Weber</a></li>
    </ul>
    `
  },
  {
    title: "POI Data Sources",
    content: `
    <ul>
      <li>Place names and coordinates via <a href="https://www.geoapify.com/places-api" target="_blank">geoapify</a></li>
      <li>ICAO Location Indicators, Navaids and Waypoints from <a href="https://www.skyguide.ch/services/aeronautical-information-management" target="_blank">skyguide AIM Services</a></li>
    </ul>
    `
  },
  {
    title: "Attributions",
    content: `
    <ul>
      <li>Loading animation by <a href="https://icons8.com/preloaders/en/astronomy" target="_blank">icons8 - Preloaders</a></li>
      <li>Markers by <a href="https://www.flaticon.com/packs/location-59" target="_blank">Freepik - Flaticon</a></li>
      <li>Flag Markers by <a href="https://www.flaticon.com/packs/country-flags" target="_blank">Freepik - Flaticon</a></li>
    </ul>
    `
  },
  {
    title: "Legal",
    content: `
    © 2021-${currentYear} <a href="https://linkedin.com/in/marcel-weber-3a05a61bb" target="_blank">Marcel Weber</a> for <a href="https://www.skyguide.ch/services/aeronautical-information-management" target="_blank">skyguide AIM Services</a>`
  }
]