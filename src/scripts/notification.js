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
        setTimeout(function () {
            element.addClass('ck-in');
        }, 10);
        return scope;
    };

    event.on('notification.rendered', function (option) {
        var id = option.id;
        var height = option.height;
        var position = option.position;
        heightMap[position] = heightMap[position] || {};
        heightMap[position][id] = height;
        var top = 10;
        angular.forEach(heightMap[position], function (height, id) {
            event.emit('notification.' + id + '.' + position + '.rePosition', top);
            top += height + 10;
        });
    });

    event.on('notification.close', function (id, position) {
        event.emit('notification.rendered', {
            id: id,
            height: -10,
            position: position
        });
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
                scope.style[position] = height;
                scope.$digest();
            }
            var position = scope.position.top ? 'top' : 'bottom';
            scope.style = {
                top: scope.position.top ? 0 : 'auto',
                bottom: scope.position.bottom ? 0 : 'auto',
                left: scope.position.left ? 10 : 'auto',
                right: scope.position.right ? 10 : 'auto',
            };
            setTimeout(function () {
                event.emit('notification.rendered', {
                    id: scope.count,
                    height: element.height() + 26,
                    position: position
                });
            }, 10);
            event.on('notification.' + scope.count + '.' + position + '.rePosition', rePosition);
            scope.close = function () {
                element.addClass('ck-close');
                setTimeout(function () {
                    element.remove();
                    scope.$destroy();
                    event.emit('notification.close', scope.count, position);
                    event.off('notification.' + scope.count + '.' + position + '.rePosition', rePosition);
                }, 300);
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