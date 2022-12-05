import {Game} from "./game.js";

//Load a new game
let maxWidth = document.getElementById("myCanvas").offsetWidth - 5
let maxHeight = document.getElementById("myCanvas").offsetHeight - 5

let game = new Game(maxWidth, maxHeight);

//Load charts

let preyChart = new Chart("preyChart", {
    type: "scatter",
    data: {
        datasets: [{
            pointBackgroundColor: "lime",
            data:  [{
                x: 0,
                y: 0
            }],
            borderColor: 'lime',
            borderWidth: 3,
            pointRadius: 0,
            pointHoverRadius: 5,
            fill: true  ,
            tension: 0,
            showLine: true
        }]
    },
    options: {
        title: {
            display: true,
            text: 'Prey',
        },
        scales:{
            xAxes: [{
                display: true, //this will remove all the x-axis grid lines
            }],
            yAxes: [{
                display: true //this will remove all the x-axis grid lines
            }]
        },
        legend:{
            display: false
        },
    }
})
let predChart = new Chart("predatorChart", {
    type: "scatter",
    data: {
        datasets: [{
            pointBackgroundColor: "red",
            data:  [{
                x: 0,
                y: 0
            }],
            borderColor: 'red',
            borderWidth: 3,
            pointRadius: 0,
            pointHoverRadius: 5,
            fill: true  ,
            tension: 0,
            showLine: true
        }]
    },
    options: {
        title: {
            display: true,
            text: 'Predators',
        },
        scales:{
            xAxes: [{
                display: true, //this will remove all the x-axis grid lines
            }],
            yAxes: [{
                display: true //this will remove all the x-axis grid lines
            }]
        },
        legend:{
            display: false
        },
    }
})

//Add controller

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

//Begin

window.requestAnimationFrame(step)

function step(timestamp) {
    game.update()

    if (game.running) {
        window.requestAnimationFrame(step);
    }
    if (game.count % 64 === 0) {
        if (predChart) {
            addData(predChart, {
                x: game.count,
                y: game.system.num_predators,
            })
            if (predChart.data.datasets[0].data.length > 30) {
                //removeData(chart)
            }
        }
        if (preyChart) {
            addData(preyChart, {
                x: game.count,
                y: game.system.num_prey,
            })
            if (preyChart.data.datasets[0].data.length > 30) {
                //removeData(chart)
            }
        }
    }
}

function addData(chart, data) {
    chart.data.datasets.forEach((dataset) => {
        dataset.data.unshift(data);
    });
    chart.update();
}

function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
}
