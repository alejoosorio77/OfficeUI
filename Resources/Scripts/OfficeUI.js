/**
 * @filename       OfficeUI.js
 * @Author         Kevin De Coninck
 * @version        1.0.0
 * @date           10/03/2015
 *
 * @notes
 * Defines the core components behind the OfficeUI application.
 * In this file all the required AngularJS code will be placed (Modules, Controller, Directives, ...)
 */

/**
 * @type       Module
 * @name       OfficeUI
 *
 * @notes
 * Defines the AngularJS module 'OfficeUI' which groups all the actions for the OfficeUI web application.
 */
var OfficeUIModule = angular.module('OfficeUI', []);

/**
 * @type        Service
 * @name        OfficeUIConfigurationService
 *
 * @notes
 * Provides a service which will read the necessary configuration file which is required for the OfficeUI application
 * to function properly.
 */
OfficeUIModule.factory('OfficeUIConfigurationService', function($http) {
    // Defines what needs to be returned by the service.
    return {

        /**
         * @type        Function
         * @name        getOfficeUIConfiguration
         *
         * @returns     {HttpPromise}:      A promise which is loading the OfficeUI configuration file.
         */
        getOfficeUIConfiguration: function() {
        if (typeof $.fn.OfficeUI.Settings.OfficeUIConfigurationFileLocation === 'undefined' || $.fn.OfficeUI.Settings.OfficeUIConfigurationFileLocation == '') { new OfficeUIConfigurationException('The OfficeUI configuration file is not defined.'); }
            return $http.get($.fn.OfficeUI.Settings.OfficeUIConfigurationFileLocation)
                .then(function (response) {
                    return {
                        Styles: response.data.Styles,
                        DefaultStyle: response.data.DefaultStyle
                    };
                }, function(error) { new OfficeUILoadingException('The OfficeUI Configuration file: \'' + $.fn.OfficeUI.Settings.OfficeUIConfigurationFileLocation + '\' could not be loaded.'); });
        }
    }
})

/**
 * @type        Service
 * @name        stylesheetFactory
 *
 * @notes
 * Provides common work to work with stylesheets using the AngularJS way.
 */
OfficeUIModule.factory('stylesheetFactory', ['$http', 'OfficeUIConfigurationService', function($http, OfficeUIConfigurationService) {
    // Define the service instance. This one is returned from the factory and it's through this instance that the
    // required methods will be called. Thus all methods that this service needs to expose needs to be defined on this
    // particular object.
    var stylesheetFactoryServiceIntsance = {};

    // Defines the variables which are needed for this service.
    var availableStyles = [];
    var defaultStyle = "";

    /**
     * @type        Function
     * @name        getOfficeUIConfiguration
     *
     * @returns     {HttpPromise}:      A Http Promise which the application does use to wait for asynchronous calls to
     *                                  complete.
     */
    stylesheetFactoryServiceIntsance.getOfficeUIConfiguration = function() {
        var promise = OfficeUIConfigurationService.getOfficeUIConfiguration();

        promise.then(function(response){
            availableStyles = response.Styles;
            defaultStyle = response.DefaultStyle;
        });

        return promise;
    }

    /**
     * @type       Function
     * @name       changeStyle
     *
     * @param      styleName (string):         The name of the style to load. This should be a name which has been
     *                                          defined in the 'availableStyles' array.
     *
     * @return     string:      The url of the stylesheet to load.
     *
     * @notes
     * The styles which can be loaded are defined in the variable 'availableStyles'.
     * When you pass a style which either match multiple entries or no entries an error is thrown.
     *
     */
    stylesheetFactoryServiceIntsance.changeStyle = function(styleName) {
        var foundStyles = JSPath.apply('.{.name == "' + styleName + '"}', availableStyles);

        if (foundStyles.length == 0) { new OfficeUIStylesheetException('A style with name \'' + styleName + '\' could not be found. Is the style defined in the \'availableStyles\' array?'); }
        else if (foundStyles.length > 1) { new OfficeUIStylesheetException('Multiple entries in the \'availableStylesheets\' array matches a style with name \'' + styleName + '\''); }
        else if (foundStyles.length == 1) { return foundStyles[0].stylesheet; }
    }

    // Return the instance of the service.
    return stylesheetFactoryServiceIntsance;
}]);

/**
 * @type        Controller
 * @name        StylesheetController
 *
 * @notes
 * Defines the 'StylesheetController' controller. This controller is used to render an OfficeUI website in various
 * styles.
 */
OfficeUIModule.controller('OfficeUIController', function(stylesheetFactory, $scope) {
    // Initializes the controller so that the application is configured to work.
    Initialize();

    /**
     * @type        Function
     * @name        Initialize
     *
     * @notes
     * Initializes the OfficeUI application by loading the configuration file and adjusting the application to meets
     * the specifications stored in that configuration file.
     */
    function Initialize() {
        stylesheetFactory.getOfficeUIConfiguration().then(function(data) {
            $scope.style = stylesheetFactory.changeStyle(data.DefaultStyle);
        });
    }

    /**
     * @type       Function
     * @name       changeStyle
     *
     * @param      styleName (string):         The name of the style to load. This should be a name which has been
     *                                          defined in the 'availableStyles' array.
     *
     * @notes
     * The styles which can be loaded are defined in the variable 'availableStyles'.
     * When you pass a style which either match multiple entries or no entries an error is thrown.
     */
    $scope.changeStyle = function(styleName) {
        $scope.style = stylesheetFactory.changeStyle(styleName);
    }
});







