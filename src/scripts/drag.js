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