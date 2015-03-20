/**
 * @filename:       OfficeUI.Core.js
 * @Author:         Kevin De Coninck
 * @version:        1.0.0
 * @date:           19/03/2015
 *
 * @notes:
 * Defines the necessary core functionality to work with an OfficeUI application.
 */
(function($) {
    $.fn.OfficeUICore = function (options) { console.log('demo'); return this; }

    var eventCollection = []; // Defines a private collection of registered events.

    /**
     * @type            Function
     * @name            bind
     *
     * @param element   The element to which to bind an event handler.
     * @param handler   The handler to bind to the event.
     * @param action    The action to execute when the event is being executed.
     *
     * @example
     * <div id="actionElement">Click Here</div>
     *
     * $.fn.OfficeUICore.bind('#actionElement', 'click', function() {
     *  console.log('You have clicked the element with id \'actionElement\'.');
     * });
     */
    $.fn.OfficeUICore.bind = function(element, handler, action) {
        eventCollection.push({
            element: element,
            handler: handler,
            action: action
        });
    };

    // Provides a way to search for an event for a given element.
    // Parameters:
    //      element:        The name of the element for which to search the event.

    /**
     * @type            Function
     * @name            searchEvent
     *
     * @param element   The element for which to search.
     */
    $.fn.OfficeUICore.searchEvent = function(element) {
        // Search if an event is registered by looping over the array that holds all are events.
        // If an event is found, return this.
        var foundElement = $.grep(eventCollection, function(item) {
            return item.element == '#' + element
        });

        // Return the correct element if there is any, otherwise, return null.
        if (foundElement.length != 0) {
            return foundElement[0];
        }

        return null;
    };

    return this;
}(jQuery));

/**
 * @type        Function
 * @name        setCookie
 *
 * @param       cookieName          The name of the cookie.
 * @param       cookieValue         The value of the cookie.
 * @param       cookieExpiration    The expiration, in days, that the cookie should be kept.
 *
 * @notes
 * Sets a cookie by specifying a name, a value and an expiration.
 */
function setCookie(cookieName, cookieValue, cookieExpiration)
{
    var date = new Date();
    var expired = null;

    date.setTime(date.getTime() + (cookieExpiration * 24 * 60 * 60 * 1000));
    expires = "expires=" + date.toUTCString();

    document.cookie = cookieName + "=" + cookieValue + "; " + cookieExpiration;
}

/**
 * @type        Function
 * @name        getCookie
 *
 * @param       cookieName      The name of the cookie.
 *
 * @notes
 * Get the value of a cookie based on it's name.
 */
function getCookie(cookieName) {
    var name = cookieName + "=";
    var ca = document.cookie.split(';');

    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}