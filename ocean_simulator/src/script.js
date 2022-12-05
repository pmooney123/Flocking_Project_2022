import {Game} from "./game.js";

//Load a new game
let maxWidth = document.getElementById("myCanvas").offsetWidth
let maxHeight = document.getElementById("myCanvas").offsetHeight
let game = new Game(maxWidth, maxHeight);

document.addEventListener('keydown', function(event){
    console.log(event.key + " was pressed.")
    switch (event.key) {
        case ("d"):
            game.right_held = true
            break;
        case ("a"):
            game.left_held = true
            break;
        case ("w"):
            game.forward_held = true
            break;
        case ("F1"):
            event.preventDefault()
            game.display.drawLines = !game.display.drawLines
            break;
        case ("F2"):
            event.preventDefault()
            game.display.drawForces = !game.display.drawForces
            break;
    }
} );
document.addEventListener('keyup', function(event){
    //console.log(event.key + " was pressed.")
    switch (event.key) {
        case ("d"):
            game.right_held = false
            break;
        case ("a"):
            game.left_held = false
            break;
        case ("w"):
            game.forward_held = false
            break;
    }
} );

let preyPopulation = [
    {x:50, y:7},
    {x:60, y:8},
    {x:70, y:8},
    {x:80, y:9},
    {x:90, y:9},
];

new Chart("myChart", {
    type: "scatter",
    data: {
        datasets: [{
            pointBackgroundColor: "lime",
            data: preyPopulation,
            borderColor: 'lime',
            borderWidth: 3,
            pointBorderColor: ['#000', '#00bcd6', '#d300d6'],
            pointRadius: 0,
            pointHoverRadius: 5,
            fill: false,
            tension: 0,
            showLine: true
        }]
    },
    options: {
        title: {
            display: true,
            text: 'Population',
        },
        scales:{
            xAxes: [{
                display: false //this will remove all the x-axis grid lines
            }]
        },
        legend:{
            display: false
        },
    }
});

//Begin simulation
window.requestAnimationFrame(step)

function step(timestamp) {
    game.update()

    if (game.running) {
        window.requestAnimationFrame(step);
    }
}

