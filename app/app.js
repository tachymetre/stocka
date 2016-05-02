(function() {
    'use strict';

    // Declare app level module which depends on views, and components
    angular.module('stockApp', [
        'ngRoute',
        'stockApp.controllers',
        'stockApp.directives',
        'stockApp.services'
    ]).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/stock', {
            templateUrl: 'templates/stock.html',
            controller: 'stockController as stock'
        });
        $routeProvider.otherwise({ redirectTo: '/stock' });
    }]);;

    // Setup dependency injection
    angular.module('d3', []);
    angular.module('stockApp.controllers', []);
    angular.module('stockApp.directives', ['d3']);
    angular.module('stockApp.services', []);
})();
