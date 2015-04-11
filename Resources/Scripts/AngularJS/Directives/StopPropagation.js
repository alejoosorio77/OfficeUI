/**
 * @type            Directive
 * @usage           Attribute
 * @name            officeuiStopPropagation
 *
 * @description
 * Defines the 'officeuiStopPropagation' directive. This directive allows us to stop propagating an event.
 */
OfficeUI.directive('officeuiStopPropagation', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind(attr.officeuiStopPropagation, function (e) {
                e.stopPropagation();
            });
        }
    };
});