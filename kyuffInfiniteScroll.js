(function () {
    'use strict';
    var BOUNDS_REACHED_EVENT = "KyuffScrollOffsetMoved",
        Module = angular.module("kyuffScroll", []);

    /**
     * Decides where the element is in the bounds. Bounds are defined as 20% of the
     * scrolling height of the element.
     * @param element - the scroll element
     * @returns {number} -1, 0, 1 matching top bound, between and bottom bound
     */
    function hasReachedBounds(element) {
        var completeHeight = element.scrollHeight,
            boundSize = (completeHeight / 5),
            top = element.scrollTop,
            bottom = top + element.clientHeight,
            topInBounds = top < boundSize,
            bottomInBounds = (completeHeight - boundSize ) < bottom;
        if (topInBounds || bottomInBounds) {
            return topInBounds ? -1 : 1;
        }
        return 0;
    }

    /**
     * Polyfill for element.firstElementChild
     * @param parent node
     * @returns the first non-text element or null
     */
    function getFirstElementChild(parent) {
        // Not supported in old IE
        if (parent.firstElementChild) {
            return parent.firstElementChild;
        }
        var node = parent.firstChild,
            firstElementChild = null;

        for (; node; node = node.nextSibling) {
            if (node.nodeType === 1) {
                firstElementChild = node;
                break;
            }
        }
        return null;
    }

    Module.directive("kyuffScroll", function () {
        var canvas = [],
            center = null,
            scrollHeight = 0;

        function centerScrollArea(element) {
            var heightHiddenInScroll = element.scrollTop + element.offsetTop,
                topElement = getFirstElementChild(element),
                found = false;
            // locate the top element
            while (!found || topElement == null) {
                if (topElement.offsetTop >= heightHiddenInScroll) {
                    found = true;
                } else {
                    topElement = topElement.nextSibling;
                }
            }
            if (topElement != null) {
                var topScope = angular.element(topElement).scope(),
                    centerScope = angular.element(center).scope(),
                    t = Math.abs(topScope.isOffset),
                    c = Math.abs(centerScope.isOffset),
                    newOffset = Math.max(t, c) - Math.min(t, c);
                center[0].parentNode.scrollTop = center[0].offsetTop - center[0].parentNode.offsetTop;
                return newOffset;
            }
            return 0;
        }

        function linkFn(scope, elm, attr) {
            function onScroll(event) {
                // -1 , 0 , 1
                var boundsReached = hasReachedBounds(elm[0]);
                if (boundsReached) {
                    var offset = centerScrollArea(elm[0]);
                    scope.$apply(function () {
                        scope.$broadcast(BOUNDS_REACHED_EVENT, boundsReached * offset);
                    });
                }
            }

            elm.bind("scroll", onScroll);
        }

        function controller($scope, $attrs) {

            scrollHeight = $attrs.kyuffScroll;
            for (var i = -scrollHeight; i < scrollHeight; i++) {
                canvas.push({ p: i, element: null});
            }
            $scope.__infiniteScrollSizer = canvas;

            $scope.__infiniteScrollRegister = function (i, el) {
                canvas[i].element = el;
                if (canvas[i].p === 0) {
                    center = el;
                }
                // Check if all children have called home
                if ((i + 1) === canvas.length) {
                    canvas[scrollHeight].element[0].scrollIntoView(true);
                }
                return canvas[i].p;
            }

        }

        return {
            controller: ['$scope', '$attrs', controller],
            scope: true,
            transclude: true,
            template: '<div ng-repeat="infinitePoint in __infiniteScrollSizer"' +
                '           kyuff-scroll-register-element="infinitePoint.p"' +
                '           class="kyuff-scroll-element">' +
                '        <div ng-transclude></div></div>',
            link: linkFn
        }
    });
    Module.directive("kyuffScrollRegisterElement", function () {
        return function (scope, elm, attr) {
            scope.isOffset = scope.__infiniteScrollRegister(scope.$index, elm);
            scope.$on(BOUNDS_REACHED_EVENT, function (event, delta) {
                scope.isOffset = scope.isOffset + delta;
            });
        }
    });
})();