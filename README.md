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

### `ck-input` directive

The `ck-input` directive is design to work in `<input />` tag. Put `ck-input` in `<input />` tag as an attribute, and add `desc` to the tag. `desc` is optional. Example code like this:

```
<input type="text" ck-input ng-model="welcome" desc="'This is welcome text.'" ng-minlength="6">
```

### `ck-ripple` directive

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
- [ ] modal with custom callback
- [ ] progress bar
- [ ] notify
- [ ] message box