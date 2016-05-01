'use strict';
var app = angular.module("stockApp.stock", []);

app.controller("stockController", function($scope, getStockInfo) {
    var stockDataArray = [];
    var neededData;

    // When user changes the inputs, update accordingly
    $scope.updateSymbol = function(symbol) {
        $scope.requestSymbol = symbol;
    };

    // Get the summary data for a particle stock
    $scope.getStockData = function() {
        getStockInfo.getSummary($scope.requestSymbol).then(function(response) {
            $scope.stockData = response.data;
            neededData = $scope.stockData.query.results.quote;
            if (Array.isArray(neededData)) {
                neededData.forEach(function(value, index) {
                    $scope.saveStockData(value);
                });
                neededData.length = 0;
            } else {
            	$scope.saveStockData(neededData);
            }
        });
    }

    // Download data into CSV depends on the singularity
    $scope.saveStockData = function(data) {
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
        link.setAttribute("download", "stock_summary.csv");
        link.click();
    }
});
