import {Species} from "./species.js"
import {Organism} from "./organism.js";

class System {
    constructor(width, height) {
        this.organisms = []

        this.width = width
        this.height = height

        // create starting organisms
        for (let i = 0; i < 0; i++) {
            this.organisms.push(this.createPredator())
        }
        for (let i = 0; i < 300; i++) {
            this.organisms.push(this.createPrey())
        }

    }

    getElements() {
        return this.organisms
    }

    update() {
        //update all organisms
        this.organisms.forEach(organism => {
            organism.update(this.organisms)
        })

        //check for random growth of prey
        /*
        if (this.organisms.length < 500) {
            this.organisms.forEach(organism => {
                if (organism.isPrey) {
                    if (Math.random() < 0.01) {
                        this.organisms.push(this.createPrey())
                    }
                }
            })
        }

         */

        //check for predator success
        /*
        this.organisms.forEach(predator => {

            if (!predator.isPrey) {
                if (Math.random() < 0.001) {
                    predator.flagForRemoval = true
                }
            }

            if (!predator.isPrey) {
                this.organisms.forEach(prey => {
                    if (prey.isPrey && !prey.flagForRemoval) {

                        let distance = Math.sqrt(Math.pow((prey.y - predator.y), 2) + Math.pow((prey.x - predator.x), 2))
                        if (distance < predator.size) {
                            prey.flagForRemoval = true
                            if (Math.random() < 0.2) {
                                this.organisms.push(this.createOffspring(predator))
                            }
                        }
                    }
                })
            }
        })
         */

        //remove dead
        for (let i = 0; i < this.organisms.length; i++) {
            if (this.organisms[i].flagForRemoval) {
                this.organisms.splice(i, 1)
            }
        }


        this.checkBoundaries()
    }

    checkBoundaries() {
        this.organisms.forEach(organism => {
            if (organism.x < 0) {
                organism.x = 0
            }
            if (organism.y < 0) {
                organism.y = 0
            }
            if (organism.y > this.height) {
                organism.y = this.height
            }
            if (organism.x > this.width) {
                organism.x = this.width
            }
        })
    }

    createPredator() {
        let predator = new Organism(Math.random() * this.width, Math.random() * this.height, "red", 5)
        predator.setFOV(30)
        predator.move_speed = 2
        predator.turn_speed = 0.02
        predator.line_length = 200
        predator.isPrey = false
        return predator
    }

    createPrey() {
        let prey = new Organism(Math.random() * this.width, Math.random() * this.height, "lime", 5, this.width, this.height)

        return prey
    }

    createOffspring(parent) {
        let organism = new Organism(parent.x, parent.y, parent.color, parent.size)
        organism.setFOV(parent.fov * (180 / Math.PI))
        organism.move_speed = parent.move_speed
        organism.turn_speed = parent.turn_speed
        organism.line_length = parent.line_length
        organism.isPrey = parent.isPrey

        return organism
    }
}


export {System}