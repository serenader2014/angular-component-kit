var app = angular.module('app', ['ngComponentKit', 'ngSanitize']);

app.controller('ctrl', ['$scope', '$http', function ($scope, $http) {
    var componentsList = ['ck-input', 'ck-ripple'];
    $scope.components = [];

    angular.forEach(componentsList, function (item) {
        $http.get('dist/tmpl/' + item + '.html').success(function (data) {
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
            scope.welcome = 'hello world';
            element.find('.demo').html($compile(scope.tmpl)(scope));
        },
        scope: {
            name: '=',
            tmpl: '='
        },
        replace: true
    };
}]);