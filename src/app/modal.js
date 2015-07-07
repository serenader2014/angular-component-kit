angular.module('ngComponentKit').directive('ckModal', function () {
    return {
        template: ['<div ng-show="show" class="ck-modal"><div ck-drag=".ck-modal-head" class="ck-modal-wrapper">',
            '<div class="ck-modal-head">{{title}}</div>',
            '<div class="ck-modal-body" ng-transclude></div>',
            '<div class="ck-modal-foot">',
            '<button ng-click="ok()" class="ck-btn ck-btn-blue" ck-ripple>Comfirm</button>',
            '<button ng-click="off($event)" class="ck-btn" ck-ripple="black">Close</button>',
            '</div></div></div>'
            ].join(''),
        transclude: true,
        scope: {
            title: '=name',
            confirm: '&',
            close: '&',
            show: '='
        },
        link: function (scope, element) {
            function closeModal () {
                scope.show = false;
            }
            var doc = angular.element(document);

            scope.$watch('show', function (show) {
                if (show) {
                    element.find('.ck-modal-wrapper').css({
                        top: doc.scrollTop() +200,
                        left: doc.width()/2 - 400
                    });
                }
            });

            scope.ok = function () {
                if (scope.confirm && typeof scope.confirm === 'function') {
                    scope.confirm({scope: scope, close: closeModal});
                } else {
                    closeModal();
                }
            };
            scope.off = function () {
                if (scope.close && typeof scope.close === 'function') {
                    scope.close({scope: scope, close: closeModal});
                } else {
                    closeModal();
                }
            };
        },
        replace: true
    };
});