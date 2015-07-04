angular.module('ngComponentKit', []);
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