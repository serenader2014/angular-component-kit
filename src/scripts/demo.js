/* global Prism */

var app = angular.module('app', ['ngComponentKit', 'ngSanitize']);

app.controller('ctrl', function ($scope, $rootScope, $http, $timeout, networkProgress, ckProgressBar) {
    var componentsList = [{
        name: 'ck-input',
        type: 'directive'
    },{
        name: 'ck-ripple',
        type: 'directive'
    }, {
        name: 'ck-modal',
        type: 'directive'
    }, {
        name: 'ck-progress-bar',
        type: 'service'
    }];
    var progress = ckProgressBar.createInstance();
    $rootScope.loadingItem = [];
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
    $scope.showLoading = function () {
        progress.start();
        progress.increase(true);
    };
    $scope.stopLoading = function () {
        progress.end();
    };
    $scope.makeRequest = function () {
        $http.get('/').success(function (data) {
            console.log(data);
        });
    };
    $scope.testModal = 'this is original content';
    angular.forEach(componentsList, function (item) {
        $http.get('tmpl/' + item.name + '.html').success(function (data) {
            $scope.components.push({
                name: item.name,
                tmpl: data,
                type: item.type
            });
        });
    });
});

app.directive('demo', function ($compile) {
    return {
        template: ['<div class="component-item">',
            '<h2><code>{{name}}</code> <span class="component-type {{t}}">{{t}}</span></h2>',
            '<p>Demo:</p>',
            '<div class="demo"></div>',
            '<div ng-hide="hideCode"><p>Code:</p>',
            '<pre><code class="language-markup">{{tmpl}}</code></pre></div>',
            '</div>'].join(''),
        link: function (scope, element) {
            element.find('.demo').html($compile(scope.tmpl)(scope.data));
            scope.hideCode = scope.t === 'service' ? true : false;
            Prism.highlightAll();
        },
        scope: {
            name: '=',
            tmpl: '=',
            data: '=',
            t   : '='
        },
        replace: true
    };
});

app.factory('networkProgress', function ($rootScope, ckProgressBar) {
    var url = [];
    var progress = ckProgressBar.createInstance();

    $rootScope.$watch('loadingItem', function (value) {
        if (value && value.length) {
            var flag = false;
            angular.forEach(value, function (item) {
                angular.forEach(url, function (u) {
                    var regexp = new RegExp(u);
                    if (regexp.test(item)) {
                        flag = true;
                    }
                });
            });
            if (!flag) {
                progress.start();
                progress.increase(true);
            }
        } else {
            progress.end();
        }
    }, true);

    return {
        filter: function (urls) {
            angular.forEach(urls, function (u) {
                if (url.indexOf(u) === -1) {
                    url.push(u);
                }
            });
        },
        instance: function () {
            return progress;
        }
    };
});

app.factory('httpInject', function ($rootScope) {
    return {
        request: function (request) {
            $rootScope.loadingItem.push(request.url);
            return request;
        },
        response: function (response) {
            $rootScope.loadingItem.splice($rootScope.loadingItem.indexOf(response.config.url), 1);
            return response;
        },
        requestError: function(err) {
            return err;
        },
        responseError: function (response) {
            $rootScope.loadingItem.splice($rootScope.loadingItem.indexOf(response.config.url), 1);
            return response;
        }
    };
});

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('httpInject');
});