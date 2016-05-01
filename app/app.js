'use strict';

// Declare app level module which depends on views, and components
angular.module('stockApp', [
    'ngRoute',
    'stockApp.stock',
]).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/stock', {
        templateUrl: 'templates/stock.html',
        controller: 'stockController'
    });
    $routeProvider.otherwise({ redirectTo: '/stock' });
}]);
