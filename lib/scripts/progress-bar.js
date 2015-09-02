angular.module('ngComponentKit').factory('ckProgressBar', function () {
    var i = 0;
    function Progress () {
        i = i + 1;
        // 实例计数
        this.instanceCount = i;

        // loading 状态的百分比
        this.count = 0;

        // 是否自动计数
        this.autoIncrease = false;

        // 存储定时器的 handler ，用于清除该计时器
        this.intervalHandler = null;

        // 初始颜色
        this.color = 'rgb(2, 141, 192)';

        // 当前状态，未调用前是 `wait` ，开始 loading 时是 `loading` ，禁止使用时是 `prohibit`
        this.status = 'wait';

        // 事件的callback
        this.callbacks = {};
    }

    Progress.fn = Progress.prototype;

    /**
     * 初始化，将HTML append 到页面中。
     * @return     {Object} Progress 实例
     */
    Progress.fn.init = function () {
        var str = ['<div class="ck-progress-wrapper"><span class="ck-progress-bar"><span class="ck-progress-bar-inner">',
                    '</span></span><span class="ck-progress-circle"></span></div>'].join('\n');
        this.ele = angular.element(str);
        this.setColor(this.color);
        this.status = 'loading';
        angular.element('body').append(this.ele);
        this.trigger('init');

        return this;
    };

    /**
     * 开始进入loading效果，进度为0%
     * @return {Object} 返回Progress实例.
     */
    Progress.fn.start = function () {
        if (this.status === 'loading' || this.status === 'prohibit') {
            return;
        }
        this.init();
        this.set(0);
        this.trigger('start');
        return this;
    };

    /**
     * 设置为禁用 loading 效果。
     * @return {Object} 返回Progress实例
     */
    Progress.fn.prohibit = function () {
        this.status = 'prohibit';
        return this;
    };

    /**
     * 增加进度。
     * @param  {Boolean} auto 是否自动增加。
     * @return {Object}      返回Progress实例
     */
    Progress.fn.increase = function (auto) {
        var _this = this;
        if (this.status !== 'loading') {
            return;
        }
        if (this.autoIncrease) {
            return;
        }
        if (auto) {
            this.autoIncrease = true;
            this.intervalHandler = setInterval(function () {
                _this.count = _this.count + Math.floor(Math.random()*5);
                if (_this.count > 98) {
                    _this.stop();
                    return;
                }
                _this.set(_this.count);
            }, 400);
        } else {
            this.set(this.count + Math.floor(Math.random()*5));
        }
        this.trigger('increase');
        return this;
    };

    /**
     * 设置进度百分比
     * @param {Number} percent 百分比数值
     * @return {Object} 返回Progress实例
     */
    Progress.fn.set = function (percent) {
        if (this.status !== 'loading') {
            return;
        }
        this.count = percent;
        this.ele.find('.ck-progress-bar').width(this.count+'%');
        this.trigger('progress');

        return this;
    };

    /**
     * 暂停进度
     * @return {Object} 返回实例
     */
    Progress.fn.stop = function () {
        if (this.intervalHandler) {
            clearInterval(this.intervalHandler);
            this.intervalHandler = null;
            this.autoIncrease = false;
        }
        this.trigger('stop');
        return this;
    };

    /**
     * 结束进度
     * @return {Object} 返回实例
     */
    Progress.fn.end = function () {
        if (this.status !== 'loading') {
            return;
        }
        var _this = this;
        this.stop();
        this.set(100);
        this.autoIncrease = false;
        setTimeout(function () {
            _this.ele.fadeOut({duration: 800, done: function () {
                _this.count = 0;
                _this.status = 'wait';
                _this.ele.remove();
                _this.trigger('end');
            }});
        }, 400);
        return this;
    };

    /**
     * 设置颜色。
     * @param {String} color 颜色可以是 hex 也可以是 rgb，如 `#ffffff` 或者 `#fff` 或者 `rgb(255,255,255)`
     * @return {Object} 返回实例
     */
    Progress.fn.setColor = function (color) {
        if (!color) {
            return;
        }
        function componentToHex(c) {
            var hex = c.toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        }

        function rgbToHex(rgb) {
            var r, g, b;
            var arr = rgb.match(/\((.*)\)/)[1].split(',');
            r = +arr[0];
            g = +arr[1];
            b = +arr[2];
            return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
        }

        function hexToRgb(hex) {
            // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function(m, r, g, b) {
                 return r + r + g + g + b + b;
            });

            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ?
                [parseInt(result[1], 16),
                parseInt(result[2], 16),
                parseInt(result[3], 16)].join(',')
            : null;
        }
        var rgb;
        var hex;
        if (color[0] === '#') {
            rgb = hexToRgb(color);
            hex = color;
        } else {
            rgb = color.match(/\((.*)\)/)[1];
            hex = rgbToHex(color);
        }
        this.color = hex;
        this.ele.find('.ck-progress-bar').css({background: hex, boxShadow: '0 0 10px 0 rgba(' + rgb + ',0.5)'});
        this.ele.find('.ck-progress-bar-inner').css({background: hex, boxShadow: '0 0 10px rgba(' + rgb + ',0.5)'});
        this.ele.find('.ck-progress-circle').css({borderBottomColor: hex, borderLeftColor:hex});
        this.trigger('setColor');
        return this;
    };

    /**
     * 监听事件
     * @param  {String}   name    事件的名称
     * @param  {Function} fn      事件的回调函数
     * @param  {Object}   context 可选的上下文
     * @return {Object}           返回实例
     */
    Progress.fn.on = function (name, fn, context) {
        if (!this.callbacks[name] || !this.callbacks[name].length) {
            this.callbacks[name] = [{fn: fn, context: context || this}];
        } else {
            this.callbacks[name].push({fn: fn, context: context || this});
        }
        return this;
    };

    /**
     * 触发事件
     * @param  {String} name 事件名称
     * @return {Object}      返回实例
     */
    Progress.fn.trigger = function (name) {
        if (!this.callbacks[name] || !this.callbacks[name].length) {
            return;
        } else {
            this.callbacks[name].forEach(function (obj) {
                obj.fn.call(obj.context);
            });
        }
        return this;
    };

    /**
     * Service 返回的对象
     * @type {Object}
     */
    var progress = {
        /**
         * 创建实例。该函数必须执行，对 progressBar 的操作必须在 ngProgressBar 实例中进行。
         * @return {Object} 返回Progress实例
         */
        createInstance: function () {
            var instance = new Progress();
            this.instances.push(instance);
            return instance;
        },
        /**
         * 实例堆栈
         * @type {Array}
         */
        instances: []
    };

    return progress;
});