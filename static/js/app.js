// sample data file path
var dataFile = "static/json/samples.json"

// call Initialize code.
Init();


// Init() start ---------------------------------------------------------------------------
//Initialize code
function Init() {

    //Populate Dropdown from data from samples json
    var selector = d3.select("#selDataset");

    // fetch the json data from json file
    d3.json(dataFile).then(function (data) {

        var sampleNames = data.names;

        //Create dropdown for each of the same IDs
        sampleNames.forEach(sampleId => {
            selector.append("option")
                .text(sampleId)
                .property("value", sampleId)
        }); //end of forEach

    }); //end of d3.json

    // invoke the Demographic Metadata, barchart and bubble chart
    var subjectID = 940
    //Populate Demographic
    PopDemographicMetadata(subjectID);

    //Draw barchart
    DrawBarChart(subjectID);

    //Draw Bubble chart
    DrawBubbleChart(subjectID)

    //Draw gauge chart
    DrawGaugeChart(subjectID)
}
// End of Init() .................................................................................


// optionChanged() start ---------------------------------------------------------------------------
// function to handle the change in Subject ID 
function optionChanged(newSubjectID) {

    //Populate Demographic for selected Subject ID
    PopDemographicMetadata(newSubjectID);

    //Draw barchart for selected Subject ID
    DrawBarChart(newSubjectID);

    //Draw Bubble chart for selected Subject ID
    DrawBubbleChart(newSubjectID)

    // draw gauge chart
    DrawGaugeChart(newSubjectID)
}
// End of optionChanged() .................................................................................


// DrawBarChart() start ---------------------------------------------------------------------------
//Function to Draw the Bar chart
function DrawBarChart(subjectID) {
    console.log("Bar: ", subjectID);

    // fetch the json data from json file
    d3.json(dataFile).then(function (data) {
        // samples dictionary from samples json
        var dataSamples = data.samples;

        //Filter the samples data for the selected subjectID
        var filteredSampleArray = dataSamples.filter(sampleObj => sampleObj.id == subjectID)
        // selected sample from the filtered array
        var selectedSample = filteredSampleArray[0];

        // parse needed values
        var otuIdsList = selectedSample.otu_ids;
        var sampleValueList = selectedSample.sample_values;
        var otuLabelsList = selectedSample.otu_labels;

        var otuIdsNames = otuIdsList.map(otu => { return "OTU " + otu.toString() });

        //Get top 10 otu_ids, value and label
        var displayCount = 10
        yValue = otuIdsNames.slice(0, displayCount)
        xValue = sampleValueList.slice(0, displayCount)
        textLabel = otuLabelsList.slice(0, displayCount)

        // Create the Trace
        var trace0 = {
            x: xValue.reverse(),
            y: yValue.reverse(),
            text: textLabel.reverse(),
            type: "bar",
            orientation: 'h'
        };

        // Create the data array for the plot
        var barDataArray = [trace0];

        // Define the plot layout
        var barLayout = {
            title: `Top ${displayCount} Bacteria Cultures found`,
            xaxis: { title: "Value" },
            // yaxis: { title: "OTU ID" }
        };

        // Plot the chart to a div tag with id "bar-plot"
        Plotly.newPlot("bar-plot", barDataArray, barLayout);

    }); //end of d3 json

}
// End of DrawBarChart() ..........................................................................



// DrawBubbleChart() start ---------------------------------------------------------------------------
//Function to Draw the bubble chart
function DrawBubbleChart(subjectID) {
    console.log("Bubble: ", subjectID);

    // fetch the json data from json file
    d3.json(dataFile).then(function (data) {
        // samples dictionary from samples json
        var dataSamples = data.samples;

        //Filter the samples data for the selected subjectID
        var filteredSampleArray = dataSamples.filter(sampleObj => sampleObj.id == subjectID)
        // selected sample from the filtered array
        var selectedSample = filteredSampleArray[0];

        // parse needed values
        var otuIdsLst = selectedSample.otu_ids;
        var sampleValueLst = selectedSample.sample_values;
        var otuLabelsLst = selectedSample.otu_labels;

        // Create the Trace
        var trace0 = {
            x: otuIdsLst,
            y: sampleValueLst,
            text: otuLabelsLst,
            // type: "scatter",
            mode: 'markers',
            marker: {
                size: sampleValueLst,
                color: otuIdsLst,
                colorscale: "Earth"
            }

        };

        // Create the data array for the plot
        var bubbleDataArray = [trace0];

        // Define the plot layout
        var bubbleLayout = {
            title: "Bacterial Culture found and its Occurances",
            xaxis: { title: "OTU ID" },
            yaxis: { title: "Value" },
            hovermode: "closest",
            margin: {t:30}

        };

        // Plot the chart to a div tag with id "bar-plot"
        Plotly.newPlot("bubble-plot", bubbleDataArray, bubbleLayout);

    }); //end of d3 json
}
// End of DrawBubbleChart() ..........................................................................



// PopDemographicMetadata() start ---------------------------------------------------------------------------
//function to populate Metedata
function PopDemographicMetadata(subjectID) {
    console.log("Demo: ", subjectID);

    //Populate Demographic Info
    var demoSection = d3.select("#sample-metadata");

    //clear any child element
    demoSection.html("")

    // fetch the json data from json file
    d3.json(dataFile).then(function (data) {

        // metadata list from samples json
        var sampleMetadata = data.metadata;

        //filter the metadata for the selected subject ID
        var filteredMetadata = sampleMetadata.filter(metaObj => metaObj.id == subjectID)
        var sampleInfo = filteredMetadata[0]

        // loop through each key value in selected metadata 
        Object.entries(sampleInfo).forEach(([key,value]) => {
            demoSection
                .append("p")
                .text(`${key}: ${value}`)
        }); //end for each objects.keys


    }); //end d3.json

}
// End of PopDemographicMetadata() .................................................................................


// PopDemographicMetadata() start ---------------------------------------------------------------------------
//function to populate Metedata
function DrawGaugeChart(subjectID) {
    console.log("Demo: ", subjectID);

    // fetch the json data from json file
    d3.json(dataFile).then(function (data) {

        // metadata list from samples json
        var sampleMetadata = data.metadata;

        //filter the metadata for the selected subject ID
        var filteredMetadata = sampleMetadata.filter(metaObj => metaObj.id == subjectID)
        var sampleInfo = filteredMetadata[0]

        var gaugeDataArray = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: sampleInfo.wfreq,
                title: { text: "Belly Button Washing Frequency" },
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    axis: { range: [0, 9] },
                    steps: [
                      { range: [0, 1], color: "lightgray" },
                      { range: [1, 2], color: "gray" },
                      { range: [2, 3], color: "lightgray" },
                      { range: [3, 4], color: "gray" },
                      { range: [4, 5], color: "lightgray" },
                      { range: [5, 6], color: "gray" },
                      { range: [6, 7], color: "lightgray" },
                      { range: [7, 8], color: "gray" },
                      { range: [8, 9], color: "lightgray" }
                    ],
                    threshold: {
                      line: { color: "red", width: 4 },
                      thickness: 0.75,
                      value: 4.5
                    }
                }
            }
        ]

        var gaugeLayout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
        Plotly.newPlot('gauge', gaugeDataArray, gaugeLayout);


    }); //end d3.json

}
// End of PopDemographicMetadata() .................................................................................


