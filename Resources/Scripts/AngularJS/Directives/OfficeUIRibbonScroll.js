/**
 * @type            Directive
 * @usage           Attribute
 * @name            officeuiRibbonScroll
 *
 * @description
 * Defines the 'officeuiRibbonScroll' directive. This directive allows us to execute an AngularJS function when we're
 * scrolling on the element.
 *
 *
 * @remarks
 * This directive is implementing 'e.preventDefault()'. This does mean that default events are not executed anymore.
 * In this particular case, it's used to make sure that the page does not scroll when we scroll on the element which
 * has implemented this directive.
 */
OfficeUI.directive('officeuiRibbonScroll', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attributes){
            var scrollAttribute = attributes['officeuiRibbonScroll'];

            // Bind the mousewheel event handler.
            element.on('DOMMouseScroll mousewheel', function (e) {
                scope.$apply(function(self) {
                    scope.InitializeServiceCall('Ribbon', 'ribbonScroll', e.originalEvent);
                });

                // Prevent default actions from happening.
                e.preventDefault();
            });
        }
    }
});