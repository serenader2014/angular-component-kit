angular.module('ngComponentKit', ['ngAnimate']);
angular.module('ngComponentKit').directive('ckDrag', function () {
    return function link (scope, element, attrs) {
        var head = attrs.ckDrag ? element.find(attrs.ckDrag) : element;
        var body = angular.element('body');
        var mock = angular.element('<div></div>');
        var elementPos = {
            left: 0,
            top: 0
        };
        var cursorPos = {
            left: 0,
            top: 0
        };
        var gap = {
            left: 0,
            top: 0
        };
        var move = {
            top: 0,
            left: 0
        };
        function mousedown (event) {
            var left = event.pageX;
            var top = event.pageY;
            element.append(mock);
            head.off('mousedown', mousedown);
            body.on('mousemove', mousemove);
            body.on('mouseup', mouseup);
            elementPos = element.offset();
            mock.css({
                position: 'absolute',
                top: 0,
                left: 0,
                width: element.width(),
                height: element.height(),
                background: 'rgba(255,255,255,0.8)',
                cursor: 'move'
            });
            element.append(mock);
            cursorPos.left = left;
            cursorPos.top = top;
            gap.left = left - elementPos.left;
            gap.top = top - elementPos.top;
        }
        function mousemove (event) {
            var left = event.pageX;
            var top = event.pageY;
            move.top = top - gap.top;
            move.left = left - gap.left;
            mock.css({
                top: move.top - elementPos.top,
                left: move.left - elementPos.left
            });
        }
        function mouseup () {
            body.off('mousemove', mousemove);
            body.off('mouseup', mouseup);
            head.on('mousedown', mousedown);
            mock.remove();
            element.css({
                top: move.top,
                left: move.left
            });
        }
        head.on('mousedown', mousedown);
    };
});
angular.module('ngComponentKit').directive('ckInput', ['$compile', function ($compile) {
    return {
        require: 'ngModel',
        scope: {
            desc: '='
        },
        link: function (scope, element, attr, ctrl) {
            var tmpl = ['<span class="ck-input" ng-class="{up: hasValue, focus: focus, error: isError()}">',
            '<span class="ck-input-desc">{{desc}}</span',
            '</span>'].join('');
            tmpl = angular.element($compile(tmpl)(scope));
            element.before(tmpl);
            tmpl.append(element);
            element.on('focus', function () {
                scope.focus = true;
                scope.$digest();
            });
            element.on('blur', function () {
                scope.focus = false;
                scope.$digest();
            });
            scope.$watch(function () {
                return ctrl.$viewValue;
            }, function (value) {
                scope.hasValue = !!value;
            });
            scope.isError = function () {
                return ctrl.$invalid;
            };
        }
    };
}]);
angular.module('ngComponentKit').directive('ckModal', function () {
    return {
        template: ['<div tabindex="-1" ng-class="{active: active}" ng-blur="blur()"',
            'ng-focus="focus()" ng-show="show" class="ck-modal" ck-drag=".ck-modal-head" >',
            '<div class="ck-modal-head">{{title}}</div>',
            '<div class="ck-modal-body" ng-transclude></div>',
            '<div class="ck-modal-foot">',
            '<button ng-click="ok()" class="ck-btn ck-btn-blue" ck-ripple>Comfirm</button>',
            '<button ng-click="off($event)" class="ck-btn" ck-ripple="black">Close</button>',
            '</div></div>'
            ].join(''),
        transclude: true,
        scope: {
            title  : '=name',
            confirm: '&',
            close  : '&',
            show   : '='
        },
        link: function (scope, element, attr) {
            function closeModal () {
                scope.show = false;
            }
            var doc          = angular.element(document);
            var screenHeight = angular.element(window).height();
            var screenWidth  = angular.element(window).width();
            scope.active = false;
            if (screenWidth > 800) {
                scope.$watch('show', function (show) {
                    scope.active = !!show;
                    if (show) {
                        element.css({
                            top: doc.scrollTop() +200,
                            left: doc.width()/2 - 400
                        });
                        element.find('.ck-modal-body').css({
                            maxHeight: screenHeight - 400
                        });
                    }
                });
            } else {
                element.find('.ck-modal-body').css({
                    maxHeight: screenHeight - 132
                });
            }


            scope.ok = function () {
                if (attr.confirm) {
                    scope.confirm({scope: scope, close: closeModal});
                } else {
                    closeModal();
                }
            };
            scope.off = function () {
                if (attr.close) {
                    scope.close({scope: scope, close: closeModal});
                } else {
                    closeModal();
                }
            };

            scope.blur = function () {
                scope.active = false;
            };

            scope.focus = function () {
                scope.active = true;
            };
        },
        replace: true
    };
});
angular.module('ngComponentKit').directive('ckRipple', function () {
    return {
        link: function (scope, elem, attrs) {
            elem.addClass('ck-ripple');
            var ink = elem.find('.ck-ripple-ink');
            if (attrs.ckRipple !== 'ck-ripple') {
                var color = attrs.ckRipple;
                elem.addClass('ck-ripple-' + color);
            }
            elem.on('click', function (event) {
                ink.removeClass('ck-ripple-animate');

                var offsetLeft = elem.offset().left;
                var offsetTop = elem.offset().top;
                var width = elem[0].offsetWidth;
                var height = elem[0].offsetHeight;
                var inkWidth = Math.max(width, height);
                var x = event.pageX - offsetLeft - inkWidth/2;
                var y = event.pageY - offsetTop - inkWidth/2;
                ink.css({width: inkWidth, height: inkWidth, top: y, left: x});
                ink.addClass('ck-ripple-animate');
            });
        },
        transclude: true,
        template: '<span class="ck-ripple-ink"></span><span ng-transclude></span>'
    };
});