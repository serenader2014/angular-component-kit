# Angular Component Kit

This is an angular.js common component kit. The main idea of this project is to provide a common and easy use angular component kit. 

**Demo can be found at: [serenader2014.github.io/angular-component-kit/](http://serenader2014.github.io/angular-component-kit/)**

## How to use

Clone this repo, and copy the `build/angular-component-kit.min.css` and `build/angular=component-kit.min.js` to your project's directory, and include them to your html file. Finally you should add `ngComponentKit` to your angular app's dependencies, example codes:

```javascript
var app = angular.module('myApp', ['ngComponentKit', 'other dependencies']);

...
```

## Detail component list

###  `ck-input` directive

The `ck-input` directive is design to work in `<input />` tag. Put `ck-input` in `<input />` tag as an attribute, and add `desc` to the tag. `desc` is optional. Example code like this:

```
<input type="text" ck-input ng-model="welcome" desc="'This is welcome text.'" ng-minlength="6">
```

----

###  `ck-ripple` directive

The `ck-ripple` directive is design to work in `<button></button>` tag. Put `ck-ripple` in `<button></button>` tag as an attribute, and add some button's class.

The angular component kit pre-define a set of button style, you can select your favourite color, or your favourite style, like raised button or rounded button. What's more, you can customize the ripple effect's color. Example code:

```html
<button class="ck-btn" ck-ripple="black">button</button>
<button class="ck-btn">button</button>
<button class="ck-btn ck-btn-primary" ck-ripple="blue">button</button>
<button class="ck-btn ck-btn-raised ck-btn-blue" ck-ripple>button</button>
<button class="ck-btn ck-btn-green">button</button>
<button class="ck-btn ck-btn-raised ck-btn-round ck-btn-red" ck-ripple>R</button>
```

----

###  `ck-modal` directive

```html
<ck-modal name="'modal'" show="showModal1" close="closeModal(scope, close)" confirm="confirm(scope, close)" >
    <h3>Modal with custom callback</h3>
    <input name="input" type="text" ng-model="data.testModal" ck-input desc="'Testing scope in modal'">
</ck-modal>
```

Custom close/confirm callback is optional.

----


###  `ckProgressBar` service

The `ckProgressBar` provides a global progress loader. It provides several apis, which you can easily control how the progress bar is performed.

#### Methods:

- `createInstance()`: return a progress bar instance.

#### Properties:

-  `instances`: an array stores all the progress bar instances.

#### ProgressBar Instance Methods:

- `start()`: start counting the progress.
- `increase(autoIncrease: Boolean)`: increase the progress percentage. Accept one argument, when the argument is set to true, the progress bar will increase itself automatically.
- `end()`: finish the progress bar, and hide itself.
- `set(percent)`: setting progress bar's percentage.
- `stop()`: stop increase the progress bar.
- `setColor(color)`: setting progress bar's color. Accept hex value or rgb value.
- `on(eventName, fn, context)`: bind an event handler to the event.
- `trigger(name)`: fire the event.

#### ProgressBar Instance events:

- `start`: will fire when the progress bar is started.
- `increase`: will fire when the progress bar is increase its percentage.
- `progress`: will fire when setting the progress bar's percentage.
- `stop`: will fire when the progress bar is stop.
- `end`: will fire when the progress bar's increasement is complete.
- `setColor`: will fire when setting the progress bar's color.

#### Intergrate with $http interceptors

The `ckProgressBar` service can be easily intergrate with angular's build-in $http interceptors, which will show a progress bar when a $http request is made, and automatically hide the progress bar when the request is responsed.


```javascript
app.factory('networkProgress', function ($rootScope, ckProgressBar) {
    var url = [];
    var progress = ckProgressBar.createInstance();

    $rootScope.$watch('loadingItem', function (value) {
        if (value && value.length) {
            var flag = false;
            angular.forEach(value, function (item) {
                angular.forEach(url, function (u) {
                    var regexp = new RegExp(u);
                    if (regexp.test(item)) {
                        flag = true;
                    }
                });
            });
            if (!flag) {
                progress.start();
                progress.increase(true);
            }
        } else {
            progress.end();
        }
    }, true);

    return {
        filter: function (urls) {
            angular.forEach(urls, function (u) {
                if (url.indexOf(u) === -1) {
                    url.push(u);
                }
            });
        },
        instance: function () {
            return progress;
        }
    };
});

app.factory('httpInject', function ($rootScope) {
    return {
        request: function (request) {
            $rootScope.loadingItem.push(request.url);
            return request;
        },
        response: function (response) {
            $rootScope.loadingItem.splice($rootScope.loadingItem.indexOf(response.config.url), 1);
            return response;
        },
        requestError: function(err) {
            console.log('request' + err);
            return err;
        },
        responseError: function (response) {
            $rootScope.loadingItem.splice($rootScope.loadingItem.indexOf(response.config.url), 1);
            return response;
        }
    };
});

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('httpInject');
});
```

----

**`ckNotify` service**

`ckNotify` service can be used to show a simple notification. It provides two kinds of usage:

```javascript
app.controller('ctrl', function ($scope, ckNotify) {
    // passing an object as configuration
    ckNotify({
        type: 'success',         // notification type, available types: 
                                 // ['normal', 'success', 'error', 'warning']
        msg: 'msg content',      // notification message content
        position: {
            top: true,           // 'top' and 'bottom' can not use together
            right: true          // while 'left' and 'right' can use together,
                                 // it will appear in the center
        },
        autoHide: false,         // determine the notification to hide itself or not
        callback: function () {} // a custom close callback is supported
    });

    // or use a shortcut way:
    ckNotify.success('message here');
    ckNotify.error('message here');
});
```

## How to develop

After cloning this repo, you shold install gulp first(Assume that you've already install node.js in your computer).

```bash
sudo npm install -g gulp
```

In the project's directory, run commands like below:

```bash
npm install #install the nodejs package
gulp init #get the angular and jquery package
gulp #run the developing enviroment
```

After that, you can now edit the code in `src` folder, this folder contain all of the component kit's code. Gulp will automatically change the code in `dist` folder when you changed the code in `src` folder, and will tell the browser to refresh the page(If you've already installed the livereload plugin).

## Current progress

This project is in very early stage, api can be unstable. Use at your own risk.

## Planned component

- [x] input directive with description
- [x] button with ripple effect
- [x] modal with custom callback
- [x] progress bar
- [x] notify
- [ ] message box