angular.module('ngComponentKit').directive('ckModal', function () {
    return {
        template: ['<div ng-show="show" class="ck-modal" ck-drag=".ck-modal-head" >',
            '<div class="ck-modal-head">{{title}}</div>',
            '<div class="ck-modal-body" ng-transclude></div>',
            '<div class="ck-modal-foot">',
            '<button ng-click="ok()" class="ck-btn ck-btn-blue" ck-ripple>Comfirm</button>',
            '<button ng-click="off($event)" class="ck-btn" ck-ripple="black">Close</button>',
            '</div></div>'
            ].join(''),
        transclude: true,
        scope: {
            title: '=name',
            confirm: '&',
            close: '&',
            show: '='
        },
        link: function (scope, element, attr) {
            function closeModal () {
                scope.show = false;
            }
            var doc = angular.element(document);
            var screenHeight = angular.element(window).height();
            var screenWidth = angular.element(window).width();
            if (screenWidth > 800) {
                scope.$watch('show', function (show) {
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
        },
        replace: true
    };
});