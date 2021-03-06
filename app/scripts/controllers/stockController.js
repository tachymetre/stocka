(function() {
    'use strict';

    var app = angular.module("stockApp.controllers", []);
    app.controller("stockController", function(getStockInfo) {
        var vm = this;
        var stockDataArray = [];
        var neededData;
        
        // When user changes the inputs, update accordingly
        vm.updateSymbol = function(symbol) {
            vm.requestSymbol = symbol;
        };

        // Get the summary data for a particle stock
        vm.getStockData = function() {
            if (!vm.requestSymbol) {
                return;
            }
            getStockInfo.getSummary(vm.requestSymbol).then(function(response) {
                vm.stockData = response.data;
                neededData = vm.stockData.query.results.quote;
                if (Array.isArray(neededData)) {
                    neededData.forEach(function(value, index) {
                        vm.saveStockData(value);
                    });
                    neededData.length = 0;
                } else {
                    vm.saveStockData(neededData);
                }
            });
        }

        // Download data into CSV files depends on the singularity
        vm.saveStockData = function(data) {
            for (var prop in data) {
                stockDataArray.push([prop, data[prop]]);
            }
            // Insert response data into a CSV file
            var dataString,
                csvContent = "data:text/csv;charset=utf-8,";

            stockDataArray.forEach(function(datumProperty, index) {
                dataString = datumProperty.join(",");
                csvContent += index < stockDataArray.length ? dataString + "\n" : dataString;

            });
            // Download CSV file after encoding
            var encodedURI = encodeURI(csvContent);
            var link = document.createElement("a");
            stockDataArray = [];
            link.setAttribute("href", encodedURI);
            link.setAttribute("download", "stock_summary_" + data.symbol + ".csv");
            link.click();
        }
    });
})();
