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