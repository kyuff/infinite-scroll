# Infinite Scroller for AngularJS

Module that allows for infinite scrolling of an element.

# Example

Setup your Application and depend on kyuffScroll
```javascript
    var App = angular.module("App", ["kyuffScroll"]);
    App.controller("Ctrl", function Ctrl() {
        var today = new Date(),
            miliToSecondFactor = 1000*60*60*24;
        // today is offset = 0 and offset in days
        this.getDate = function (offset) {
            return new Date(today.getTime() + offset*miliToSecondFactor)
        }
    });
```
In your HTML you can use the kyuff-scroll directive and pass in the size of the scroller.
The scroller will create elements in the positive and negative range and center around zero.
```html
<div ng-controller="Ctrl as ctrl">
    <div id="scroller" class="content" kyuff-scroll="50">
        {{ ctrl.getDate(isOffset) | date }}
    </div>
</div>
```
