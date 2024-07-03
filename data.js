// Function to fetch data
async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

function processData(data) {
    // Check if data is empty
    if (data.length === 0) return {};

    // Initialize an object to hold arrays for each key
    const processedData = {};

    // Use the keys from the first item to initialize arrays
    Object.keys(data[0]).forEach(key => {
        processedData[key] = [];
    });

    // Iterate over each item in the data
    data.forEach(item => {
        // For each key in the item, push the value into the corresponding array
        Object.keys(item).forEach(key => {
            processedData[key].push(item[key]);
        });
    });

    return processedData;
}