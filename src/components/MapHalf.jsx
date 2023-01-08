export default function MapHalf(){
    return(
        <article id="mapHalf">
            <div id="mapid"></div>
            <div id="cursorTooltip"></div>
            <article id="mapOptionsBar">
                <button class="mapOptions" id="clearMarker" title="Clear Markers"></button>
                <button class="mapOptions" id="clearPopups" title="Clear Popups"></button>
                <button class="mapOptions" id="clearLine" title="Clear Lines"></button>
                <button class="mapOptions" id="clearAll" title="Clear All"></button>
                <button class="mapOptions" id="toggleVFR" title="Toggle VFR Chart Layers">
                    <div id="vfrContainer">
                        <div class="vfrContainerInner" id="vfrCH">
                            Switzerland VFR
                        </div>
                        <div class="vfrContainerInner" id="gldCH">
                             Switzerland GLD
                        </div>
                        <div class="vfrContainerInner" id="vfrFrance">
                            France VFR
                        </div>
                        <div class="vfrContainerInner" id="vfrGermany">
                            Germany VFR
                        </div>
                    </div>
                    VFR Charts
                </button>
                <button class="mapOptions" id="toggleDrone" title="Toggle Swiss Drone Restriction Layer">
                    <div id="droneContainer">
                        <div class="droneContainerInner" id="droneSchutz">
                            Natural Reserve Areas
                        </div>
                        <div class="droneContainerInner" id="droneSperr">
                            Restricted Zones
                        </div>
                        <div class="droneContainerInner" id="droneCTR">
                            CTR
                        </div>
                        <div class="droneContainerInner" id="droneAll">
                            All Areas
                        </div>
                    </div>
                    Drone Areas
                </button>
                <button class="mapOptions" id="focusSwitzerland" title="Focus Switzerland"></button>
                <button class="mapOptions" id="focusEurope" title="Focus Europe"></button>
                <button class="mapOptions" id="focusWorld" title="Focus World"></button>
            </article>
            <article id="mapDistanceBar">
                <section id="timeInputContainer">
                    <div id="timeLabel">Speed in Knots:</div>
                    <div id="timeInput">
                        <input id="speedInput" placeholder="100" />
                    </div>
                </section>
                <table>
                    <thead>
                        <tr>
                            <th>DEP</th>
                            <th>DIST</th>
                            <th>DEST</th>
                            <th>TIME</th>
                            <th>TOTAL DIST</th>
                            <th>TOTAL TIME</th>
                        </tr>
                    </thead>
                    <tbody id="distTable"></tbody>
                </table>
                <button id="expandMapDistanceBar"><i class="fa-solid fa-chevron-down"></i></button>
            </article>
        </article>
    )
}