function prepareVectors() {
    // Track the velocity and acceleration vector trace index
	var velocityVectorTraceIndex = null;
	var accelerationVectorTraceIndex = null;

	// Listen for hover events on the graph
	graph.on('plotly_hover', function(data) {
		try {
			var vectorVelocity = undefined;
			var vectorAcceleration = undefined;
			var hoverData = data.points[0];
			var x = hoverData.x;
			var y = hoverData.y;
			var time = parseInt(slider.value);

			// Check if hover is happening over the red marker or the blue marker
			if (hoverData.curveNumber === 2) {
				vectorVelocity = vectorData('Velocity<br>vector', x, y, processedData1.vx[time], processedData1.vy[time], 'white', 1);
				vectorAcceleration = vectorData('Acceleration<br>vector', x, y, processedData1.ax[time], processedData1.ay[time], 'purple', 1);
			} else if (hoverData.curveNumber === 3) {
				vectorVelocity = vectorData('Velocity<br>vector', x, y, processedData2.vx[time], processedData2.vy[time], 'white', 2);
				vectorAcceleration = vectorData('Acceleration<br>vector', x, y, processedData2.ax[time], processedData2.ay[time], 'purple', 2);
			}
			
			// Add the vectors traces to the graph
			if (vectorVelocity !== undefined && vectorAcceleration !== undefined && checkBox.checked !== true) {
				if (velocityVectorTraceIndex === null && accelerationVectorTraceIndex === null) {
					Plotly.addTraces(graph, [vectorVelocity, vectorAcceleration]).then(function() {
						velocityVectorTraceIndex = graph.data.length - 1;
						accelerationVectorTraceIndex = graph.data.length - 2;
					});
				} else {
					Plotly.restyle(graph, {
						x: [vectorVelocity.x],
						y: [vectorVelocity.y]
					}, velocityVectorTraceIndex);
					Plotly.restyle(graph, {
						x: [vectorAcceleration.x],
						y: [vectorAcceleration.y]
					}, accelerationVectorTraceIndex);
				}
			}
		} catch (error) {
			console.error("Error during plotly_hover: ", error);
		}
	});

	// Listen for unhover events to remove the trace with a specific name
	graph.on('plotly_unhover', function() {
		try {
            if (velocityVectorTraceIndex !== null && accelerationVectorTraceIndex !== null) {
                Plotly.deleteTraces(graph, [velocityVectorTraceIndex, accelerationVectorTraceIndex]);
                velocityVectorTraceIndex = null;
				accelerationVectorTraceIndex = null;
            }
        } catch (error) {
            console.error("Error during plotly_unhover: ", error);
        }
	});
}

// Function to calculate vectors
function vectorData(name, x1, y1, x2, y2, color, subPlot) {
    versorV = versor(x2, y2);
    return {
		x: [x1, x1 + versorV[0]],
		y: [y1, y1 + versorV[1]],
		type: 'scatter',
		mode: 'lines+markers',
		line: {
			color: color,
			width: 3
		},
		marker: {
			color: color,
			symbol: 'arrow',
			size: 10,
			angleref: 'previous'
		},
		hoverinfo: 'skip',
		name: name,
		xaxis: 'x' + subPlot,
		yaxis: 'y' + subPlot
	};
}

function framesForVector(data1, data2) {
    frames = [];
    for (var i = 0; i < data2.x.length; i++) {
        x1 = data1.x[i];
        y1 = data1.y[i];
        x2 = data2.x[i];
        y2 = data2.y[i];
        versor1 = versor(data1.vx[i], data1.vy[i]);
        versor2 = versor(data1.ax[i], data1.ay[i]);
        versor3 = versor(data2.vx[i], data2.vy[i]);
        versor4 = versor(data2.ax[i], data2.ay[i]);
        frames.push({
            name: 'frame' + i,
            data: [
                {x: [x1], y: [y1]},
                {x: [x2], y: [y2]},
                {x: [x1, x1 + versor1[0]], y: [y1, y1 + versor1[1]]},
                {x: [x1, x1 + versor2[0]], y: [y1, y1 + versor2[1]]},
                {x: [x2, x2 + versor3[0]], y: [y2, y2 + versor3[1]]},
                {x: [x2, x2 + versor4[0]], y: [y2, y2 + versor4[1]]}
            ],
            traces: [2,3,4,5,6,7]
        });
    }
    return frames;
}

// Vectors all time
function vectors() {
    var time = parseInt(slider.value);
    var velocityVector = vectorData('Velocity<br>vector car 1', processedData1.x[time], processedData1.y[time], processedData1.vx[time], processedData1.vy[0], 'white', 1);
    var accelerationVector = vectorData('Acceleration<br>vector car 1', processedData1.x[time], processedData1.y[time], processedData1.ax[time], processedData1.ay[time], 'purple', 1);
    var velocityVector2 = vectorData('Velocity<br>vector car 2', processedData2.x[time], processedData2.y[time], processedData2.vx[time], processedData2.vy[time], 'white', 2);
    var accelerationVector2 = vectorData('Acceleration<br>vector car 2', processedData2.x[time], processedData2.y[time], processedData2.ax[time], processedData2.ay[time], 'purple', 2);
    Plotly.addTraces(graph, [velocityVector, accelerationVector, velocityVector2, accelerationVector2]);

    Plotly.addFrames(graph, framesForVector(processedData1, processedData2));
}

function versor(x, y) {
    let magnitude = Math.sqrt(x * x + y * y);
    arrowLength = 4;
    return [(x / magnitude) * arrowLength, (y / magnitude) * arrowLength];
}