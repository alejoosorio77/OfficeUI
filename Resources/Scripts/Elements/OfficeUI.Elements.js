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
 * - Microsoft Internet Explorer        Version 11 and upwards - Microsoft Windows 8.1 (Update 1).
 * - Mozilla FireFox                    Version 36 and upwards - Microsoft Windows 8.1 (Update 1).
 * - Google Chrome                      Version 41 and upwards - Microsoft Windows 8.1 (Update 1).
 *
 * The following plugins and fixes are included in 'OfficeUI.Elements.js'.
 * - Buttons (Fix for Microsoft Internet Explorer).
 * - DropDown element (A DropDown control which matches the DropDown elements which are also used in Microsoft Office
 *                     User Applications).
 */
$(function() {
    /**
     * @type       Event Handler
     * @name       N.A.
     *
     * @notes
     * This function is executed whenever you click an a element inside an OfficeUI application which is marked with
     * the class 'button'.
     * The purpose of this Event Handler is to toggle a class named 'active-ie-fix' on the element being clicked.
     * This is needed for a bug which causes Internet Explorer to mis behave.
     *
     * @bug
     * In Internet Explorer (tested in version 11), you can have an anchor element which holds a child item.
     * See the example below:
     *
     * <a href="#">
     *  <img src="/Path/To/Image.png" alt="Image" />
     * </a>
     *
     * Let's view this element with the following CSS applied:
     *
     * a:active { background-color: red; }
     *
     * Now, when you click on the element, you would expect the element to have a red background, but in Internet
     * Explorer, the :active pseudo class does not fire for child elements, so what you'll basically have is the
     * following:
     * -    When you 'activate' the 'a' element, the background of the 'a' element is set to red, but not the background
     *      of any child elements.
     * -    When you 'activate' any of the child elements under the element on which the ':active' pseudo class is
     *      applied, the background does not change to red.
     *
     * In order to fix this, an additional class is added to the 'top-level' element, in this case, the anchor element
     * on the event 'mousedown'. On the event 'mouseup' the same class is removed again.
     * By doing this, we are able to style our element.
     *
     * The class which is being applied is 'active-ie-fix'.
     */
    $('#OfficeUI a.button').on('mousedown mouseup', function(e) {
        $(this).toggleClass('active-ie-fix');
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
        $.fn.selectedItem = ''; // Gets the text of the selected item.

        // Initialization logic.
        $(this).addClass('no-select'); // Adds a class that ensure that text-selection for this element is disabled.
        $(this).append('<i class="fa fa-sort-desc"></i>'); // Adds the arrow down on the right side.

        /**
         * @type        Function
         * @name        hasFocus
         *
         * @param       element     The element that you want to check for having focus.
         *
         * @returns     (boolean):  True if the element has focus, false otherwise.
         */
        var hasFocus = function(element) { return element.hasClass('focus'); };

        /**
         * @type        Function
         * @name        isActive
         *
         * @param       element     The element that you want to check for being active.
         *
         * @returns     (boolean):  True if the element is active, false otherwise.
         */
        var isActive = function(element) { return element.hasClass('active'); };

        /**
         * @type        Function
         * @name        isMenuOpened
         *
         * @param       element     The element that you want to check for having an opened menu.
         *
         * @returns     (boolean):  True if the menu of the DropDownElement is opened, false otherwise.
         */
        var isMenuOpened = function(element) { return element.hasClass('opened'); };

        $.fn.isMenuOpened = function() { return isMenuOpened($(this)); };

        /**
         * @type        Function
         * @name        Open
         *
         * @notes
         * When this function is executed, the menu item holding all the items is toggled, and it can have 2 different
         * states, opened or opened. A class is added or removed from the 'dropdownElement' that helps to find out if
         * the menu is opened or closed.
         */
        var Open = function(element) {
            $('.elements', element).show('slide', { direction: 'up' }, 100);
            $(element).addClass('opened').addClass('focus');
        }

        /**
         * @type        Function
         * @name        Open
         *
         * @notes
         * When this function is executed, the DropDown element is being closed.
         */
        $.fn.Close = function() {
            $('.elements', this).hide();
            this.removeClass('opened');

            // IE-Fix: Remove the class 'focus' from the dropdown element.
            $(this).removeClass('focus');
        }

        // When you hover on the element, add a class on the 'i' and on the 'input' element to make it visible that
        // the element has focus. When we do leave the element, remove the classes, but only when the input element
        // does not have focus. We don't wan the element to change styles as long as we have focus on the input element.
        this.hover(function() {
            $(this).addClass('focus');
        }, function() {
            if (!$(this).is(':focus') && !isMenuOpened($(this))) {
                $(this).removeClass('focus');
            }
        });

        // When we lose focus on the dropdown element, remove all the classes that causes a style change.
        // By removing those classes, the style is reverted, meaning no special colors are visible anymore.
        this.focusout(function() {
            $(this).removeClass('active').removeClass('focus');
        });

        // When you click on the arrow down icon, it means that either the menu should be showed or hidden.
        // We apply the correct styling by toggling a class named 'opened'.
        $('i', this).click(function(e) {
            var shouldClose = isMenuOpened($(this).parent()); // Provides a boolean that defines whether or not the menu should be closed.

            // Hide all the open dropdown elements.
            $('#OfficeUI .dropdown').each(function(index ,item) {
                if (isMenuOpened($(item))) { $(item).Close(); }
            });

            // Based on the variable that defines if the menu should be closed or opened, execute the corresponding action.
            if (shouldClose) {
                if (isMenuOpened($(this).parent())) { $(this).parent().Close(); }
            } else { Open($(this).parent()); }

            e.stopPropagation(); // Make sure to stop propagating the event.
        })

        // When you click on an item in the dropdown, then the item must be showed in the box of the DropDown.
        // This is to indicate that the item has been selected.
        //
        // Note: An Internet Explorer Fix is required for this element.
        //
        //          When this event handler is executed, in every browser, the class 'focus' is removed of the
        //          dropdown element, but for some reason, Internet Explorer doesn't clear that class, so we'll be
        //          clearing it manually through a JavaScript call.
        $('.elements li', this).click(function() {
            var selectedLiText = $(this).html();
            $('.legend', $(this).parent().parent()).html(selectedLiText);

            $.fn.selectedItem = selectedLiText; // Set a property to we know the item which has been selected.

            // Check if there's an attribute called data-on-change.
            // If that's attribute correct, check the value in it, try to transform it into a JavaScript function
            // and execute it.
            var attribute = $(this).parent().parent().attr('data-on-change');
            if (typeof attribute !== 'undefined' && attribute != '') { eval(attribute); }

            // Close the dropdown element.
            $(this).parent().parent().Close();

            // IE-Fix: Remove the class 'focus' from the dropdown element.
            $(this).removeClass('focus');
        });

        return this; // Return this object to ensure that methods can be chained.
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

    /**
     * @type        DOM Manipulation
     * @name        N.A.
     *
     * @notes
     * This method will add a class on every button to ensure that text-selection on button elements cannot be done.
     */
    $('#OfficeUI .button').addClass('no-select');

    /**
     * @type        Function
     * @name        N.A.
     *
     * @notes
     * When you click somewhere on the window, it's necessary to close all open dropdown elements.
     * This is being done by the method below.
     */
    $(window).on('click', function(e) {
        $('#OfficeUI .dropdown').each(function(index, item) {
            if ($(item).isMenuOpened()) { $(item).Close(); }
        });
    });
});