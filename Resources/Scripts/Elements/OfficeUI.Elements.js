/**
 * @filename       OfficeUI.Elements.js
 * @Author         Kevin De Coninck
 * @version        1.0.0
 * @date           10/03/2016
 *
 * @notes
 * Defines the script files that's required for various controls for the OfficeUI controls.
 * Those script files does modify page elements to ensure that they work correctly in all modern browsers.
 * The following browsers have been tested:
 * - Microsoft Internet Explorer
 * - Mozilla FireFox
 * - Google Chrome
 */
$(function() {
    /**
     * @type       Event Handler
     * @name       N.A.
     *
     * @notes
     * This function is executed whenever you click an a element inside an OfficeUI application which is marked with
     * the class 'button'.
     * The purpose of this Event Handler is to toggle a class named 'ie-fix' on the element being clicked.
     * This is needed for a bug which causes Internet Explorer to mis behave.
     * When in Internet Explorer, you have an anchor with another element in it, and you click the element inside the
     * anchor, then the pseudo class ':active', which normally indicates that a link is being active does not bubble.
     * Therefore, this plugin has been written so that even when you click an element inside an anchor, the anchor
     * itself will be decorated with a class so that it can be styled. In the case of this plugin, the anchor is being
     * marked with the class 'ie-fix'.
     */
    $('#OfficeUI a.button').on('mousedown mouseup', function(e) {
        $(this).toggleClass('ie-fix');
    });

    /**
     * @type            Plugin
     * @name            OfficeUIDropdown
     *
     * @notes
     * This plugin makes it possible to transform a specific element into an OfficeUI DropDown element. This is done by
     * adding elements and other information.
     */
    $.fn.OfficeUIDropdown = function() {
        var dropdownElement = $(this); // Gets the element that should be transformed.

        $(dropdownElement).append('<i class="fa fa-sort-desc"></i>'); // Adds the arrow down on the right side.

        // When you click on the input element in the dropdown, add a class 'active' to the down arrow and also to the
        // input element. The input element is strictly not needed, but should is placed in order to be consistent
        // throughout the app.
        $('input', dropdownElement).click(function() {
            $('i', dropdownElement).addClass('active');
        });

        // When you hover on the element, add a class on the 'i' and on the 'input' element to make it visible that
        // the element has focus. When we do leave the element, remove the classes, but only when the input element
        // does not have focus. We don't wan the element to change styles as long as we have focus on the input element.
        $(dropdownElement).hover(function() {
            $('input', dropdownElement).addClass('focus');
            $('i', dropdownElement).addClass('focus');
        }, function() {
            if (!$('input', this).is(':focus')) {
                $('input', dropdownElement).removeClass('focus');
                $('i', dropdownElement).removeClass('focus');
            }
        });

        // When we lose focus on the dropdown element, remove all the classes that causes a style change.
        // By removing those classes, the style is reverted, meaning no special colors are visible anymore.
        $(dropdownElement).focusout(function() {
            $('input', dropdownElement).removeClass('focus')
            $('i', dropdownElement).removeClass('focus').removeClass('active');
        })
    }

    /**
     * @type        DOM Manipulation.
     * @name        N.A.
     *
     * @notes
     * This call will transform every element with a class 'dropdown' which is placed inside a container with id
     * 'OfficeUI' into an OfficeUI DropDown.
     */
    $('#OfficeUI .dropdown').OfficeUIDropdown();
});