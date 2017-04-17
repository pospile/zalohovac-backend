
var data = {
    // A labels array that can contain any sort of values
    labels: ['8.4', '9.4', '10.4'],
    // Our series array that contains series objects or in this case series data arrays
    series: [
        [13, 17, 0]
    ]
};

// Create a new line chart object where as first parameter we pass in a selector
// that is resolving to our chart container element. The Second parameter
// is the actual data object.
new Chartist.Line('.ct-chart-sale',
    data,
    {
        fullWidth: true,
        chartPadding: {
            right: 40
        },
        showArea: true
    });
