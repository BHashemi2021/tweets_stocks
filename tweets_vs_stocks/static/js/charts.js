function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("../static/data/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new year is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Create a Horizontal Bar Chart

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("../data/samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var tweets_stocks = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];

    // 6. Create variables that hold the column labels 1, 2, and 3  or any other you would like to graph.
    var  date = result.ts_dates;
    var like_count = result.ts_like_counts.slice(0, 10).reverse();
    var volume = result.sample_values.slice(0,10).reverse();
    var change = result.sample_values.slice(0,10).reverse();

    var bubbleLabels = result.otu_labels;
    var bubbleValues = result.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = ids.map(sampleObj => "Y " + sampleObj).slice(0,10).reverse();

    console.log(yticks)

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: values,
      y: yticks,
      type: "bar",
      orientation: "h",
      text: labels 
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Tweets vs Stocks"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);


// Create a Bubble Chart

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: ids,
      y: bubbleValues,
      text: bubbleLabels,
      mode: "markers",
       marker: {
         size: bubbleValues,
         color: bubbleValues,
         colorscale: "Portland" 
       }
    }];
  
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
        title: "Tweets",
        xaxis: {title: "Time"},
        yaxis: {title: "Freq"},
        automargin: true,
        hovermode: "closest"
        
    };
  
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout)
