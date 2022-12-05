class Input {

}
class Output {

}
class Middle {

}
class Neuron {
    constructor(input, output) {
        this.input = input
        this.value = 0
        this.output = output

    }
    input() {
        this.value = this.input.value
    }
    output() {
        return this.value
    }
}



class Brain {

}

export {Brain}