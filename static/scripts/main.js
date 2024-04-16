let startXInput = document.getElementById("startX");
let startYInput = document.getElementById("startY");
let goalXInput = document.getElementById("goalX");
let goalYInput = document.getElementById("goalY");
let numRectanglesInput = document.getElementById("numRectangles");
let minSizeInput = document.getElementById("minSize");
let maxSizeInput = document.getElementById("maxSize");

function logInputs() {
    if (
        startXInput.value.trim() === "" ||
        startYInput.value.trim() === "" ||
        goalXInput.value.trim() === "" ||
        goalYInput.value.trim() === "" ||
        numRectanglesInput.value.trim() === "" ||
        minSizeInput.value.trim() === "" ||
        maxSizeInput.value.trim() === ""
    ) {
        alert("Please fill in all input fields");
        return;
    }

    const startX = Math.max(0, parseInt(startXInput.value));
    const startY = Math.max(0, parseInt(startYInput.value));
    const goalX = Math.max(0, parseInt(goalXInput.value));
    const goalY = Math.max(0, parseInt(goalYInput.value));
    const numRectangles = Math.max(0, parseInt(numRectanglesInput.value));
    const minSize = Math.max(0, parseInt(minSizeInput.value));
    const maxSize = Math.max(0, parseInt(maxSizeInput.value));

    handleInputs(startX, startY, goalX, goalY, numRectangles, minSize, maxSize);

    const obstaclesData = [{
        startX: startX,
        startY: startY,
        goalX: goalX,
        goalY: goalY,
        numRectangles: numRectangles,
        minSize: minSize,
        maxSize: maxSize
    }];

    fetch('/update_obstacles/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obstaclesData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    // .then(data => {
    //     console.log('Server response:', data);
    // })    
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function resetInputs() {
    d3.select("#map svg").remove();

    const inputs = document.querySelectorAll('.properties input[type="number"]');
    inputs.forEach(input => {
        try {
            const placeholderValue = parseFloat(input.getAttribute('placeholder'));
            input.value = isNaN(placeholderValue) ? '' : placeholderValue;
        } catch (error) {
            console.error('Error setting input value:', error);
        }
    });
}

function exampleInputs() {
    startXInput.value = getRandomInt(0, 500);
    startYInput.value = getRandomInt(0, 500);
    goalXInput.value = getRandomInt(0, 500);
    goalYInput.value = getRandomInt(0, 500);
    numRectanglesInput.value = getRandomInt(5, 40);
    minSizeInput.value = getRandomInt(10, 30);
    maxSizeInput.value = getRandomInt(50, 80);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function handleInputs(startX, startY, goalX, goalY, numRectangles, minSize, maxSize) {
    let starting_point = [startX, startY];
    let goal_point = [goalX, goalY];
    let num_rectangles = Number(numRectangles);
    let min_size = Number(minSize);
    let max_size = Number(maxSize);
    const x_range = [0, 500];
    const y_range = [0, 500];

    OBSTACLES = generate_non_overlapping_rectangles(num_rectangles, min_size, max_size, x_range, y_range);

    d3.select("#map svg").remove();

    plot_rectangles(starting_point, goal_point, OBSTACLES);
    
    sendObstaclesToServer(OBSTACLES);
}

const socket = new WebSocket('ws://localhost:8000/ws');

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    console.log('Received data from server:', data);
    if (data.startX && data.startY) {
        addPointToMap(data.startX, data.startY);
    }
};

function addPointToMap(x, y) {
    const svg = d3.select("#map svg");
    svg.append("circle")
        .attr("cx", x)
        .attr("cy", 500 - y)
        .attr("r", 5)
        .style("fill", "yellow");
}

function plot_rectangles(starting_point, goal_point, obstacles) { 
    const svg = d3.select("#map")
        .append("svg")
        .attr("width", 500)
        .attr("height", 500);
    
    svg.selectAll("rect")
        .data(obstacles) 
        .enter()
        .append("rect")
        .attr("x", d => d.left_bottom_corner[0])
        .attr("y", d => 500 - d.left_bottom_corner[1] - d.height)
        .attr("width", d => d.width)
        .attr("height", d => d.height)
        .attr("fill", "blue");

    svg.append("circle")
        .attr("cx", starting_point[0])
        .attr("cy", 500 - starting_point[1])
        .attr("r", 7)
        .style("fill", "red");

    svg.append("circle")
        .attr("cx", goal_point[0])
        .attr("cy", 500 - goal_point[1])
        .attr("r", 7)
        .style("fill", "green");
}
