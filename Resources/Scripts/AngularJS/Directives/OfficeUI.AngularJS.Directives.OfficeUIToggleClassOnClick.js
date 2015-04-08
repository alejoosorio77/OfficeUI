/**
 * @type            Directive
 * @usage           Attribute
 * @name            officeuiToggleClassOnClick
 *
 * @description
 * Defines the 'officeuiToggleClassOnClick' directive. This directive allows us to toggle a specific class when you click
 * on a certain element.
 * Whenever you click on the element, the class provided as an attribute will be added to the element.
 *
 * @example
 * Imagine that we have the following HTML code:
 *
 * <div class="icons no-select">
 *     <img class="application-icon" src="#" />
 * </div>
 *
 * Now, we want to add a class 'active', when you click on the icon. But when you leave the icon again, the class
 * 'active' should be removed.
 * Therefore, the following code van be used:
 *
 * <div class="icons no-select">
 *     <img class="application-icon" src="#" data-officeui-toggle-class-on-click="active" />
 * </div>
 *
 * @remarks
 * We're also binding the event handler 'mouseout' on the element. This is, because when you click on the element
 * and then you move away your mouse, the class 'active-ie-fix' doesn't get removed. It's only get removed if you
 * click on the element again. Now the class is also removed when your mouse leave the element.
 */
OfficeUI.directive('officeuiToggleClassOnClick', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            var toggleClass = attributes['officeuiToggleClassOnClick'];

            // Bind the mousedown and mouseup event handlers.
            element.bind('mousedown mouseup', function() {
                element.toggleClass(toggleClass);
            });

            // Bind the 'mouseout' event handler.
            element.bind('mouseout', function() {
                if (element.hasClass(toggleClass)) { element.removeClass(toggleClass); }
            })
        }
    }
});