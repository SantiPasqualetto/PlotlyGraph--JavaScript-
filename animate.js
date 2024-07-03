// Declare a variable to hold the time frame for the animation
var timeFrame = 1/42 * 1000;

var length;

function frameConfig(current) {
    if (current === false) {
        return {
            transition: {
                duration: timeFrame,
                easing: 'linear'
            },
            frame: {
                duration: timeFrame,
                redraw: false
            },
            mode: 'immediate',
        };
    } else {
        return {
            transition: {
                duration: timeFrame,
                easing: 'linear'
            },
            frame: {
                duration: timeFrame,
                redraw: false
            },
            mode: 'immediate',
            fromcurrent: true
        };
    }
}

function play() {
    if (!isAnimating) {
        Plotly.animate(graph, null, frameConfig(true));
        isAnimating = true;
    }
}

function pause() {
    if (isAnimating) {
        Plotly.animate(graph, [], {mode: 'immediate'});
        isAnimating = false;
    }
}

function prepareSlider() {
    length = processedData2.T.length;
    // Define the attributes of the slider
    min = 0;
    max = length - 1;
    step = 1;
    value = 0;

    // Get a reference to the datalist
    tickMarks = document.getElementById('tickmarks');

    // Define the number of values to display
    var numValues = 10;
    var interval = Math.floor((length - 1) / (numValues - 1));

    // Add option elements to the datalist
    for (var i = 0; i < length; i += interval) {
        var option = document.createElement('option');
        if (i == 0) {
            option.label = 0;
            option.value = 0;
        } else if (tickMarks.childElementCount == numValues - 1) {
            option.label = processedData2.T[length -1].toFixed(2);
            option.value = length - 1;
        } else {
            option.label = processedData2.T[i].toFixed(2);
            option.value = i;
        }
        tickMarks.appendChild(option);
    }

    // Set the attributes of the slider
    slider.setAttribute('min', min);
    slider.setAttribute('max', max);
    slider.setAttribute('step', step);
    slider.setAttribute('value', value);
    slider.setAttribute('list', tickMarks.id);
}

// Function to animate the slider
function animateSlider() {
    if (!isAnimating) {
        return;
    }
    
    value = slider.value;

    value++;

    slider.value = value;

    // Update the time output
    timeOutput.textContent = processedData2.T[value].toFixed(2);

    // Update table content
    updateTableContent();
}

// Function to update table content
function updateTableContent() {
    p1.textContent = '(' + processedData1.x[slider.value].toFixed(2) + ', ' + processedData1.y[slider.value].toFixed(2) + ') m';
    p2.textContent = '(' + processedData2.x[slider.value].toFixed(2) + ', ' + processedData2.y[slider.value].toFixed(2) + ') m';

    v1.textContent = Math.sqrt(processedData1.vx[slider.value]**2 + processedData1.vy[slider.value]**2).toFixed(2) + ' m/s';
    v2.textContent = Math.sqrt(processedData2.vx[slider.value]**2 + processedData2.vy[slider.value]**2).toFixed(2) + ' m/s';

    a1.textContent = Math.sqrt(processedData1.ax[slider.value]**2 + processedData1.ay[slider.value]**2).toFixed(2) + ' m/s²';
    a2.textContent = Math.sqrt(processedData2.ax[slider.value]**2 + processedData2.ay[slider.value]**2).toFixed(2) + ' m/s²';

    // Get current positions of both cars
    const currentX1 = processedData1.x[slider.value];
    const currentY1 = processedData1.y[slider.value];
    const currentX2 = processedData2.x[slider.value];
    const currentY2 = processedData2.y[slider.value];

    // Calculate the difference in their x and y coordinates
    const dx = currentX2 - currentX1;
    const dy = currentY2 - currentY1;

    // Use the Pythagorean theorem to find the distance between these points
    const relativePosition = Math.sqrt(dx**2 + dy**2).toFixed(2) + ' m';

    // Display this distance as the relative position
    pr.textContent = relativePosition;

    // Correct calculation of relative velocity
    const relativeVx = processedData2.vx[slider.value] - processedData1.vx[slider.value];
    const relativeVy = processedData2.vy[slider.value] - processedData1.vy[slider.value];
    const relativeVelocity = Math.sqrt(relativeVx**2 + relativeVy**2).toFixed(2) + ' m/s';

    vr.textContent = relativeVelocity;

    // Calculate relative acceleration components
    const relativeAx = processedData2.ax[slider.value] - processedData1.ax[slider.value];
    const relativeAy = processedData2.ay[slider.value] - processedData1.ay[slider.value];
    // Compute the magnitude of the relative acceleration vector
    const relativeAcceleration = Math.sqrt(relativeAx**2 + relativeAy**2).toFixed(2) + ' m/s²';

    // Update the text content for relative accelerations
    ar.textContent = relativeAcceleration;
}