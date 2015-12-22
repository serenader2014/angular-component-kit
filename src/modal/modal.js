angular.module('ngComponentKit').directive('ckModal', function () {
    return {
        templateUrl: 'modal/modal.html',
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
                        element.find('.ck-modal').css({
                            top: 200,
                            left: doc.width()/2 - 400
                        });
                        element.find('.ck-modal-body').css({
                            maxHeight: screenHeight - 400
                        });
                        angular.element('body').addClass('ck-modal-open');
                    } else {
                        angular.element('body').removeClass('ck-modal-open');
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