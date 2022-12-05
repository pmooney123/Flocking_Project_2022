import {DisplayParameters} from "./displayParameters.js"
import {Canvas} from "./canvas.js"

class Display {
    constructor(width, height) {
        this.paused = false
        this.parameters = new DisplayParameters(width, height)
        this.canvas = new Canvas(width, height)
        this.drawLines = false
        this.drawForces = false
    }

    update(elements) {
        this.canvas.clear()

        if (elements.length > 0) {
            elements.forEach(element => {
                //FOV lines
                if (this.drawLines) {
                    this.canvas.ctx.strokeStyle = element.color
                    this.canvas.drawLine(element.x, element.y,
                        element.x + element.line_length/10 * Math.cos(element.angle - element.fov / 2),
                        element.y + element.line_length/10  * Math.sin(element.angle - element.fov / 2)
                    )
                    this.canvas.drawLine(element.x, element.y,
                        element.x + element.line_length/10  * Math.cos(element.angle + element.fov / 2),
                        element.y + element.line_length/10  * Math.sin(element.angle + element.fov / 2)
                    )
                    this.canvas.drawLine(element.x, element.y,
                        element.x + element.line_length/9  * Math.cos(element.angle),
                        element.y + element.line_length/9  * Math.sin(element.angle)
                    )
                }
                if (this.drawForces) {
                    this.canvas.ctx.strokeStyle = element.color
                    console.log(element.vector)
                    this.canvas.drawLine(element.x, element.y,
                        element.x + (element.vector.magnitude) * Math.cos(element.vector.angle),
                        element.y + (element.vector.magnitude) * Math.sin(element.vector.angle)
                    )
                    /*
                    this.canvas.ctx.strokeStyle = element.color
                    element.force_vectors.forEach(vector => {
                        this.canvas.drawLine(element.x, element.y,
                            element.x + (25 * vector.magnitude) * Math.cos(vector.angle),
                            element.y + (25 * vector.magnitude) * Math.sin(vector.angle)
                        )
                    })

                     */
                }

                //this.canvas.drawText(element.x, element.y, element.text, "white")
                //Organism Shape
                //console.log("params " + element.x + " " + element.y + " " + element.size + " " + " " + element.angle)
                this.canvas.drawTriangle(element.x, element.y, element.size, element.color, element.angle)

            })
        }

    }

    toggle_pause() {
        this.paused = !this.paused
    }
}

export {Display}