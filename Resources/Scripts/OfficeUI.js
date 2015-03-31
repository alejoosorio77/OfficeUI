/**
 * @filename       OfficeUI.js
 * @Author         Kevin De Coninck
 * @version        1.0.0
 * @date           30/03/2015
 *
 * @notes
 * Defines the core components behind the OfficeUI application.
 * In this file all the required AngularJS code will be placed (Modules, Controller, Directives, ...)
 */
/* ---- AngularJS Modules. ---- */

/**
 * @type            Module
 * @name            OfficeUI
 *
 * @description
 * Defines the AngularJS module 'OfficeUI' which groups all the necessary data and functions for an OfficeUI
 * application. It's on the module 'OfficeUI' that all the hooks needs to be connected.
 * By 'hooks', we do mean the Controllers, Directives, Filters, Services, ...
 */
var OfficeUI = angular.module('OfficeUIApplication', ['ngSanitize']);

/* ---- End: AngularJS Modules. ---- */

/* ---- AngularJS Services. ---- */

/**
 * @type            Service
 * @name            OfficeUIConfigurationService
 *
 * @description
 * Provides a service which will read the necessary configuration file which is required for an OfficeUI application
 * to function properly.
 *
 * @remarks
 * By default, the location of the configuration file to read is stored in a JavaScript library which can be accessed
 * with the following code:
 *
 * $.fn.OfficeUI.Settings.OfficeUIConfigurationFileLocation
 *
 * The default location for the file which this service will try to read is the following:
 *
 * '/Configuration/Application/OfficeUI.config.json'
 *
 * To change the location of this file, you have 2 options:
 *
 * 1.   Change the default path in the JavaScript file (OfficeUI.Configuration.js) or the minified version of it
 *      if you're using the minified release.
 *      This JavaScript file location is: '/Resources/Scripts/OfficeUI.Configuration.js'.
 *      Caution: Modifying 'core' files can make an application unusable when updating to a new version.
 *               This because the modified file might get overridden.
 *
 * 2.   Another option would be to change the location of the file on page load.
 *      Doing this makes sure that you don't need to mess with the 'core' files, meaning that the project can be
 *      updated at all times.
 *      In order to change the location of the configuration file on page load, you can execute the following code:
 *
 *      $.fn.OfficeUI.Settings.OfficeUIConfigurationFileLocation = '/path/to/configuration/file.json'
 */
OfficeUI.factory('OfficeUIConfigurationService', function($http) {
    // Defines the object that this service needs to return.
    return {

        /**
         * @type            Function
         * @name            getOfficeUIConfiguration
         *
         * @returns         {HttpPromise}:      A promise which is loading the OfficeUI configuration file.
         *
         * @remarks
         * This method can throw exceptions when an error occurred during the loading of this file.
         * The explanation below provides some information about which exception can occur when:
         *
         * OfficeUIConfigurationException:      This exception is throwed when the value of the field
         *                                      '$.fn.OfficeUI.Settings.OfficeUIConfigurationFileLocation' is not
         *                                      provided. This does mean that the configuration file cannot be loaded.
         *
         * OfficeUILoadingException:            This exception is throwed when the configuration file cannot be loaded,
         *                                      or when there's an error in the configuration file.
         */
        getOfficeUIConfiguration: function() {
            // Check if the location of the file can be found somewhere. If it cannot be found, throw an error.
            if (typeof $.fn.OfficeUI.Settings.OfficeUIConfigurationFileLocation === 'undefined' || $.fn.OfficeUI.Settings.OfficeUIConfigurationFileLocation == '') {
                OfficeUICore.Exceptions.officeUIConfigurationException('The OfficeUI Configuration file is not defined.');
            }

            // Returns the 'httpPromise' which is required for further processing.
            return $http.get($.fn.OfficeUI.Settings.OfficeUIConfigurationFileLocation)
                .then(function (response) {
                    return {
                        Styles: response.data.Styles,
                        DefaultStyle: response.data.DefaultStyle,
                        Themes: response.data.Themes,
                        DefaultTheme: response.data.DefaultTheme,
                        Configuration: response.data.Configuration,
                        Controls: response.data.Controls
                    };
                }, function(error) { OfficeUICore.Exceptions.officeUILoadingException('The OfficeUI Configuration file: \'' + $.fn.OfficeUI.Settings.OfficeUIConfigurationFileLocation + '\' could not be loaded.'); }
            );
        }
    }
});

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
     * @name                loadAndWait
     * @description
     * Load a given stylesheet file and wait until it's loaded.
     * To check if it's done loading, we execute this method in a loop until we retrieve some data.
     *
     * @param               url:        The url of the stylesheet which is being loaded.
     * @param               deferred:   An object which is required to resolve the file.
     */
    var loadAndWait = function(url, deferred) {
        for (var i in document.styleSheets) {
            var href = document.styleSheets[i].href || "";
            if (href.split("/").slice(-1).join() === url) {
                deferred.resolve();
                return;
            }
        }
        setTimeout(function() {loadAndWait(url, deferred);}, 50);
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
    cssInjectorServiceObject.Inject = function(id, url){
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

            loadAndWait(url, deferred);

            return deferred.promise;
        }
    };

    // return the service object itself.
    return cssInjectorServiceObject;
}]);

/* ---- End: AngularJS Services. ---- */

/* ----  AngularJS Directives. ---- */

/**
 * @type            Directive
 * @usage           Attribute
 * @name            officeuiToggleClassOnClick
 *
 * @description
 * Defines the 'officeuiToggleClassOnClick' directive. This directive allows us to toggle a specific class when you click
 * on a certain element.
 * Whenever you click on the element, the class provided as an attribute will be added to the element.
 *
 * @example
 * Imagine that we have the following HTML code:
 *
 * <div class="icons no-select">
 *     <img class="application-icon" src="#" />
 * </div>
 *
 * Now, we want to add a class 'active', when you click on the icon. But when you leave the icon again, the class
 * 'active' should be removed.
 * Therefore, the following code van be used:
 *
 * <div class="icons no-select">
 *     <img class="application-icon" src="#" data-officeui-toggle-class-on-click="active" />
 * </div>
 *
 * @remarks
 * We're also binding the event handler 'mouseout' on the element. This is, because when you click on the element
 * and then you move away your mouse, the class 'active-ie-fix' doesn't get removed. It's only get removed if you
 * click on the element again. Now the class is also removed when your mouse leave the element.
 */
OfficeUI.directive('officeuiToggleClassOnClick', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            var toggleClass = attributes['officeuiToggleClassOnClick'];

            // Bind the mousedown and mouseup event handlers.
            element.bind('mousedown mouseup', function() {
                element.toggleClass(toggleClass);
            });

            // Bind the 'mouseout' event handler.
            element.bind('mouseout', function() {
                if (element.hasClass(toggleClass)) { element.removeClass(toggleClass); }
            })
        }
    }
});

/* ----  End: AngularJS Directives. ---- */

/* ---- AngularJS Controllers. ---- */

/**
 * @type            Controller
 * @name            OfficeUIController
 *
 * @description
 * Defines the 'OfficeUIController' controller. By this controller, everything for an OfficeUI application is
 * controlled.
 *
 * @dependencies        CssInjectorService:                     Provides a way to load stylesheets dynamically and
 *                                                              wait for them to be retrieved.
 *                      OfficeUIConfigurationService:           Provides the configuration for an OfficeUI application.
 */
OfficeUI.controller('OfficeUIController', function(CssInjectorService, OfficeUIConfigurationService, $scope, $http) {

    /* -- Section: Variables. -- */
    $scope.isInitialized = false;           // Indicates that the entire OfficeUI application has been loaded.
    $scope.loadingScreenLoaded = false;     // Indicates that the data for the loading screen has been loaded.

    // Initialize all the required components for the website.
    Initialize();

    /**
     * @type                Function
     * @name                Initialize
     *
     * @description
     * Initialize the AngularJS controller by loading the required files, parsing them, loading them into the DOM, ...
     * The following initialization is being done:
     * -    Retrieve the OfficeUI Configuration and according to this file, apply the correct stylesheets for both the
     *      theming and the styling of the application.
     * -    Retrieve the configuration file of the application, and use this configuration file to populate the string,
     *      images and other elements which needs to be placed on the page.
     */
    function Initialize() {
        OfficeUIConfigurationService.getOfficeUIConfiguration().then(function(data) {
            // Retrieve the styles and themes as defined in the Json file.
            var foundStyles = JSPath.apply('.{.name == "' + data.DefaultStyle + '"}', data.Styles);
            var foundThemes = JSPath.apply('.{.name == "' + data.DefaultTheme + '"}', data.Themes);

            // Using our custom 'CssInjectorService' service, add a stylesheet for the theme and style.
            CssInjectorService.Inject('OfficeUIStyle', foundStyles[0].stylesheet);
            CssInjectorService.Inject('OfficeUITheme', foundThemes[0].stylesheet).then(function() {
                // Set a variable that indicates that the loading screen can be showed.
                $scope.loadingScreenLoaded = true;
            });

            // Returns the 'httpPromise' which is required for further processing.
            $http.get(data.Configuration)
                .then(function (response) {
                        $scope.Title = response.data.Title;
                        $scope.Icons = response.data.Icons;
                }, function(error) { OfficeUICore.Exceptions.officeUILoadingException('The OfficeUI application definition file: \'' + data.Configuration + '\' could not be loaded.'); }
            );
        });

        $scope.isInitialized = true;
    }
});

/* ---- End: AngularJS Controllers. ---- */