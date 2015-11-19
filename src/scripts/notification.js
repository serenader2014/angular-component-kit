angular.module('ngComponentKit').factory('ckNotify', function ($rootScope, $compile, event) {
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
    var count = 0;
    var heightMap = {};
    var notify = function (option) {
        var scope = $rootScope.$new();
        scope = angular.extend(scope, defaultOption, option);
        scope.count = count;
        count += 1;
        var element = $compile('<notification></notification>')(scope);
        angular.element('body').append(element);
        element.fadeIn();
        return scope;
    };

    event.on('notification.rendered', function (id, height) {
        heightMap[id] = height;
        var top = 10;
        angular.forEach(heightMap, function (height, id) {
            event.emit('notification.' + id + '.rePosition', top);
            top += height + 10;
        });
    });

    event.on('notification.close', function (id) {
        event.emit('notification.rendered', id, -10);
    });

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
}).directive('notification', function (event) {
    var obj = {
        template: ['<div class="ck-notification ck-{{type}}" ng-style="style"',
                    '><span>{{msg}}</span><button class="ck-btn" ck-ripple ',
                    'ng-click="close()">Close</button></div>'].join(''),
        restrict: 'E',
        replace: true,
        link: function (scope, element) {
            function rePosition (height) {
                scope.style.top = height;
                scope.$digest();
            }
            scope.style = {};
            setTimeout(function () {
                event.emit('notification.rendered', scope.count, element.height() + 26);
            }, 10);
            event.on('notification.' + scope.count + '.rePosition', rePosition);
            scope.close = function () {
                element.fadeOut(function () {
                    element.remove();
                    scope.$destroy();
                    event.emit('notification.close', scope.count);
                    event.off('notification.' + scope.count + '.rePosition', rePosition);
                });
                if (typeof scope.callback === 'function') {
                    scope.callback.call(this, scope);
                }
            };
            if (scope.autoHide) {
                setTimeout(function () {
                    scope.close();
                }, 3000);
            }
        }
    };

    return obj;
});