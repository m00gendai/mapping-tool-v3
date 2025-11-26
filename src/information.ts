import { Info, Update } from "./interfaces"
import { currentYear } from "./configs/generalConfigs"

export const updates:Update[] = [
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
    content: `27 NOV 25 uploaded 26.11.2025`
  },
  {
    title: "Overlay Data Sources",
    content: `
    <ul>
      <li>Swiss VFR Charts and Drone Areas via <a href="https://www.geo.admin.ch/en/geo-services/geo-services/portrayal-services-web-mapping/web-map-tiling-services-wmts.html" target="_blank">swisstopo</a></li>
      <li>French VFR Chart via <a href="https://geoservices.ign.fr/" target="_blank">IGN</a></li>
      <li>German VFR Chart via <a href="https://www.dfs.de/dfs_homepage/en/Services/Customer%20Relations/INSPIRE/" target="_blank">DFS</a></li>
      <li>USA IFR Charts via <a href="http://www.chartbundle.com/charts/" target="_blank">ChartBundle</a></li>
      <li>Airspace layers (CTR, TMA) via <a href="https://www.openaip.net/" target="_blank">openAIP.net</a>, custom linted & validated (and sometimes fixed) by <a href="https://linkedin.com/in/marcel-weber-3a05a61bb" target="_blank">Marcel Weber</a></li>
      <li>Airspace layer Switzerland from <a href="https://www.skyguide.ch/services/aeronautical-information-management" target="_blank">skyguide AIM Services</a></li>
      <li>Airspace layers (FIR) by <a href="https://linkedin.com/in/marcel-weber-3a05a61bb" target="_blank">Marcel Weber</a></li>
      <li>VFR Reporting Points Slovenia & Croatia by <a href="https://linkedin.com/in/marcel-weber-3a05a61bb" target="_blank">Marcel Weber</a></li>
      <li>LSAG/LSAZ Boundary by <a href="https://linkedin.com/in/marcel-weber-3a05a61bb" target="_blank">Marcel Weber</a></li>
      <li>Italy ARO Boundary by <a href="https://linkedin.com/in/marcel-weber-3a05a61bb" target="_blank">Marcel Weber</a></li>
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