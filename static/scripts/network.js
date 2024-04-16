function sendObstaclesToServer(obstacles) {
    const xhr = new XMLHttpRequest();

    xhr.open("POST", "/update_obstacles/", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = function () {
        if (xhr.status === 200) {
            // console.log("Obstacles sent successfully.", obstacles);
            return;
        }
    };

    xhr.onerror = function () {
        console.error("Error sending obstacles.");
    };

    xhr.send(JSON.stringify(obstacles));
}

async function startWayFinding() {
    const startX = parseInt(startXInput.value);
    const startY = parseInt(startYInput.value);
    const goalX = parseInt(goalXInput.value);
    const goalY = parseInt(goalYInput.value);

    try {
        const response = await fetch('/start-way-finding/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'startX': startX, 'startY': startY, 'goalX': goalX, 'goalY': goalY})
        });
        
        if (!response.ok) {
            throw new Error('Error starting way finding');
        }

        console.log('Way finding started successfully');

    } catch (error) {
        console.error(error);
    }
}