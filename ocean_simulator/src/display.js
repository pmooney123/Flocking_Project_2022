import {DisplayParameters} from "./displayParameters.js"
import {Canvas} from "./canvas.js"

class Display {
    constructor(width, height) {
        this.paused = false
        this.parameters = new DisplayParameters(width, height)
        this.canvas = new Canvas(width, height)
        this.drawLines = true
        this.drawForces = false
    }

    update(elements) {
        this.canvas.clear()

        if (elements.length > 0) {
            elements.forEach(element => {
                //FOV lines
                if (this.drawLines) {
                    this.canvas.drawLine(element.x, element.y,
                        element.x + element.line_length/5 * Math.cos(element.angle - element.fov / 2),
                        element.y + element.line_length/5  * Math.sin(element.angle - element.fov / 2)
                    )
                    this.canvas.drawLine(element.x, element.y,
                        element.x + element.line_length/5  * Math.cos(element.angle + element.fov / 2),
                        element.y + element.line_length/5  * Math.sin(element.angle + element.fov / 2)
                    )
                }
                if (this.drawForces) {
                    element.force_vectors.forEach(vector => {
                        this.canvas.drawLine(element.x, element.y,
                            element.x + (25 * vector.magnitude) * Math.cos(vector.angle),
                            element.y + (25 * vector.magnitude) * Math.sin(vector.angle)
                        )
                    })
                }

                //this.canvas.drawText(element.x, element.y, element.text, "white")
                //Organism Shape
                this.canvas.drawCircle(element.x, element.y, element.size/2, element.color)

            })
        }

    }

    toggle_pause() {
        this.paused = !this.paused
    }
}

export {Display}