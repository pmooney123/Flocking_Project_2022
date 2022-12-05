import {Display} from "./display.js"
import {System} from "./system.js";

class Game {
    constructor(width, height) {
        this.display = new Display(width, height)

        this.running = true
        this.doRender = true
        this.system = new System(width, height)

        this.left_held = false
        this.right_held = false
        this.forward_held = false
    }
    getDisplay() {
        return this.display
    }
    getSystem() {
        return this.system
    }
    update() {
        //update simulation

        this.getSystem().update()
        //console.log("updating simulation")

        //render simulation
        if (this.doRender) {
            //console.log("rendering frame")
            let elements = this.getSystem().getElements()
            this.getDisplay().update(elements)
        }

        //handle input
        if (this.left_held) {
            this.getSystem().getElements()[0].turn(-1)
        }
        if (this.right_held) {
            this.getSystem().getElements()[0].turn(1)
        }
        if (this.forward_held) {
            this.getSystem().getElements()[0].move(1)
        }

        //handle sliders
        let preyFOV = document.getElementById("preyFOV").value
        let preyDepth = document.getElementById("preyRange").value
        this.system.getElements().forEach(organism => {

            if (organism.isPrey) {
                organism.setFOV(preyFOV)
                organism.line_length = preyDepth
            }
        })

    }
}

export {Game}