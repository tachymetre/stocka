(function() {
    'use strict';

    var app = angular.module("stockApp.services", []);
    app.factory("getStockInfo", function($http) {
        var rawParams,
            paramQuery,
            transformParams,
            transformArray = [],
            baseStockUrl = 'http://query.yahooapis.com/v1/public/yql',
            appendQueryStockUrl = ')&format=json&env=http://datatables.org/alltables.env',
            prependQueryStockUrl = '?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20IN%20(';

        return {
            getSummary: function(requestParams) {
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
            }
        };
    });
})();
