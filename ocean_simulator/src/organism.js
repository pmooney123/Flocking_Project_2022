import {Vector} from "./vector.js";

class Organism {
    constructor(x, y, color, size, mapWidth, mapHeight) {
        this.flagForRemoval = false
        this.x = x
        this.y = y
        this.color = color
        this.size = size
        this.text = ""
        this.id = Math.round(Math.random() * 10000000) / 10000000

        this.mapWidth = mapWidth
        this.mapHeight = mapHeight

        this.isPrey = true

        //movement
        this.angle = Math.random() * 2 * Math.PI
        this.turn_speed = 0.10
        this.max_speed = 1

        this.full = 0
        this.hungerCD = 64

        this.prey_cohesion = 1
        this.prey_fright = 250

        this.boundary_force = 10
        this.collision_fright = 50

        this.predator_killdrive = 10


        //vision
        this.setFOV(180)
        this.line_length = 120

        //movement AI
        this.force_vectors = []
        this.seen = []
        this.nearby = []
        this.randomDrift = 0

        this.vector = new Vector(0, 10)
    }

    update(elements) {
        this.nearby = []
        this.seen = []
        this.force_vectors = []

        this.cleanAngle()
        this.resetForceVectors()

        if (this.full > 0 ){
            this.full--
        }
        if (this.isHungry) {
            this.sumForceVectors(elements)
        }
    }
    isHungry() {
        if (this.full <= 0) {
            return true
        }
    }

    sumForceVectors(elements) {

        this.seeNearby(elements)
        this.moveAwayNearby(elements)
        this.seeOrganisms(elements)
        this.coherence()
        if (this.isPrey) {

            this.moveTowardsAllies()

            this.avoidPredators()
        }

        if (!this.isPrey) {
            this.moveTowardsPrey()
        }
        this.avoidBoundaries()

        //Sum vectors and adjust angle and speed
        let vx = 0, vy = 0;

        //Clean tiny vectors

        this.force_vectors.forEach(vector => {
            vx += vector.magnitude * Math.cos(vector.angle)
            vy += vector.magnitude * Math.sin(vector.angle)
        })
        let resultant_angle = Math.atan2(vy, vx)
        this.vector = new Vector(resultant_angle, 20)
        this.adjustAngleTowards(resultant_angle)
        this.move(1)

    }
    resetForceVectors() {
        this.force_vectors = []
    }

    turn(value) {
        this.angle += value * this.turn_speed
        this.cleanAngle()
    }
    move(value) {
        this.x += Math.cos(this.angle) * value * this.max_speed
        this.y += Math.sin(this.angle) * value * this.max_speed
    }
    adjustAngleTowards(desired_angle) {

        let diff = desired_angle - this.angle
        while (diff < -1 * Math.PI) {
            diff += 2 * Math.PI
        }
        //console.log("desired: " + desired_angle + " angle: " + this.angle)
        //console.log("diff: " + diff)

        if (diff > 0) {
            this.turn(1)
        } else if (diff < 0) {
            this.turn(-1)
        }
    }

    see(element) {
        let details = {
            canSee: false,
            canSeePredator: false,
            canSeePrey: false,
            distanceValue: null,
            isLeft: false,
            isRight: false,
            color: null,
        }

        //difference between angle between object, and direction of sight
        let diff = Math.atan2(element.y - this.y, element.x - this.x) - (this.angle)

        //mod to -180,180
        while (diff < -1 * Math.PI) {
            diff += 2 * Math.PI
        }

        if (diff < this.fov/2 && diff > -1 * this.fov/2) {
            //object within FOV
            let distance = Math.sqrt(Math.pow((element.y - this.y), 2) + Math.pow((element.x - this.x), 2))
            if ( distance < this.line_length ) {
                if (element.isPrey && !this.isPrey) {
                    details.canSeePrey = true
                }
                if (!element.isPrey && this.isPrey) {
                    details.canSeePredator = true
                }
                details.canSee = true

                details.isLeft = diff < 0 && diff < -1 * this.fov/2
                details.isRight = diff >= 0 && diff > 1 * this.fov/2

            }

        }
        //this.text = Math.round(method1 * 180/Math.PI) + " " + Math.round(diff * 180/Math.PI) + " " + Math.round(method2 * 180/Math.PI)
        this.text = Math.round(100 * diff) / 100
        return details
    }

    seeOrganisms(elements) {
        for (let i = 0; i < elements.length; i++) {
            let element = elements[i]
            if (element.id !== this.id) {
                if (this.distanceTo(element.x, element.y) < this.line_length) {
                    if (this.see(element).canSee) {
                        this.seen.push(element)
                    }
                }
            }
        }

    }
    seeNearby(elements) {
        for (let i = 0; i < elements.length; i++) {
            let element = elements[i]
            if (element.id !== this.id) {
                if (this.distanceTo(element.x, element.y) < this.size * 5) {
                    this.nearby.push(element)
                }
            }
        }
    }

    coherence() {
        if (this.seen.length > 0) {

            this.seen.forEach(ally => {
                if (ally.isPrey === this.isPrey) {
                    this.force_vectors.push(new Vector(ally.angle, 0.1))
                }
            })
        }

    }
    moveTowardsAllies() {
        if (this.seen.length > 0) {
            let tx = 0, ty = 0
            let number_allies = 0
            this.seen.forEach(ally => {
                if (ally.isPrey === this.isPrey) {
                    number_allies ++
                    tx += ally.x
                    ty += ally.y
                }
            })
            let ax = tx / (number_allies)
            let ay = ty / (number_allies)

            this.force_vectors.push(new Vector(Math.atan2((ay - this.y), (ax - this.x)), this.prey_cohesion))
        }
        /*
        this.seen.forEach(organism => {
            if (organism.isPrey) {
                let ab = Math.atan2(organism.y - this.y, organism.x - this.x)
                let distance = this.distanceTo(organism.x, organism.y)
                let magnitude = this.prey_cohesion / Math.pow(distance, 2)
                this.force_vectors.push(new Vector(ab, -magnitude))
            }
        })

         */
    }
    moveTowardsPrey() {
        this.seen.forEach(organism => {
            if (organism.isPrey) {
                let ab = Math.atan2(organism.y - this.y, organism.x - this.x)
                let distance = this.distanceTo(organism.x, organism.y)
                let magnitude = this.predator_killdrive / Math.pow(distance, 1)
                this.force_vectors.push(new Vector(ab, magnitude))
            }
        })
    }
    moveAwayNearby() {
        this.nearby.forEach(nearby => {
            if (nearby.isPrey === this.isPrey) {
                let ab = Math.atan2(nearby.y - this.y, nearby.x - this.x)
                let distance = this.distanceTo(nearby.x, nearby.y)
                let magnitude = this.collision_fright / distance
                this.force_vectors.push(new Vector(ab, -magnitude))
            }
        })
    }
    avoidBoundaries() {
        //boundary north
        let boundary_force = this.boundary_force
        let distance = 0, magnitude = 0;

            distance = this.distanceTo(this.x, 0)
            magnitude = boundary_force / distance
            if (magnitude > boundary_force) {
                magnitude = boundary_force
            }
            this.force_vectors.push(new Vector(270 * (Math.PI / 180), -magnitude))

            //boundary south
            distance = this.distanceTo(this.x, this.mapHeight)
            magnitude = boundary_force / distance
            if (magnitude > boundary_force) {
                magnitude = boundary_force
            }
            this.force_vectors.push(new Vector(90 * (Math.PI / 180), -magnitude))

            //boundary west
            distance = this.distanceTo(0, this.y)
            magnitude = boundary_force / distance
            if (magnitude > boundary_force) {
                magnitude = boundary_force
            }
            this.force_vectors.push(new Vector(180 * (Math.PI / 180), -magnitude))

            //boundary east
            distance = this.distanceTo(this.mapWidth, this.y)
            magnitude = boundary_force / distance
            if (magnitude > boundary_force) {
                magnitude = boundary_force
            }
            this.force_vectors.push(new Vector(0, -magnitude))

    }
    avoidPredators() {
        /*
        if (this.seen.length > 0) {
            let tx = 0, ty = 0
            let number_predators = 0
            this.seen.forEach(predator => {
                if (!predator.isPrey) {
                    number_predators++
                    tx += predator.x
                    ty += predator.y
                }
            })
            if (number_predators > 0) {
                let ax = tx / (number_predators)
                let ay = ty / (number_predators)
                let vector = new Vector(Math.atan2((ay - this.y), (ax - this.x)), boundary_force)
                this.force_vectors.push(vector)
            }
        }

         */
        this.seen.forEach(organism => {
            if (!organism.isPrey) {
                let ab = Math.atan2(organism.y - this.y, organism.x - this.x)
                let distance = this.distanceTo(organism.x, organism.y)
                let magnitude = this.prey_fright / distance
                this.force_vectors.push(new Vector(ab, -magnitude))
            }
        })
    }

    distanceTo(x1, y1) {
        return Math.sqrt((y1 - this.y) * (y1 - this.y) + (x1 - this.x) * (x1 - this.x))
    }

    cleanAngle() {
        while (this.angle >= 2 * Math.PI) {
            this.angle -= 2 * Math.PI
        }
        while (this.angle < 0) {
            this.angle += 2 * Math.PI
        }
    } //set angle to between 0 and 2pi

    setFOV(degree) {
        this.fov = degree * (Math.PI / 180)
    }
}

export {Organism}