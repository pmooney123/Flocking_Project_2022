import {Organism} from "./organism.js";

class System {
    constructor(width, height) {
        this.organisms = []

        this.width = width
        this.height = height

        // create starting organisms
        this.desiredPrey = 200
        this.desiredPredators = 5
        for (let i = 0; i < this.desiredPredators; i++) {
            this.organisms.push(this.createPredator())
        }
        for (let i = 0; i < this.desiredPrey; i++) {
            this.organisms.push(this.createPrey())
        }
        this.num_predators = 0
        this.num_prey = 0

    }

    update() {
        //Update all organisms
        this.organisms.forEach(organism => {
            organism.update(this.organisms)
        })

        //Check for predator kills
        this.organisms.forEach(predator => {
            if (!predator.isPrey) {
                predator.nearby.forEach(prey => {
                    if (prey.isPrey) {
                        if (predator.distanceTo(prey.x, prey.y) < predator.size) {
                            prey.flagForRemoval = true
                            if (Math.random() < 0) {
                                this.organisms.push(this.createOffspring(predator, null))
                            }
                        }
                    }
                })
            }
        })

        //Check for prey asexual reproduction
        this.organisms.forEach(prey => {
            if (prey.isPrey) {
                if (Math.random() < 0.001 && this.num_prey < this.desiredPrey) {
                    this.organisms.push(this.createOffspring(prey, prey.angle))
                }
            }
        })

        //Check for predator death
        this.organisms.forEach(predator => {
            if (!predator.isPrey) {
                if (Math.random() < 0.0) {
                    predator.flagForRemoval = true
                }
            }
        })

        //Remove dead organisms
        for (let i = 0; i < this.organisms.length; i++) {
            if (this.organisms[i].flagForRemoval) {
                this.organisms.splice(i, 1)
                i--
            }
        }

        //Restrict organisms to bounds
        this.checkBoundaries()
    }

    //Returns all organisms in game
    getElements() {
        return this.organisms
    }

    //Game functions
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
        let predator = new Organism(Math.random() * this.width, Math.random() * this.height, "red", 5, this.width, this.height)
        predator.max_speed = 1.0
        predator.size = predator.size * 1.2
        predator.turn_speed = 0.025
        predator.line_length = 200
        predator.isPrey = false
        return predator
    }

    createPrey() {
        let prey = new Organism(Math.random() * this.width, Math.random() * this.height, "lime", 5, this.width, this.height)
        prey.max_speed = 1.1
        prey.turn_speed = 0.03
        prey.line_length = 100
        prey.isPrey = true

        return prey
    }

    createOffspring(parent, angle) {

        let organism = new Organism(parent.x, parent.y, parent.color, parent.size, this.width, this.height)
        organism.setFOV(parent.fov * (180 / Math.PI))
        organism.max_speed = parent.max_speed
        organism.turn_speed = parent.turn_speed
        organism.line_length = parent.line_length
        organism.isPrey = parent.isPrey
        if (angle !== null) {
            organism.angle = angle
        }
        return organism
    }
}


export {System}