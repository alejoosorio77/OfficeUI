/**
 * @filename:       OfficeUI.Elements.js
 * @Author:         Kevin De Coninck
 * @version:        1.0.0
 * @date:           10/03/2016
 *
 * @notes:
 * Defines the script files that's required for various controls for the OfficeUI controls.
 * Those script files does modify page elements to ensure that they work correctly in all modern browsers.
 * The following browsers have been tested:
 * - Microsoft Internet Explorer
 * - Mozilla FireFox
 * - Google Chrome
 */
$(function() {
    /**
     * @type:       Event Handler
     * @name:       N.A.
     *
     * @notes:
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
        $(this).addClass('ie-fix');
    });
});