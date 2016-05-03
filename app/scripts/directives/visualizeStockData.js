(function() {
    'use strict';

    var app = angular.module("stockApp.directives");
    app.directive('visualizeStockData', function(d3, getStockInfo, $document) {
        return {
            restrict: 'EA',
            scope: {
                requestSymbol: '@'
            },
            link: function(scope, elem, attrs, ctrl) {
                // Date format config 
                var parseDate = d3.time.format('%Y-%m-%d').parse,
                    legendFormat = d3.time.format('%b %d, %Y'),
                    bisectDate = d3.bisector(function(d) {
                        return d.date;
                    }).right;

                // Transform data from API to the correct format for D3 usage
                function transformData(d) {
                    var average;
                    var stockDate;
                    var data;
                    var dataArray = [];
                    d.forEach(function(v, i) {
                        average = (parseFloat(v.High) + parseFloat(v.Low)) / 2;
                        data = {
                            average: average,
                            date: parseDate(v.Date),
                            price: v.Close,
                            volume: v.Volume
                        }
                        dataArray.push(data);
                    });
                    return dataArray
                }
                elem.on('click', function() {
                    if (!scope.requestSymbol) {
                        return;
                    }
                    // Check if the stock chart has already rendered or not
                    var element = document.getElementById('stocka-graph-' + scope.requestSymbol);
                    if (typeof(element) != 'undefined' && element != null) {
                        element.style.display = 'none';
                    }
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
                        width = 960 - margin.left - margin.right,
                        height = 400 - margin.top - margin.bottom,
                        height2 = 400 - margin2.top - margin2.bottom;

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
                        .attr('id', 'stocka-graph-' + scope.requestSymbol);

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
                        .attr('transform', 'translate(0,' + (margin.top + 120) + ')');

                    var context = svg.append('g')
                        .attr('class', 'context')
                        .attr('transform', 'translate(0,' + (margin2.top + 80) + ')');

                    // Helper function to coordinate y-axis
                    var make_y_axis = function() {
                        return d3.svg.axis()
                            .scale(y)
                            .orient('left')
                            .ticks(3);
                    };

                    // Make calls to services to retrieve stock data
                    getStockInfo.getVisualizedData(scope.requestSymbol).then(function(response) {
                        var rawData = response.data.query.results.quote;
                        var data = transformData(rawData);

                        // Render the legends for the chart first
                        var legend = svg.append('g')
                            .attr('class', 'chart__legend')
                            .attr('width', width)
                            .attr('height', 50)
                            .attr('transform', 'translate(0, 10)');

                        legend.append('text')
                            .attr('class', 'chart__symbol')
                            .text('NASDAQ: ' + scope.requestSymbol);

                        var rangeSelection = legend
                            .append('g')
                            .attr('class', 'chart__range-selection')
                            .attr('transform', 'translate(120, 0)');

                        var brush = d3.svg.brush()
                            .x(x2)
                            .on('brush', brushed);

                        var xRange = d3.extent(data.map(function(d) {
                            return d.date;
                        }));

                        x.domain(xRange);
                        y.domain(d3.extent(data.map(function(d) {
                            return d.price;
                        })));
                        y3.domain(d3.extent(data.map(function(d) {
                            return d.price;
                        })));
                        x2.domain(x.domain());
                        y2.domain(y.domain());

                        // Capture limits and bounds for data inputs
                        var min = d3.min(data.map(function(d) {
                            return d.price;
                        }));
                        var max = d3.max(data.map(function(d) {
                            return d.price;
                        }));

                        var range = legend.append('text')
                            .text(legendFormat(new Date(xRange[0])) + ' - ' + legendFormat(new Date(xRange[1])))
                            .style('text-anchor', 'end')
                            .attr('transform', 'translate(' + width + ', 0)');

                        focus.append('g')
                            .attr('class', 'y chart__grid')
                            .call(make_y_axis()
                                .tickSize(-width, 0, 0)
                                .tickFormat(''));

                        var averageChart = focus.append('path')
                            .datum(data)
                            .attr('class', 'chart__line chart__average--focus line')
                            .attr('d', avgLine);

                        var priceChart = focus.append('path')
                            .datum(data)
                            .attr('class', 'chart__line chart__price--focus line')
                            .attr('d', priceLine);

                        focus.append('g')
                            .attr('class', 'x axis')
                            .attr('transform', 'translate(0 ,' + height + ')')
                            .call(xAxis);

                        focus.append('g')
                            .attr('class', 'y axis')
                            .attr('transform', 'translate(12, 0)')
                            .call(yAxis);

                        var helper = focus.append('g')
                            .attr('class', 'chart__helper')
                            .style('text-anchor', 'end')
                            .attr('transform', 'translate(' + width + ', 0)');

                        var helperText = helper.append('text')

                        var priceTooltip = focus.append('g')
                            .attr('class', 'chart__tooltip--price')
                            .append('circle')
                            .style('display', 'none')
                            .attr('r', 2.5);

                        var averageTooltip = focus.append('g')
                            .attr('class', 'chart__tooltip--average')
                            .append('circle')
                            .style('display', 'none')
                            .attr('r', 2.5);

                        context.append('path')
                            .datum(data)
                            .attr('class', 'chart__area area')
                            .attr('d', area2);

                        context.append('g')
                            .attr('class', 'x axis chart__axis--context')
                            .attr('y', 0)
                            .attr('transform', 'translate(0,' + (height2 - 22) + ')')
                            .call(xAxis2);

                        context.append('g')
                            .attr('class', 'x brush')
                            .call(brush)
                            .selectAll('rect')
                            .attr('y', -6)
                            .attr('height', height2 + 7);

                        function brushed() {
                            var ext = brush.extent();
                            if (!brush.empty()) {
                                x.domain(brush.empty() ? x2.domain() : brush.extent());
                                y.domain([
                                    d3.min(data.map(function(d) {
                                        return (d.date >= ext[0] && d.date <= ext[1]) ? d.price : max;
                                    })),
                                    d3.max(data.map(function(d) {
                                        return (d.date >= ext[0] && d.date <= ext[1]) ? d.price : min;
                                    }))
                                ]);
                                range.text(legendFormat(new Date(ext[0])) + ' - ' + legendFormat(new Date(ext[1])))
                            }

                            priceChart.attr('d', priceLine);
                            averageChart.attr('d', avgLine);
                            focus.select('.x.axis').call(xAxis);
                            focus.select('.y.axis').call(yAxis);
                        }
                    });
                });
            }
        }
    });
})();
