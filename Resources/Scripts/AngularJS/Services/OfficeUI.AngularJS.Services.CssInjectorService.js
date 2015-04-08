/**
 * @type            Service
 * @name            CssInjectorService
 *
 * @description
 * Provides a service which enabled the end user to dynamically attach css files to the header of your HTML document.
 * This service does return a promise, so that does mean that we can wait until the Stylesheets are loaded and
 * injected into the HTML.
 */
OfficeUI.factory('CssInjectorService', ['$q', function($q) {
    var cssInjectorServiceObject = { }; // Defines the object that needs to be returned by the service.

    /**
     * @type                Function
     * @name                createLink
     *
     * @description
     * Returns a 'HtmlElement' which is a 'link' with various default properties.
     * The default properties are:
     * - rel:       stylesheet
     * - type:      text/css
     *
     * @param               id:         The id of the element to return.
     * @param               url:        The url that this link points to.
     *
     * @returns             {HTMLElement}
     * An 'HtmlElement', representing the generated link.
     */
    var createLink = function(id, url) {
        var link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = url;

        return link;
    }

    /**
     * @type                Function
     * @name                Inject
     *
     * @description
     * Inject a given stylesheet into the page and wait for until.
     *
     * @param               id:         The id of the element in which to save the stylesheet.
     * @param               url:        The url of the stylesheet to load.
     *
     * @returns {*}
     * A 'promise' which means that we can wait until the data has been loaded.
     */
    cssInjectorServiceObject.Inject = function(id, url) {
        var deferred = $q.defer();
        var link;

        // Check if a stylesheet element which this id does not exist.
        if(!angular.element('link#' + id).length) {

            // Create the element.
            link = createLink(id, url);
            {
                link.onload = deferred.resolve;
                angular.element('head').append(link);
            }

            return deferred.promise;
        }
    };

    // return the service object itself.
    return cssInjectorServiceObject;
}]);