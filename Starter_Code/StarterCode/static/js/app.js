const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
d3.json(url).then(function(data) {
    console.log(data);
});

// Page initialized, dropdown
function init() { 

    let selector = d3.select("#selDataset");
    
    d3.json(url).then(function(data) {
        let names = data.names;
        names.forEach(element => {
            selector.append("option").text(element).property("value");            
        });
        let idSelect = names [0];
        charts(idSelect);
    });
};

//  charts
function charts(sample) {

    d3.json(url).then(function(data) {

        // Meta data
        // Data from json file
        var metadata = data.metadata;
        var metadataresults = metadata.filter(UserInput) [0];
        var infoTable = d3.select("#sample-metadata").html("");
        Object.entries(metadataresults).forEach(([key,value]) => {
            infoTable.append("h5").text(`${key}: ${value}`);                        
        });
        
        var samples = data.samples;
        function UserInput(results) {
            return results.id == sample;
        };
        var selection = samples.filter(UserInput) [0];
        var otuLabels = selection.otu_labels;
        var values = selection.sample_values;
        var otuIds = selection.otu_ids;

        let labels = otuLabels.slice(0,10).reverse();
        let xticks = values.slice(0,10).reverse();
        let yticks = otuIds.slice(0,10).map(id => `OTU ${id}`).reverse();
        
        // Bar
        let bartrace = [{
            text: labels,
            x: xticks,
            y: yticks,
            type: "bar",
            orientation: "h",
            marker: {
        }}];
        Plotly.newPlot("bar",bartrace);

        // Bubble
        let bubbletrace = [{
            text: labels,
            x: otuIds,
            y: values,
            mode: "markers",
            marker: {
                size: values,
                color: otuIds,
                colorscale: [
                    [0, '#0000FF'],
                    [0.2, '#1a75ff'],
                    [0.4, '#00cc88'],
                    [0.6, '#964B00'],
                    [0.8, '#99ff33'],
                    [1.0, '#964B00'],
                ],
            }
        }];
        let bubblelayout = {
            xaxis: {title: "OTU ID"}
        };
        Plotly.newPlot("bubble",bubbletrace,bubblelayout);
    });
};
function optionChanged(newSelection) {
    charts(newSelection);
};
init();