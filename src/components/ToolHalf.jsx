export default function ToolHalf(){
    return(
        <aside id="toolHalf">
            <div id="tabContainer">
                <nav id="tabRow"></nav>
                <article id="tabContentContainer">
                    <div id="tabContent">
                        <div id="tabContentInner">
                            <section id="searchOnMap">
                                <div id="mapAllContainer" class="mapContainers">
                                    <textarea class="queryBoxes" id="mapAll"
                                        placeholder="-LSZA0700&#10;-N0160VFR W LUINO BRISSAGO&#10;-LSZL0030"></textarea>
                                    <button class="queryButtons" id="mapAllButton">Entire Route</button>
                                </div>
                                <div id="mapLociContainer" class="mapContainers">
                                    <textarea class="queryBoxes" id="mapLoci" placeholder="LSZH LSGG KJFK"></textarea>
                                    <button class="queryButtons" id="mapLociButton">Loci</button>
                                </div>
                                <div id="mapPlaceContainer" class="mapContainers">
                                    <textarea class="queryBoxes" id="mapPlace"
                                        placeholder="Hallau,Reichenbach im Kandertal,Hinwil"></textarea>
                                    <button class="queryButtons" id="mapPlaceButton">Place</button>
                                </div>
                                <div id="mapNavaidContainer" class="mapContainers">
                                    <textarea class="queryBoxes" id="mapNavaid" placeholder="ZUE TRA KLO"></textarea>
                                    <button class="queryButtons" id="mapNavaidButton">Navaid</button>
                                </div>
                                <div id="mapRepContainer" class="mapContainers">
                                    <textarea class="queryBoxes" id="mapRep" placeholder="RINLI LS201 MILPA"></textarea>
                                    <button class="queryButtons" id="mapRepButton">Waypoint</button>
                                </div>
                                <div id="mapCoordsContainer" class="mapContainers">
                                    <textarea class="queryBoxes" id="mapCoords"
                                        placeholder="4620N00733E 470126N0080129E"></textarea>
                                    <button class="queryButtons" id="mapCoordsButton">Coordinates</button>
                                </div>
                                <div id="mapBrgDistContainer" class="mapContainers">
                                    <textarea class="queryBoxes" id="mapBrgDist"
                                        placeholder="TRA180010 SOSON135075"></textarea>
                                    <button class="queryButtons"
                                        id="mapBrgDistButton">Bearing/<wbr />Distance from Point</button>
                                </div>
                                <mark>Not to be used for navigation purposes!</mark>
                                <h4>Search entire Route</h4>
                                Copy the entire route of a FPL in here including DEP and DEST. An extremely complicated
                                and advanced algorithm will automatically detect LOCIs, Places, Navaids, Waypoints,
                                Bearing/Distance from
                                Navaid/Waypoint and Coordinates and plot them.<br />
                                <br />
                                <code>-LSZA0700</code><br />
                                <code>-N0160VFR W LUINO BRISSAGO</code><br />
                                <code>-LSZL0030</code>
                                <br />
                                <h4>Search Loci:</h4>
                                <ul>
                                    <li>Worldwide ICAO Location Indicator search</li>
                                    <li>Multiple Location Indicators separated by space</li>
                                    <li>Case insensitive</li>
                                </ul>
                                <code>LSZH</code> or <code>LSZH kjfk fabl</code><br />
                                <br />
                                <h4>Search Place:</h4>
                                <ul>
                                    <li>Routed via google Maps, so cities, mountains, lakes, etc are queried</li>
                                    <li>Queries separated by comma (,)</li>
                                    <li>Case insensitive</li>
                                    <li>Location bias is Switzerland</li>
                                </ul>
                                <code>Hallau</code> or <code>hallau, Bad Zurzach,HEGNAU</code><br />
                                <br />
                                <h4>Search Navaids:</h4>
                                <ul>
                                    <li>Worldwide Navaid Indicator search</li>
                                    <li>Multiple Navaids separated by space</li>
                                    <li>Case insensitive.</li>
                                </ul>
                                <code>ZUE</code> or <code>klo zue TRA</code><br />
                                <br />
                                <h4>Search Waypoints:</h4>
                                <ul>
                                    <li>Worldwide Waypoint (5 letter) search</li>
                                    <li>Including Swiss LFN Waypoints</li>
                                    <li>Multiple Waypoints separated by space</li>
                                    <li>Case insensitive.</li>
                                </ul>
                                <code>RAMKOK</code> or <code>songi LS201 Lebso</code><br />
                                <br />
                                <h4>Search Coordinates:</h4>
                                <ul>
                                    <li>Coordinate search</li>
                                    <li>Single or multiple</li>
                                    <li>Case insensitive</li>
                                    <li>Plotted coordinates will be displayed as WGS84 (as queried) and decimal
                                        coordinates</li>
                                </ul>
                                Format either <code>4701N00745E</code> or <code>470140N0074530E</code>.<br />
                                Mixed format allowed <code>"nnnn"N|S"nnnnn"E|W</code> or
                                <code>"nnnnnn"N|S"nnnnnnn"E|W</code><br />
                                Ignores anything else, so <code>4701N00745E/n0150F090 DCT SPR DCT 471233n0080125e</code>
                                is valid and only the coordinates will be plotted.<br />
                                <br />
                                <h4>Search Bearing/Distance from Point:</h4>
                                <ul>
                                    <li>Bearing in Degrees (0-360)</li>
                                    <li>Distance in Nautical Miles (0-999)</li>
                                    <li>Either from Navaid or Waypoint</li>
                                    <li>Case insensitive</li>
                                    <li>Single or multiple</li>
                                </ul>
                                Format either <code>"NAV""BRG""DIST"</code> or <code>"WAYPT""BRG""DIST"</code>.<br />
                                <code>TRA123050</code> for 50 Nautical Miles, 123° from TRA or
                                <code>soson007226 Ramok226007</code> for 7 Nautical Miles, 226° from SOSON / 226
                                Nautical Miles, 7° from RAMOK.
                                <br />
                                <hr />
                            </section>
                            <section id="coordinateConversion">
                                <details>
                                    <summary>Coordinate Conversion</summary>
                                    Please adhere to format. Multiple coordinates separated by spaces. Use Notepad++ or
                                    other means to format coordinates if necessary.
                                    <hr />
                                    <div class="inputContainer">
                                        <select id="coordinateConversion_Input_Select">
                                            <option value="degMin">WGS84 Deg Min - 4714N00723E</option>
                                            <option value="degMinSec">WGS84 Deg Min Sec - 471405N0072354E</option>
                                            <option value="decimal">Decimal - 47.1256,7.1526</option>
                                            <option value="swissgrid">Swissgrid - 2600000,1200000</option>
                                        </select>
                                        <textarea id="coordinateConversion_Input"
                                            placeholder="4713N00713E 4857N00757E"></textarea>

                                        <button id="coordinateConversionConvert">Convert</button>
                                        <button id="coordinateConversionPlot">Plot</button>
                                    </div>
                                    <hr />
                                    <div class="resultContainer">
                                        <fieldset class="resultField">
                                            WGS84 Decimal Degrees
                                            <textarea id="coordinateConversion_Decimal"
                                                placeholder="Output Format: 47.1234,7.1234" disabled></textarea>
                                        </fieldset>
                                        <fieldset class="resultField">
                                            WGS84 Degrees Minutes Seconds
                                            <textarea id="coordinateConversion_WGS_DegMinSec"
                                                placeholder="Output Format: 471234N0071234E" disabled></textarea>
                                        </fieldset>
                                        <fieldset class="resultField">
                                            WGS84 Degrees Minutes
                                            <textarea id="coordinateConversion_WGS_DegMin"
                                                placeholder="Output Format: 4713N00713E" disabled></textarea>
                                        </fieldset>
                                        <fieldset class="resultField">
                                            Swissgrid
                                            <textarea id="coordinateConversion_Swissgrid"
                                                placeholder="Output Format: 2600000 1200000" disabled></textarea>
                                        </fieldset>
                                    </div>
                                </details>

                                <details>
                                    <summary>Unit Conversion</summary>
                                    <hr />
                                    <div class="inputContainer">
                                        <select id="heightConversion_Input_Select">
                                            <option value="feet">Feet</option>
                                            <option value="meter">Meters</option>
                                            <option value="statuteMile">Statute Miles</option>
                                            <option value="nauticalMile">Nautical Miles</option>
                                            <option value="kilometer">Kilometers</option>
                                        </select>
                                        <input id="heightConversion_Input" placeholder="123456" />

                                        <button id="heightConversion">Convert</button>
                                    </div>
                                    <hr />
                                    <div class="resultContainer">
                                        <fieldset class="resultField">
                                            Feet
                                            <input id="heightConversion_Feet" disabled />
                                        </fieldset>
                                        <fieldset class="resultField">
                                            Meters
                                            <input id="heightConversion_Meter" disabled />
                                        </fieldset>
                                        <fieldset class="resultField">
                                            Statute Miles
                                            <input id="heightConversion_StatuteMile" disabled />
                                        </fieldset>
                                        <fieldset class="resultField">
                                            Nautical Miles
                                            <input id="heightConversion_NauticalMile" disabled />
                                        </fieldset>
                                        <fieldset class="resultField">
                                            Kilometers
                                            <input id="heightConversion_Kilometer" disabled />
                                        </fieldset>
                                    </div>
                                </details>

                                <details>
                                    <summary>Speed Conversion</summary>
                                    <hr />
                                    <div class="inputContainer">
                                        <select id="speedConversion_Input_Select">
                                            <option value="kmh">km/h</option>
                                            <option value="mph">mph</option>
                                            <option value="ms">m/s</option>
                                            <option value="knots">Knots</option>
                                            <option value="mach">Mach</option>
                                        </select>
                                        <input id="speedConversion_Input" placeholder="123456" />

                                        <button id="speedConversion">Convert</button>
                                    </div>
                                    <hr />
                                    <div class="resultContainer">
                                        <fieldset class="resultField">
                                            km/h
                                            <input id="speedConversion_kmh" disabled />
                                        </fieldset>
                                        <fieldset class="resultField">
                                            mph
                                            <input id="speedConversion_mph" disabled />
                                        </fieldset>
                                        <fieldset class="resultField">
                                            m/s
                                            <input id="speedConversion_ms" disabled />
                                        </fieldset>
                                        <fieldset class="resultField">
                                            Knots
                                            <input id="speedConversion_knots" disabled />
                                        </fieldset>
                                        <fieldset class="resultField">
                                            Mach
                                            <input id="speedConversion_mach" disabled />
                                        </fieldset>
                                    </div>
                                </details>

                                <hr />
                            </section>
                            <section id="circle">
                                <div id="speedContainer" class="plotCircleInputs"><label for="speedForCircle">Speed in
                                        Knots:</label><input id="speedForCircle" placeholder="100" /></div>
                                <div id="speedTimeContainer" class="plotCircleInputs"><label for="timeOfCircle">Time for
                                        Distance:</label><span id="timeOfCircle"></span></div>
                                <h4>Plot Distance</h4>
                                <ol>
                                    <li>Plot a line with the &#8614; control</li>
                                    <li>Bearing and Distance are displayed</li>
                                    <ul>
                                        <li>If speed (in Knots) is entered, the time for the distance is displayed</li>
                                    </ul>
                                </ol>
                                The line accounts for the curvature of the earth.<br />
                                Multiple lines with intermediate points can be plotted.<br />
                                Press <kbd>ESC</kbd> once to cancel the current operation, twice to cancel line
                                plotting.
                                <br />
                                <h4>Plot Coverage Area</h4>
                                <ol>
                                    <li>Enter speed (in Knots)</li>
                                    <li>Plot a line with the &#8614; control</li>
                                    <li>On click at the desired time, a circle of the coverage area is displayed</li>
                                </ol>
                                The line and circle account for the curvature of the earth.<br />
                                Only one circle at a time can be plotted, its suggested to start a new line on a blank
                                canvas for a new circle.<br />
                                Press <kbd>ESC</kbd> once to cancel the current operation, twice to cancel line
                                plotting.
                                <h4>Measure Distance and Time between Markers</h4>
                                Doubleclick a marker, then doubleclick another to show a line between them.<br />
                                In the opened dialog window, the distance in Nautical Miles is displayed.<br />
                                Enter a speed in Knots to see the time needed for the distance.<br />
                                Click more markers to extend the line.<br />
                                Distance and time will be displayed between the current and last marker as well as the
                                total distance and time from the starting marker to the current one.
                            </section>
                            <section id="baseMaps">
                                <div id="mapChoiceTileContainer">
                                    <div id="mapChoiceTileContainerInner"></div>
                                </div>
                                <hr />
                            </section>
                            <section id="options">
                                <details>
                                    <summary>Set default layers</summary>
                                    <div id="defaultLayers"></div>
                                </details>
                                <hr />
                            </section>
                            <section id="about">
                                <div id="mapToolAboutContent">
                                    AIM Mapping Tool is an open source application developed as a supplementary tool for
                                    AIM Services Switzerland, specifically to aid in plotting VFR flight plan routes.
                                    Although it features official
                                    Swiss federal map and Eurocontrol data, it is not an official application and thus
                                    shall not be used for navigational purposes.
                                    <div class="aboutButtons">
                                        <button class="aboutButton">
                                            <a href="https://github.com/m00gendai/mapping-tool-v2" target="_blank"><i
                                                    class="fa-brands fa-git-alt"></i>Source Code</a>
                                        </button>
                                        <button class="aboutButton">
                                            <a href="https://trello.com/b/yzfLBL7h/aim-mapping-tool" target="_blank"><i
                                                    class="fa-brands fa-trello"></i>Changelog</a>
                                        </button>
                                        <button class="aboutButton">
                                            <a href="./Manual/User Manual.pdf" target="_blank"><i
                                                    class="fa-solid fa-book"></i>User Manual</a>
                                        </button>
                                    </div>
                                    <h4>EAD Data AIRAC Date</h4>
                                    19 MAY 22 uploaded 21.05.2022
                                    <h4>Coordinate Precision</h4>
                                    <ul>
                                        <li>Coordinate conversion based on WGS84 coordinates</li>
                                        <li>Accurate to 1/10000 of a degree (~11.1m) with slight variations of +/- 4m
                                            due to rounding operations</li>
                                        <li>0 degrees are treated as positive 0.00000001 degrees, which is an accuracy
                                            deviation of 1.11mm.</li>
                                    </ul>
                                    <h4>Base Map Data Source</h4>
                                    <ul>
                                        <li>Base, Satellite, Open Street and swisstopo map via <a
                                                href="https://www.maptiler.com/" target="_blank">maptiler</a></li>
                                        <li>National Geograpic and NASA/ESRI map via ArcGIS Web Map Service</li>
                                    </ul>
                                    <h4>Overlay Data Source</h4>
                                    <ul>
                                        <li>
                                            Swiss VFR Chart and Drone Areas via
                                            <a href="https://www.geo.admin.ch/en/geo-services/geo-services/portrayal-services-web-mapping/web-map-tiling-services-wmts.html"
                                                target="_blank">swisstopo</a>
                                        </li>
                                        <li>French VFR Chart via <a href="https://geoservices.ign.fr/"
                                                target="_blank">IGN</a></li>
                                        <li>German VFR Chart via <a
                                                href="https://www.dfs.de/dfs_homepage/en/Services/Customer%20Relations/INSPIRE/"
                                                target="_blank">DFS</a></li>
                                        <li>
                                            Airspace layers (CTR, TMA) via <a href="https://www.openaip.net/"
                                                target="_blank">openAIP.net</a>, custom linted & validated (and
                                            sometimes fixed) by
                                            <a href="https://linkedin.com/in/marcel-weber-3a05a61bb" target="_blank"
                                                title="See LinkedIn Profile">Marcel Weber</a>
                                        </li>
                                        <li>Airspace layer Switzerland from <a
                                                href="https://www.skyguide.ch/services/aeronautical-information-management"
                                                target="_blanK">skyguide AIM Services</a></li>
                                        <li>Airspace layers (FIR) by <a
                                                href="https://linkedin.com/in/marcel-weber-3a05a61bb" target="_blank"
                                                title="See LinkedIn Profile">Marcel Weber</a></li>
                                        <li>VFR Reporting Points Slovenia & Croatia by <a
                                                href="https://linkedin.com/in/marcel-weber-3a05a61bb" target="_blank"
                                                title="See LinkedIn Profile">Marcel Weber</a></li>
                                        <li>LSAG/LSAZ Boundary by <a
                                                href="https://linkedin.com/in/marcel-weber-3a05a61bb" target="_blank"
                                                title="See LinkedIn Profile">Marcel Weber</a></li>
                                        <li>Italy ARO Boundary by <a
                                                href="https://linkedin.com/in/marcel-weber-3a05a61bb" target="_blank"
                                                title="See LinkedIn Profile">Marcel Weber</a></li>
                                        <li>Rainviewer from <a href="https://github.com/mwasil/Leaflet.Rainviewer"
                                                target="_blank">mwasil</a></li>
                                    </ul>
                                    <h4>POI Data Source</h4>
                                    <ul>
                                        <li>Place names and coordinates via <a
                                                href="https://www.geoapify.com/places-api" target="_blank">Geoapify
                                                Places API</a></li>
                                        <li>ICAO Location Indicators, Navaids and Waypoints from <a
                                                href="https://www.ead.eurocontrol.int/cms-eadbasic/opencms/en/login/ead-basic/"
                                                target="_blank">Eurocontrol EAD</a></li>
                                    </ul>
                                    <h4>Attributions</h4>
                                    favicon by <a href="https://www.flaticon.com/free-icons/globe" target="_blank"
                                        title="globe icons">vectorsmarket15 - Flaticon</a><br />
                                    Markers by <a href="https://www.flaticon.com/packs/location-59" target="_blank"
                                        title="Location Pack">Freepik - Flaticon</a><br />
                                    Flag Markers by <a href="https://www.flaticon.com/packs/country-flags"
                                        target="_blank" title="COuntry Flags Pack">Freepik - Flaticon</a><br />
                                    Marker remove & Line remove by <a href="https://www.flaticon.com/packs/location-55"
                                        target="_blank" title="Location Pack">Freepik - Flaticon</a><br />
                                    Popup remove by <a href="https://www.flaticon.com/packs/web-essentials-3"
                                        target="_blank" title="Web Essentials Pack">Freepik - Flaticon</a><br />
                                    <br />
                                    <h4>Legal</h4>
                                    &copy; 2021-<span id="currentYear"></span> <a
                                        href="https://linkedin.com/in/marcel-weber-3a05a61bb" target="_blank"
                                        title="See LinkedIn Profile">Marcel Weber</a> for AIM Services Switzerland<br />
                                    <br />
                                </div>
                                <hr />
                            </section>
                        </div>
                    </div>
                </article>
            </div>
        </aside>
    )
}