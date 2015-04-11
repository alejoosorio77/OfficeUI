/**
 * @type            Directive
 * @usage           Attribute
 * @name            officeuiTooltip
 *
 * @description
 * Defines the 'officeuiTooltip' directive. This directive allows us to show a tooltip for a specific element.
 */
OfficeUI.directive('officeuiTooltip', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attributes) {
            element.bind("mouseenter", function (e) {
                if (!element.hasClass('disabled')) {
                    var tooltipElement = $('.tooltip', element.parent());

                    var tooltipTimeout = setTimeout(function () {
                        $(tooltipElement).show();
                    }, 1000);

                    element.bind("mouseleave", function (e) {
                        clearTimeout(tooltipTimeout);

                        $.fn.OfficeUI.waitHandleHideTooltip = setTimeout(function () {
                            $(tooltipElement).hide();
                        }, 500);
                    });
                }
            });
        }
    };
});