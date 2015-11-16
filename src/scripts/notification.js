angular.module('ngComponentKit').factory('ckNotify', function ($rootScope, $compile) {
    var defaultOption = {
        type: 'normal',
        msg: '',
        position: {
            top: true,
            right: true
        },
        autoHide: true,
        callback: function () {}
    };
    var notify = function (option) {
        var scope = $rootScope.$new();
        scope = angular.extend(scope, defaultOption, option);
        var element = $compile('<notification></notification>')(scope);
        angular.element('body').append(element);
    };

    notify.normal = function (msg) {
        return notify({
            msg: msg,
            type: 'normal'
        });
    };
    notify.success = function (msg) {
        return notify({
            msg: msg,
            type: 'success'
        });
    };
    notify.error = function (msg) {
        return notify({
            msg: msg,
            type: 'error'
        });
    };
    notify.warning = function (msg) {
        return notify({
            msg: msg,
            type: 'warning'
        });
    };

    return notify;
}).directive('notification', function () {
    var obj = {
        template: ['<div class="ck-notification ck-{{type}}" ng-style="positionStyle"',
                    '><span>{{msg}}</span><button class="ck-btn" ck-ripple ',
                    'ng-click="close()">Close</button></div>'].join(''),
        restrict: 'E',
        link: function (scope, element) {
            scope.positionStyle = {};
            scope.positionStyle.top = scope.position.top ? 10 : 'auto';
            scope.positionStyle.bottom = scope.position.bottom ? 10 : 'auto';
            scope.positionStyle.left = scope.position.left ? 10 : 'auto';
            scope.positionStyle.right = scope.position.right ? 10 : 'auto';
            scope.close = function () {
                element.remove();
                if (typeof scope.callback === 'function') {
                    scope.callback.call(this, scope);
                }
            };
        }
    };

    return obj;
});