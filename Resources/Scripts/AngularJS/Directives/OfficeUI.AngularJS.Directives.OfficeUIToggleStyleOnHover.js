/**
 * @type            Directive
 * @usage           Attribute
 * @name            cuToggleStyleAttributeOnHover
 *
 * @description
 * Defines the 'officeuiToggleStyleAttributeOnHover' directive. This directive allows us to add or remove a specific
 * style on an element when we hover on it.
 *
 * @example
 * Imagine that we do have the following Html:
 *
 * <li class="tab contextual-tab label">
 *     <span>{{tab.Label}}</span>
 * </li>
 *
 * Now, let's say that when we hover on the element, we want to have a red background-color.
 * Therefore, the code above can be adapted like the following:
 *
 * <li class="tab contextual-tab label" data-cu-toggle-style-attribute-on-hover='{"background-color": "red"}'>
 *     <span>{{tab.Label}}</span>
 * </li>
 *
 * When you hover on the element, the background property will turn red.
 *
 * @remarks
 * The string passed to this attribute needs to be a valid Json string.
 * If it isn't a valid Json string, an error will be throwed.
 * The added class will only be removed when the element doesn't have a class named 'active'.
 */
OfficeUI.directive('cuToggleStyleAttributeOnHover', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attributes){
            var toggleStyleAttribute = attributes['cuToggleStyleAttributeOnHover'];
            var toggleStyleAttributes = JSON.parse(toggleStyleAttribute)

            // Bind the mouse leave event handler.
            element.bind('mouseleave', function() {
                $.each(toggleStyleAttributes, function(key, value){
                    if (!element.hasClass('active')) {
                        element.css(key, 'inherit');
                    }
                });
            });

            // Bind the mouse enter event handler.
            element.bind('mouseenter', function() {
                $.each(toggleStyleAttributes, function(key, value){
                    element.css(key, value);
                });
            });
        }
    }
});