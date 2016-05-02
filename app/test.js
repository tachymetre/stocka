(function() {
    // Dimensions and margins format config
    var margin = {
            top: 30,
            right: 20,
            bottom: 100,
            left: 50
        },
        margin2 = {
            top: 210,
            right: 20,
            bottom: 20,
            left: 50
        },
        width = 764 - margin.left - margin.right,
        height = 283 - margin.top - margin.bottom,
        height2 = 283 - margin2.top - margin2.bottom;

    // Date format config 
    var parseDate = d3.time.format('%d/%m/%Y').parse,
        legendFormat = d3.time.format('%b %d, %Y'),
        bisectDate = d3.bisector(function(d) {
            return d.date;
        }).left;

    // Scaling format config
    var x = d3.time.scale().range([0, width]),
        x2 = d3.time.scale().range([0, width]),
        y = d3.scale.linear().range([height, 0]),
        y1 = d3.scale.linear().range([height, 0]),
        y2 = d3.scale.linear().range([height2, 0]),
        y3 = d3.scale.linear().range([60, 0]);

    // Axis component config
    var xAxis = d3.svg.axis().scale(x).orient('bottom'),
        xAxis2 = d3.svg.axis().scale(x2).orient('bottom'),
        yAxis = d3.svg.axis().scale(y).orient('left');

    // Priceline format config
    var priceLine = d3.svg.line()
        .interpolate('monotone')
        .x(function(d) {
            return x(d.date);
        })
        .y(function(d) {
            return y(d.price);
        });

    // Averageline format config
    var avgLine = d3.svg.line()
        .interpolate('monotone')
        .x(function(d) {
            return x(d.date);
        })
        .y(function(d) {
            return y(d.average);
        });

    // Chart area config
    var area2 = d3.svg.area()
        .interpolate('monotone')
        .x(function(d) {
            return x2(d.date);
        })
        .y0(height2)
        .y1(function(d) {
            return y2(d.price);
        });

    // Create chart's element
    var stockGraph = d3.select("body").append('div')
        .attr('class', 'chart__wrapper')
        .attr('id', 'stocka-graph');

    var svg = stockGraph.append('svg')
        .attr('class', 'chart')
        .attr('width', width)
        .attr('height', height + margin.top + margin.bottom + 60);

    svg.append('defs').append('clipPath')
        .attr('id', 'clip')
        .append('rect')
        .attr('width', width)
        .attr('height', height);

    var focus = svg.append('g')
        .attr('class', 'focus')
        .attr('transform', 'translate(0,' + margin.top + ')');

    var barsGroup = svg.append('g')
        .attr('class', 'volume')
        .attr('clip-path', 'url(#clip)')
        .attr('transform', 'translate(0,' + (margin.top + 80) + ')');

    var context = svg.append('g')
        .attr('class', 'context')
        .attr('transform', 'translate(0,' + (margin2.top + 60) + ')');

    var legend = svg.append('g')
        .attr('class', 'chart__legend')
        .attr('width', width)
        .attr('height', 50)
        .attr('transform', 'translate(0, 10)');

    legend.append('text')
        .attr('class', 'chart__symbol')
        .text('NASDAQ: AAPL')

    var rangeSelection = legend
        .append('g')
        .attr('class', 'chart__range-selection')
        .attr('transform', 'translate(120, 0)');

    // Helper function to coordinate y-axis
    var make_y_axis = function() {
        return d3.svg.axis()
            .scale(y)
            .orient('left')
            .ticks(3);
    };

    function type(d) {
        return {
            date: parseDate(d.Date),
            price: +d.Close,
            average: +d.Average,
            volume: +d.Volume,
        }
    }

    // Process the data received from CSV file
    d3.csv('./data/aapl.csv', type, function(err, data) {
        console.log(data);
    });
}());
