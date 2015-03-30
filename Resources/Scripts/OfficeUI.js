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

/* ---- End: AngularJS Services. ---- */

/* ----  AngularJS Directives. ---- */

/**
 * @type            Directive
 * @name            officeuiApplication
 *
 * @description
 * Defines the OfficeUIApplication directive. This directive allows us, by placing an HTML tag to render the entire
 * OfficeUI application, which does include the ribbon and all the other controls.
 *
 * @remarks
 * The template file itself is saved in the following location: '/Resources/Data/Templates/OfficeUI.html'.
 * This location is hardcoded and cannot be changed.
 *
 * @example
 * Imagine the following HTML code which is placed on a page.
 *
 * <body>
 *    <div id="OfficeUI">
 *        <!-- We want to render the OfficeUI Suite here. -->
 *    </div>
 * </body>
 *
 * Now, we want to render the OfficeUI controls on the place of the comment.
 * There are 2 options, or we can either replace the entire section with the OfficeUI controls, but that makes that the
 * HTML does become very cluttered and it's not easy to maintain.
 * Therefore, you can also replace the section with this directive as showed in the example below:
 *
 * <body>
 *    <div id="OfficeUI">
 *        <div officeui-application=""></div>
 *    </div>
 * </body>
 */
OfficeUI.directive('officeuiApplication', function() {
    return {
        restrict: 'AE',
        replace: true,
        templateUrl: '/Resources/Data/Templates/OfficeUI.html'
    }
});

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
 * @dependencies    OfficeUIConfigurationService:           Provides the configuration for an OfficeUI application.
 */
OfficeUI.controller('OfficeUIController', function(OfficeUIConfigurationService, $scope, $http) {
    $scope.isInitialized = false;           // Indicates that the entire OfficeUI application has been loaded.
    $scope.loadingScreenLoaded = false;     // Indicates that the data for the loading screen has been loaded.

    // Initialize all the required components for the website.
    Initialize();

    function Initialize() {
        OfficeUIConfigurationService.getOfficeUIConfiguration().then(function(data) {
            var foundStyles = JSPath.apply('.{.name == "' + data.DefaultStyle + '"}', data.Styles);
            var foundThemes = JSPath.apply('.{.name == "' + data.DefaultTheme + '"}', data.Themes);

            $scope.Style = foundStyles[0].stylesheet;
            $scope.Theme = foundThemes[0].stylesheet;

            // Set a value that indicates that the loading screen has been loaded. So, at this point, the loading screen
            // can be rendered.
            $scope.loadingScreenLoaded = true;

            // Returns the 'httpPromise' which is required for further processing.
            $http.get(data.Configuration)
                .then(function (response) {
                        $scope.Title = response.data.Title;
                        $scope.Icons = response.data.Icons;
                }, function(error) { OfficeUICore.Exceptions.officeUILoadingException('The OfficeUI application definition file: \'' + data.Configuration + '\' could not be loaded.'); }
            );
        });

        setTimeout(function() {
            $scope.isInitialized = true;
            $scope.$apply();
        }, 2000);
    }
});

/* ---- End: AngularJS Controllers. ---- */