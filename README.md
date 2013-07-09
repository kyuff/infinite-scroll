### Infinite Scroller for AngularJS

Module that allows for infinite scrolling of an element.

It works by recentering once the scrolling gets to a 20% bounds of it's size.

This way, the module will not add more elements to the HTML as you scroll.

### Example

Setup your Application and depend on kyuffScroll
```javascript
    var App = angular.module("App", ["kyuffScroll"]);
    App.controller("Ctrl", function Ctrl() {
        var today = new Date(),
            miliToDayFactor = 1000*60*60*24;
        // today is offset = 0 and offset in days
        this.getDate = function (offset) {
            return new Date(today.getTime() + offset*miliToDayFactor)
        }
    });
```
In your HTML you can use the kyuff-scroll directive and pass in the size of the scroller.
The scroller will create elements in the positive and negative range and center around zero.
You can use the *isOffset* scope variable inside the scroller element.
```html
<div ng-controller="Ctrl as ctrl">
    <div id="scroller" class="content" kyuff-scroll="50">
        {{ ctrl.getDate(isOffset) | date }}
    </div>
</div>
```

Add some styles to make the scroller have a scrollbar
```css
        div.content {
            padding: 50px;
            margin: 50px;
            max-height: 400px;
            width: 150px;
            overflow-y: scroll;
            border: 1px solid black;
            border-radius: 5px;
            text-align: center;
        }
```
For webkit you can even hide the scrollbar
```css
        div.content::-webkit-scrollbar {
            width: 0 !important
        }
```
