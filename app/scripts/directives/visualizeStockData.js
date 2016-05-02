(function() {
    'use strict';

    var app = angular.module("stockApp.directives");
    app.directive('visualizeStockData', function(d3) {
    	return {
    		restrict: 'EA',
    		scope: true,
    		link: function(scope, elem, attrs) {
    			console.log(elem);
    		}
    	}
    });
})();
