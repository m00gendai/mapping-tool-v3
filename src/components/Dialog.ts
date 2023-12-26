import { state } from "../configs/state"

export function createDialog(){
    const dialog: HTMLDialogElement = document.createElement("dialog")
    document.body.appendChild(dialog)
  dialog.className ="dialog"
  if(!state.acceptedLegality){
    dialog.showModal()
  }
  const textElement: HTMLParagraphElement = document.createElement("p")
  textElement.innerHTML = `
  <h1>AIM Mapping Tool V3 Public Beta</h1>
    This application is only intended for educational purposes. It is <strong>NOT</strong> intended for navigational and/or operational use.<br>
    <br>
    Data concurrency and/or validity and/or correctness is <strong>NOT</strong> guaranteed.

    By accepting this, I...
    <ul>
    <li>am aware that this application is not intended for navigational and/or operational use and is intended only for educational purposes</li>
    <li>take full responsibility for any consequences resulting from using this application for anything else than its intended educational purpose</li>
    <li>relieve the author of this application of any and all responsibility concerning consequences resulting from using this application for anything else than its intended educational purpose</li>
    <li>am aware that data concurrency and/or validity and/or correctness is not guaranteed</li>
    <li>take full responsibility for any consequences resulting in the using of and/or relying on data whose concurrency and/or validity and/or correctness is not guaranteed</li>
    <li>relieve the author of this application of any and all responsibility concerning consequences resulting from the using of and/or relying on data whose concurrency and/or validity and/or correctness is not guaranteed</li>
    </ul>

    Please type "I accept" (without quotes) to continue to the application.
    `
    dialog.appendChild(textElement)
    const input: HTMLInputElement = document.createElement("input")
    input.type = "text"
    input.placeholder = "I accept"
    dialog.appendChild(input)
    const button: HTMLButtonElement = document.createElement("button")
    dialog.appendChild(button)
    button.innerText = "OK"
    button.disabled = true
  let value: string
    input.addEventListener("keyup", function(){
      value = input.value
      if(value === "I accept"){
        button.disabled = false
        button.addEventListener("click", function(){
          dialog.close()
          localStorage.setItem("AMTV3_agb", JSON.stringify(true))
          document.body.removeChild(dialog)
        })
      }
      if(value !== "I accept"){
        button.disabled = true
      }
    })
return dialog
}