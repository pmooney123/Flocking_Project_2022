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
        this.turn_speed = 0.025
        this.max_speed = 1


        //vision
        this.setFOV(180)
        this.line_length = 120

        //movement AI
        this.force_vectors = []


    }

    update(elements) {
        this.color = "lime"
        this.cleanAngle()
        this.resetForceVectors()
        this.sumForceVectors(elements)

    }

    turn(value) {
        this.angle += value * this.turn_speed

        this.cleanAngle()
    }

    move(value) {
        this.x += Math.cos(this.angle) * value * this.max_speed
        this.y += Math.sin(this.angle) * value * this.max_speed
    }

    accelerate(amount) {
        this.max_speed += amount
        if (this.max_speed > this.max_speed) {
            this.max_speed = this.max_speed
        }
        if (this.max_speed < 0) {
            this.max_speed = 0
        }
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

    moveTowardsDesiredSpeed(desired_speed) {
        if (this.max_speed < desired_speed) {
            //this.accelerate(0.01)
        }
        if (this.max_speed > desired_speed) {
            //this.accelerate(-0.01)
        }
    }

    sumForceVectors(elements) {
        let desired_speed = this.max_speed
        this.allies = []
        //Add seen allies to array
        for (let i = 0; i < elements.length; i++) {
            let element = elements[i]
            if (element.id !== this.id) {
                if (this.distanceTo(element.x, element.y) < this.line_length) {
                    if (this.see(element).canSee) {
                        this.allies.push(element)
                    }
                }
            }
        }

        this.nearby = []
        for (let i = 0; i < elements.length; i++) {
            let element = elements[i]
            if (element.id !== this.id) {
                if (this.distanceTo(element.x, element.y) < this.size * 5) {
                    this.nearby.push(element)
                }
            }
        }

        //Speed up if alone
        if (this.allies.length === 0) {
            desired_speed = this.max_speed
        }

        //Towards allies
        if (this.allies.length > 0) {
            let tx = 0, ty = 0
            this.allies.forEach(ally => {
                tx += ally.x
                ty += ally.y
            })
            let ax = tx / (this.allies.length)
            let ay = ty / (this.allies.length)

            this.force_vectors.push(new Vector(Math.atan2((this.y - ay), (this.x - ax)), -0.5))
        }

        //Away from Nearby
        this.nearby.forEach(ally => {
            let ab = Math.atan2(ally.y - this.y, ally.x - this.x)
            let distance = this.distanceTo(ally.x, ally.y)
            let magnitude = -5 / distance
            this.force_vectors.push(new Vector(ab, magnitude))
        })

        //boundary north
        let distance = 0, magnitude = 0;
        distance = this.distanceTo(this.x, 0)
        magnitude = -5 / distance
        if (magnitude < -5) {
            magnitude = -5
        }
        this.force_vectors.push(new Vector(270 * (Math.PI / 180), magnitude))
        //boundary south
        distance = this.distanceTo(this.x, this.mapHeight)
        magnitude = -5 / distance
        if (magnitude < -5) {
            magnitude = -5
        }
        this.force_vectors.push(new Vector(90 * (Math.PI / 180), magnitude))

        //boundary west
        distance = this.distanceTo(0, this.y)
        magnitude = -5 / distance
        if (magnitude < -5) {
            magnitude = -5
        }
        this.force_vectors.push(new Vector(180 * (Math.PI / 180), magnitude))
        //boundary east
        distance = this.distanceTo(this.mapWidth, this.y)
        magnitude = -5 / distance
        if (magnitude < -5) {
            magnitude = -5
        }
        this.force_vectors.push(new Vector(0 * (Math.PI / 180), magnitude))


        // force vector for avoiding obstacles
        //turn randomly
        //turn to match nearby allies

        //Sum vectors and adjust angle and speed
        let vx = 0, vy = 0;
        this.force_vectors.forEach(vector => {
            vx += vector.magnitude * Math.cos(vector.angle)
            vy += vector.magnitude * Math.sin(vector.angle)
        })
        let resultant_angle = Math.atan2(vy, vx)
        this.adjustAngleTowards(resultant_angle)
        this.moveTowardsDesiredSpeed(desired_speed)
        this.move(1)

    }

    distanceTo(x1, y1) {
        return Math.sqrt((y1 - this.y) * (y1 - this.y) + (x1 - this.x) * (x1 - this.x))
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
                this.color = "lime"
                details.canSee = true

                details.isLeft = diff < 0 && diff < -1 * this.fov/4
                details.isRight = diff >= 0 && diff > 1 * this.fov/4

            }

        }
        //this.text = Math.round(method1 * 180/Math.PI) + " " + Math.round(diff * 180/Math.PI) + " " + Math.round(method2 * 180/Math.PI)
        this.text = Math.round(100 * diff) / 100
        return details
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

    resetForceVectors() {
        this.force_vectors = []
    }
}

export {Organism}