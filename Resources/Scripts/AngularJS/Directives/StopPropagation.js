/**
 * @type            Directive
 * @usage           Attribute
 * @name            stopPropagation
 *
 * @description
 * Defines the 'stopPropagation' directive. This directive allows us to stop propagating an event.
 */
OfficeUI.directive('stopPropagation', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind(attr.stopPropagation, function (e) {
                e.stopPropagation();
            });
        }
    };
});