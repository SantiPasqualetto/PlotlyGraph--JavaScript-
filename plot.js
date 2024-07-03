// Function to define basic layout
function defineBasicLayout(title) {
    return {
        title: {
            text: title,
            font: {
                family: 'Arial, sans-serif',
                size: 24,
                color: 'white'
            }
        },
        paper_bgcolor: 'rgb(14, 16, 18)',
        plot_bgcolor: 'rgb(14, 16, 18)',
        font: {
            family: 'Arial, sans-serif',
            size: 12,
            color: 'white'
        }
    };
}

// Function to define basic xaxis
function defineBasicXaxis(title, range) {
    return {
        title: {
            text: title,
            font: {
                family: 'Arial, sans-serif',
                size: 18,
                color: 'white'
            }
        },
        zeroline: false,
        color: 'white',
		hoverformat: '.2f',
		range: range
    };
}

// Function to define basic yaxis
function defineBasicYaxis(title, range) {
    return {
        title: {
            text: title,
            font: {
                family: 'Arial, sans-serif',
                size: 18,
                color: 'white'
            }
        },
        zeroline: false,
        color: 'white',
		hoverformat: '.2f',
		range: range
    };
}

function defineBasicTracePath(data, name, color, subPlot) {
    return {
        x: data.x,
        y: data.y,
        type: 'scatter',
        name: name,
        line: {
            color: color
        },
        xaxis: 'x' + subPlot,
        yaxis: 'y' + subPlot
    };
}

function defineBasicTracePoint(data, name, color, subPlot) {
    return {
        x: [data.x[0]],
        y: [data.y[0]],
        type: 'scatter',
        mode: 'markers',
        marker: {
            size: 10,
            color: color
        },
        name: name,
        xaxis: 'x' + subPlot,
        yaxis: 'y' + subPlot,
        hoverinfo: 'none'
    };
}