;(function(){

'use strict';

angular.module('ngComponentKitTmpl', []).run(['$templateCache', function($templateCache) {

  $templateCache.put('notification/notification.html', '<div class="ck-notification ck-{{type}}" ng-style="style"><span>{{msg}}</span> <button class="ck-btn" ck-ripple ng-click="close()">Close</button></div>');

  $templateCache.put('modal/modal.html', '<div tabindex="-1" ng-class="{active: active}" ng-blur="blur()" ng-focus="focus()" ng-show="show" class="ck-modal" ck-drag=".ck-modal-head"><div class="ck-modal-head">{{title}}</div><div class="ck-modal-body" ng-transclude></div><div class="ck-modal-foot"><button ng-click="ok()" class="ck-btn ck-btn-blue" ck-ripple>Comfirm</button> <button ng-click="off($event)" class="ck-btn" ck-ripple="black">Close</button></div></div>');

}]);

})();