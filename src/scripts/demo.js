var app = angular.module('app', ['ngComponentKit', 'ngSanitize']);

app.controller('ctrl', ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {
    var componentsList = ['ck-input','ck-ripple', 'ck-modal'];
    $scope.components = [];
    $scope.data = $scope;
    $scope.welcome= 'hello world';
    $scope.closeModal = function (scope, close) {
        $scope.testModal = 'modal will close in 2s';
        $timeout(function () {
            close();
        }, 2000);
    };
    $scope.confirm = function (scope, close) {
        $scope.testModal = 'modal will close..';
        $timeout(function () {
            close();
        }, 1000);
        $timeout(function () {
            scope.show = true;
            $scope.testModal = 'modal show again';
        }, 2000);
    };
    $scope.testModal = 'this is original content';
    angular.forEach(componentsList, function (item) {
        $http.get('tmpl/' + item + '.html').success(function (data) {
            $scope.components.push({
                name: item,
                tmpl: data
            });
        });
    });
}]);

app.directive('demo', ['$compile', function ($compile) {
    return {
        template: ['<div class="component-item">',
            '<h2><code>{{name}}</code> directive</h2>',
            '<p>Demo:</p>',
            '<div class="demo"></div>',
            '<p>Code:</p>',
            '<pre><code>{{tmpl}}</code></pre>',
            '</div>'].join(''),
        link: function (scope, element) {
            element.find('.demo').html($compile(scope.tmpl)(scope.data));
        },
        scope: {
            name: '=',
            tmpl: '=',
            data: '='
        },
        replace: true
    };
}]);