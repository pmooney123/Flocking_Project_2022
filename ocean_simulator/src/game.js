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


        this.count = 0

        this.preyPopulationStats = []

    }

    //Run simulation
    update() {
        //Update Simulation
        this.count++
        this.getSystem().update()

        //Animate
        if (this.doRender) {
            //console.log("rendering frame")
            let elements = this.getSystem().getElements()
            this.getDisplay().update(elements)
        }

        //Handle sliders
        this.handleSliders()

        //Update Stats
        this.system.num_prey = 0; this.system.num_predators = 0
        this.system.getElements().forEach(organism => {
            if (organism.isPrey) {
                this.system.num_prey++
            }
            if (!organism.isPrey) {
                this.system.num_predators++
            }
        })
    }

    //Manager HTML Slider elements, gets values and sets game variables
    handleSliders() {
        let preyFOV = document.getElementById("preyFOV").value
        let preyDepth = document.getElementById("preyRange").value
        let predatorFOV = document.getElementById("predatorFOV").value
        let predatorDepth = document.getElementById("predatorRange").value
        this.system.getElements().forEach(organism => {
            if (organism.isPrey) {
                organism.setFOV(preyFOV)
                organism.line_length = preyDepth
            } else {
                organism.setFOV(predatorFOV)
                organism.line_length = predatorDepth
            }
        })
    }

    getDisplay() {
        return this.display
    }

    getSystem() {
        return this.system
    }
}

export {Game}