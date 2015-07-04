var app = angular.module('app', ['ngComponentKit']);

app.controller('ctrl', ['$scope', function ($scope) {
    $scope.welcome = 'hello world';
}]);