import { FAANOTAM } from "../interfaces";
import { getLiveDabs } from "../liveDabs";
import { layerArray, map } from "../main";
import { test_NOTAM } from "../testing/template_NOTAM";
import { notamActiveCheck } from "../utils/NOTAMitemDparser";

async function fetchNOTAMs(){
  const body = {
    targetUrl: 'https://notams.aim.faa.gov/notamSearch/airport?locID=352582',
    allowedOrigin: 'https://verbose-tribble-v5vp6w79g992pw4g-5173.app.github.dev',
    fetchMethod: 'GET',
    payload: 'searchType=0&radius=10&designatorsForLocation=LSAS&offset=108'  // only needed for POST
  };

  const getNOTAMS = await fetch(`https://cors-proxy-iota-dun.vercel.app/api/cors`,{
    headers: {
    'Content-Type': 'application/json',
    },
    mode: 'cors', // This tells the browser to handle CORS
    method: "POST",
    body: JSON.stringify(body)
    
  })
  const res = await getNOTAMS.json()
  return res
}

async function enableLiveDabs(){

  const notamList = await fetchNOTAMs()

  const testNOTAMArray:FAANOTAM[] = [...notamList.notams, test_NOTAM]

  const filtered:FAANOTAM[] = testNOTAMArray.filter(notam => notam.notamNumber.startsWith("W") && notamActiveCheck(notam))

if(filtered.length === 0){
  alert("No DABS Areas active")
}
  const setLayer:L.GeoJSON =  await getLiveDabs(filtered)
      setLayer.addTo(map)
      layerArray.push(["xxx", setLayer])
}



export default async function sidebar_liveDabs(){
    const content = document.createElement("div")

    const title = document.createElement("h1")
    title.textContent = "Live DABS & Swiss NOTAM Data"
    content.appendChild(title)

    const description = document.createElement("p")
    description.innerHTML = `This is a list of all currently published Swiss NOTAM.\nBy selecting "Enable LiveDABS", the currently active DABS Areas will be plotted.`
    content.appendChild(description)

    const button = document.createElement("button")
    button.setAttribute("class", "sidebar_button_large")
    button.textContent = "Enable LiveDABS"
    button.addEventListener("click", function(){
        enableLiveDabs()
    })
    content.appendChild(button)

    const notamContainer = document.createElement("div")
    notamContainer.setAttribute("class", "notamContainer")
    content.appendChild(notamContainer)

    const notamList = await fetchNOTAMs()
    const notams:FAANOTAM[] = notamList.notams
    notams.forEach(notam =>{
      const tamContainer = document.createElement("details")
      tamContainer.setAttribute("class", "notamSpoiler")

      const tamContainerTitle = document.createElement("summary")
      tamContainer.appendChild(tamContainerTitle)
      tamContainerTitle.innerText = `${notam.notamNumber}`

      const tamContainerContent = document.createElement("div")
      tamContainer.appendChild(tamContainerContent)
      tamContainerContent.setAttribute("class", "notamSpoilerContent")
      tamContainerContent.innerHTML = notam.icaoMessage.replaceAll("\n", "<br>")

      notamContainer.appendChild(tamContainer)
    })


    return content
}