// Declare all variables to hold the references to the elements
var processedData1, processedData2, graph, slider, timeOutput, checkBox, p1, p2, v1, v2, a1, a2, pr, vr, ar;
// Declare a variable to hold the state of the animation
var isAnimating = false;
// Declare a variable for buttons
var btnPlay, btnPause;

document.addEventListener('DOMContentLoaded', function() {
    // Get a reference to the div where graph will be rendered
    graph = document.getElementById('tester');

    // Get a reference to the buttons
    btnPlay = document.getElementById('btnPlay');
    btnPause = document.getElementById('btnPause');
    
    // Get a reference to the slider
    slider = document.getElementById('slider');

    // Get a reference to output element
    timeOutput = document.getElementById('time');

    // Table references
    p1 = document.getElementById('p1');
    p2 = document.getElementById('p2');
    v1 = document.getElementById('v1');
    v2 = document.getElementById('v2');
    a1 = document.getElementById('a1');
    a2 = document.getElementById('a2');
    pr = document.getElementById('pr');
    vr = document.getElementById('vr');
    ar = document.getElementById('ar');

    // Fetch data and render the plot
    Promise.all([fetchData('dfcar1.json'), fetchData('dfcar2.json')])
        .then(([data1, data2]) => {
            processedData1 = processData(data1);
            processedData2 =  processData(data2);
            prepareSlider();
            plotData();
        })
        .catch(error => {
            console.error('Error fetching the JSON data:', error);
        });

    // Add event listener to the slider
    slider.addEventListener('input', function() {
        // Pause the animation if it is running
        if (isAnimating) {
            resume();
        }
    
        // Update the time output
        timeOutput.textContent = processedData2.T[this.value].toFixed(2);
        
        // Update the position of the cars
        cars = 'frame' + this.value;
        Plotly.animate(graph, [cars, cars], frameConfig(false))
            .then(() => {
                // Animation update logic here (if needed)
            })
            .catch(() => {
                // Error handling here (if needed)
            });
    
        // Update the table
        updateTableContent();
    });

    checkBox = document.getElementById("checkVectors");
    checkBox.addEventListener('change', function() {
        if (isAnimating) {
            resume();
        }
        if (this.checked) {
            vectors();
        } else {
            Plotly.deleteTraces(graph, [-4,-3,-2,-1]);
        }
    });
});

// Function to plot
function plotData() {
    // Define your data
    var graph1 = defineBasicTracePath(processedData1, 'Path of car 1', 'orange', 1);
    var graph2 = defineBasicTracePath(processedData2, 'Path of car 2', 'blue', 2);
	
	range1x = [Math.min(...processedData1.x) - std(processedData1.x) / 2, Math.max(...processedData1.x) + std(processedData1.x) / 2];
	range1y = [Math.min(...processedData1.y) - std(processedData1.y) / 2, Math.max(...processedData1.y) + std(processedData1.y) / 2];
	range2x = [Math.min(...processedData2.x) - std(processedData2.x) / 2, Math.max(...processedData2.x) + std(processedData2.x) / 2];
	range2y = [Math.min(...processedData2.y) - std(processedData2.y) / 2, Math.max(...processedData2.y) + std(processedData2.y) / 2];

    // Define your layout
    var layout = {
        grid: {rows: 1, columns: 2, pattern: 'independent'},
        ...defineBasicLayout('Path of the cars'),
        xaxis: defineBasicXaxis('X (m)', range1x),
        yaxis: defineBasicYaxis('Y (m)', range1y),
        xaxis2: defineBasicXaxis('X (m)', range2x),
        yaxis2: defineBasicYaxis('Y (m)', range2y)
    };

    // Render the plot
    Plotly.newPlot(graph, [graph1, graph2], layout, {responsive: true});
    
    // Plotting markers for the cars 
    var car1 = defineBasicTracePoint(processedData1, 'Car 1', 'red', 1);
    var car2 = defineBasicTracePoint(processedData2, 'Car 2', 'green', 2);

    Plotly.addTraces(graph, [car1,car2]);

    // Define the frames for animation
    frames = [];
    for (var i = 0; i < processedData2.x.length; i++) {
        frames.push({
            name: 'frame' + i,
            data: [
                {x: [processedData1.x[i]], y: [processedData1.y[i]]},
                {x: [processedData2.x[i]], y: [processedData2.y[i]]}
            ],
            traces: [2,3]
        });
    }

    // Add the frames to the graph
    Plotly.addFrames(graph, frames);

    // Add event listener to the graph to animate the slider
    graph.on('plotly_animatingframe' , function() {
        animateSlider();
    });

    // Prepare the vectors
    prepareVectors();
}

function std(arr) {
    // Creating the mean with Array.reduce
    let mean = arr.reduce((acc, curr) => {
        return acc + curr
    }, 0) / arr.length;

    // Assigning (value - mean) ^ 2 to every array item
    arr = arr.map((k) => {
        return (k - mean) ** 2
    });

    // Calculating the sum of updated array 
    let sum = arr.reduce((acc, curr) => acc + curr, 0);

    // Calculating the variance
    let variance = sum / arr.length

    // Returning the standard deviation
    return Math.sqrt(variance)
}

function resume() {
    btnPause.click();
    setTimeout(() => {
        btnPlay.click();
    }, 500);
}