(function() {
    'use strict';

    var app = angular.module("stockApp.services", []);
    app.factory("getStockInfo", function($http) {
        var rawParams,
            paramQuery,
            transformParams,
            transformArray = [];

        return {
            getSummary: function(requestParams) {
                var baseStockUrl = 'http://query.yahooapis.com/v1/public/yql',
                    appendQueryStockUrl = ')&format=json&env=http://datatables.org/alltables.env',
                    prependQueryStockUrl = '?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20IN%20(';

                // Check if param(s) is singular or not
                if (requestParams.indexOf(',') > 0) {
                    rawParams = requestParams.replace(/\s+/, "").split(',');
                    rawParams.forEach(function(value, index) {
                        transformParams = '%22' + value + '%22';
                        transformArray.push(transformParams);
                    });
                    // Make sure to clear the array for next iteration
                    paramQuery = transformArray.join();
                    transformArray.length = 0;
                } else {
                    paramQuery = '%22' + requestParams + '%22';
                }

                // Return promise object for async operation in the controller
                var promise = $http({
                    method: 'GET',
                    url: baseStockUrl + prependQueryStockUrl + paramQuery + appendQueryStockUrl
                });
                return promise;
            },
            getVisualizedData: function(requestParams) {
                var startDateStock = '"2015-05-01"',
                    endDateStock = '"2016-04-29"',
                    prependQueryStartDate = ' and startDate %3D ',
                    prependQueryEndDate = ' and endDate %3D ',
                    baseStockUrl = 'https://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.historicaldata where symbol %3D ',
                    appendQueryStockUrl = '&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';

                // Check if param(s) is singular or not
                paramQuery = "'" + requestParams + "'";

                // Return promise object for async operation in the controller
                var promise = $http({
                    method: 'GET',
                    url: baseStockUrl + paramQuery + prependQueryStartDate + startDateStock + prependQueryEndDate + endDateStock + appendQueryStockUrl
                });
                return promise;
            }
        };
    });
})();
