/**
 * @filename:       OfficeUI.Core.js
 * @Author:         Kevin De Coninck
 * @version:        1.0.0
 * @date:           19/03/2015
 *
 * @notes:
 * Defines the necessary core functionality to work with an OfficeUI application.
 * By implementing this file, you get a variety of core functionalities which can be used throughout your application.
 * The following functions are exposed by the core API:
 *  - Registering events. (Used for binding functions to AngularJS elements).
 *  - Search for any registered events. (Used for searching bound functions to AngularJS elements).
 *  - Cookie management (set a cookie and retrieve the value of a given cookie).
 *  - Exception management (throw exceptions to the browser's console window to make debugging more easier).
 *  - Common helper functions that make it more easier to work with JavaScript, jQuery and AngularJS. *
 */

    /**
     * @type                Namespace
     * @name                OfficeUICore
     *
     * @description         Defines the namespace 'OfficeUICore'. This namespace does contain various functions and
     *                      methods to make the development of applications in AngularJS, jQuery and JavaScript
     *                      more easy.
     *
     * @example
     * When you want to call a given function from withing this namespace, your need to write the namespace and then
     * the name of your function as defined in the example below:
     *
     * OfficeUICore.[functionName](parameters);
     */
    var OfficeUICore = {

        /**
         * @type            Function
         * @name            IsNull
         *
         * @param           object          The object to check against null.
         * @returns         {boolean}       True if the given object is null, false otherwise.
         *
         * @description
         * Checks if a given object is null, or in JavaScript, 'undefined'.
         *
         * @example
         * When you have an object that might be null, you can check if with the following function:
         *
         * OfficeUICore.IsNull(myObject);
         */
        IsNull: function(object) {
            if (typeof object === 'undefined' || object == '') { return true; }
            return false;
        },

        eventCollection: [], // Provides an array in which all the registered events will be saved.

        /**
         * @type            Function
         * @name            Bind
         *
         * @param           element         The element to which to bind a specific event.
         * @param           handler         The handler to bind to the event.
         * @param           action          The action to execute when the event is being executed.
         *
         * @description
         * Binds a given event handler to a specific event.
         * This method allows you to, for example bind a click event on an element that will emit a message to the
         * console window.
         *
         * @example
         * When you have an element 'icoApplication', you want a message to be emitted to the console window using
         * console.log(). This message should say 'I have clicked the icon'.
         * In order to execute that function, the following example is needed:
         *
         * OfficeUICore.Bind('#icoApplication', 'click', function(e) {
         *    console.log('I have clicked the icon.');
         * });
         */
        Bind: function(element, handler, action) {
            // Push the event handler to the array 'eventCollection'.
            // This is required, since it's in this array that a search will be performed to see if the event has
            // a registered event.
            OfficeUICore.eventCollection.push({
                element: element,
                handler: handler,
                action: action
            });
        },

        /**
         * @type            Function
         * @name            SearchEvent
         *
         * @param           selector        The selector to search for the element that should have a registered
         *                                  event.
         *
         * @description
         * Search if a given element has an action bound to it.
         *
         * @example
         * When you have an item 'icoApplication', on which you've bound an action previously with the
         * 'bind(element, handler, action)' method, you can search if this element has any event by executing
         * the following code:
         *
         * OfficeUICore.SearchEvent('#icoApplication');
         */
        SearchEvent: function(selector) {
            // Search if an event is registered by looping over the array that holds all are events.
            // If an event is found, return this.
            var foundElements = $.grep(OfficeUICore.eventCollection, function(item) {
                return item.element == selector
            });

            // Return the correct element if there is any, otherwise, return null.
            if (!foundElements.length > 0) { return foundElements[0]; }

            return null;
        },

        /**
         * @type {{}}           Namespace
         * @name                StateManagement
         *
         * @description         Defines the namespace 'StateManagement'. This namespace is used to perform state
         *                      management. By state management, we do mean that it's possible to save certain values,
         *                      by, for example, reading and writing cookies.
         *
         * @example
         * When you want to call a given function from withing this namespace, your need to write the namespace and then
         * the name of your function as defined in the example below:
         * OfficeUICore.StateManagement.[functionName](parameters);
         */
        StateManagement: {

            /**
             * @type            Function
             * @name            SetCookie
             *
             * @param           cookieName          The name of the cookie to save.
             * @param           cookieValue         The value of the cookie to save.
             *
             * @description
             * Provides a way to save a cookie with a specific name and a specific value.
             * Since there's no expiration date to be passed to this function, the validation of the cookies is
             * limited to the session of the user.
             *
             * @example
             * When you want to save a cookie with the following parameters:
             * - Name:          OfficeUI
             * - Value:         Loaded
             * Then you need to execute the following code:
             *
             * OfficeUICore.StateManagement.SetCookie('OfficeUI', 'Loaded');
             */
            SetCookie: function(cookieName, cookieValue) {
                SetCookie(cookieName, cookieValue, null);
            },

            /**
             * @type            Function
             * @name            SetCookie
             *
             * @param           cookieName          The name of the cookie to save.
             * @param           cookieValue         The value that the cookie should have.
             * @param           cookieExpiration    The expiration time of the cookie. The value entered here is the
             *                                      amount of time which will pass before the cookie is invalid.
             *                                      This value needs to be specified in days.
             *
             * @description
             * Provides a way to save a cookie with a specific name, value and expiration time.
             *
             * @example
             * When you want to save a cookie with the following parameters:
             * - Name:          OfficeUI
             * - Value:         Loaded
             * - Expiration:    1 month
             * Then you need to execute the following code:
             *
             * OfficeUICore.StateManagement.SetCookie('OfficeUI', 'Loaded', 30);
             */
            SetCookie: function(cookieName, cookieValue, cookieExpiration) {
                var date = new Date();
                var expired = null;

                // Only set an expiration date when it's required.
                if (!OfficeUICore.IsNull(cookieExpiration)) {
                    date.setTime(date.getTime() + (cookieExpiration * 24 * 60 * 60 * 1000));
                    expired = "expires=" + date.toUTCString();
                }

                document.cookie = cookieName + "=" + cookieValue + "; " + expired;
            },

            /**
             * @type            Function
             * @name            GetCookie
             *
             * @param           cookieName          The name of the cookie to retrieve.
             * @returns         {string}            The value of the cookie.
             *
             * @description
             * Provides a way to get the value of a cookie with a specific name.
             *
             * @example
             * When you have a cookie named 'OfficeUI', from which you want to load the value, it can be done
             * with the following code:
             *
             * OfficeUICore.StateManagement.GetCookie('OfficeUI');
             */
            GetCookie: function(cookieName) {
                var name = cookieName + "=";
                var ca = document.cookie.split(';');

                for(var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0)==' ') c = c.substring(1);
                    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
                }
                return "";
            }
        },

        /**
         * @type {{}}           Namespace
         * @name                Exceptions
         *
         * @description         Defines the namespace 'Exceptions'. This namespace is mainly used to throw exceptions
         *                      wich are be default throwed to the console.
         *
         * @example
         * When you want to call a given function from withing this namespace, your need to write the namespace and then
         * the name of your function as defined in the example below:
         * OfficeUICore.Exceptions.[functionName](parameters);
         */
        Exceptions: {

            /**
             * @type            Function
             * @name            ThrowException
             *
             * @param           exceptionType       The type of the exception to throw. This is just a string that
             *                                      defines the type of the exception.
             * @param           message             The message to pass to this exception.
             *
             * @description
             * Writes a message to the console window, which is formatted in the following way:
             * [{exceptionType}]: {message}
             *
             * @example
             * When you do want to throw an 'OfficeUIException', with the following message:
             * 'An error has occurred'. You can use the following code:
             *
             * OfficeUICore.Exceptions.ThrowException('OfficeUIException', 'An error has occured.');
             */
            ThrowException: function(exceptionType, message) {
                return console.error('[' + exceptionType + ']: ' + message);
            },

            /**
             * @type            Function
             * @name            OfficeUIInvalidConfigurationException
             *
             * @param           message         The message to pass to this exception.
             *
             * @description
             * Writes a new exception of type 'OfficeUIInvalidConfigurationException'.
             *
             * @remarks
             * This type of exception should be throwed, when there's anything wrong with a configuration file.
             *
             * @example
             * When you want to write an exception of type 'OfficeUIInvalidConfigurationException' with the following
             * message: 'An error has occurred', the following code can be used:
             *
             * OfficeUICore.Exceptions.OfficeUIInvalidConfigurationException('An error has occurred.');
             */
            OfficeUIInvalidConfigurationException: function(message) {
                OfficeUICore.Exceptions.ThrowException('OfficeUIInvalidConfigurationException', message);
            },

            /**
             * @type            Function
             * @name            OfficeUIConfigurationException
             *
             * @param           message         The message to pass to this exception.
             *
             * @description
             * Writes a new exception of type 'OfficeUIConfigurationException'.
             *
             * @remarks
             * This type of exception should be throwed, when a configuration file could not be accessed.
             *
             * @example
             * When you want to write an exception of type 'OfficeUIConfigurationException' with the following
             * message: 'An error has occurred', the following code can be used:
             *
             * OfficeUICore.Exceptions.OfficeUIConfigurationException('An error has occurred.');
             */
            OfficeUIConfigurationException: function(message) {
                OfficeUICore.Exceptions.ThrowException('OfficeUIConfigurationException', message);
            },

            /**
             * @type            Function
             * @name            officeUILoadingException
             *
             * @param           message         The message to pass to this exception.
             *
             * @description
             * Writes a new exception of type 'OfficeUILoadingException'.
             *
             * @example
             * When you want to write an exception of type 'OfficeUILoadingException', with the following message:
             * 'An error has occurred'.
             * The following code can be used:
             *
             * OfficeUICore.Exceptions.OfficeUILoadingException('An error has occurred.');
             */
            OfficeUILoadingException: function(message) {
                OfficeUICore.Exceptions.ThrowException('OfficeUILoadingException', message);
            },

            /**
             * @type            Function
             * @name            OfficeUICssInjectorServiceException
             *
             * @param           message         The message to pass to this exception.
             *
             * @description
             * Writes a new exception of type 'OfficeUICssInjectorServiceException'.
             *
             * @example
             * When you want to write an exception of type 'OfficeUICssInjectorServiceException', with the following message:
             * 'An error has occurred'.
             * The following code can be used:
             *
             * OfficeUICore.Exceptions.OfficeUICssInjectorServiceException('An error has occurred.');
             */
            OfficeUICssInjectorServiceException: function(message) {
                OfficeUICore.Exceptions.ThrowException('OfficeUICssInjectorServiceException', message);
            },

            /**
             * @type            Function
             * @name            OfficeUIElementNotFoundException
             *
             * @param           message         The message to pass to this exception.
             *
             * @description
             * Writes a new exception of type 'OfficeUIElementNotFoundException'.
             *
             * @example
             * When you want to write an exception of type 'OfficeUIElementNotFoundException', with the following message:
             * 'An error has occurred'.
             * The following code can be used:
             *
             * OfficeUICore.Exceptions.OfficeUIElementNotFoundException('An error has occurred.');
             */
            OfficeUIElementNotFoundException: function(message) {
                OfficeUICore.Exceptions.ThrowException('OfficeUIElementNotFoundException', message);
            },

            /**
             * @type            Function
             * @name            OfficeUIServiceException
             *
             * @param           message         The message to pass to this exception.
             *
             * @description
             * Writes a new exception of type 'OfficeUIServiceException'.
             *
             * @example
             * When you want to write an exception of type 'OfficeUIServiceException', with the following message:
             * 'An error has occurred'.
             * The following code can be used:
             *
             * OfficeUICore.Exceptions.OfficeUIServiceException('An error has occurred.');
             */
            OfficeUIServiceException: function(message) {
                OfficeUICore.Exceptions.ThrowException('OfficeUIServiceException', message);
            }
        }
    };