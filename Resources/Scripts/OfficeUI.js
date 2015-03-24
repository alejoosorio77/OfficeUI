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

/* ---- AngularJS Modules. ---- */

/**
 * @type            Module
 * @name            OfficeUI
 *
 * @description
 * Defines the AngularJS module 'OfficeUI' which groups all the actions for the OfficeUI web application.
 * It's on the module 'OfficeUI', that all the hooks needs to be connector.
 * By the hooks, we do mean the controllers, filters, directives, ...
 */
var OfficeUIModule = angular.module('OfficeUI', []);

/* ---- End: AngularJS Modules. ---- */

/* ----  AngularJS Directives. ---- */

/**
 * @type            Directive
 * @name            officeuiApplication
 *
 * @description
 * Defines the OfficeUIApplication directive. This directive allows us, by placing an HTML tag to render the entire
 * OfficeUI applications, which does include the ribbon.
 *
 * @remarks
 * The template file itself is saved in the following location: '/Resources/Data/Templates/OfficeUI.Application.html'.
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
OfficeUIModule.directive('officeuiApplication', function() {
    return {
        restrict: 'AE',
        replace: true,
        templateUrl: '/Resources/Data/Templates/OfficeUI.Application.html'
    }
});

/* ----  End: AngularJS Directives. ---- */

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
 *
 * The section below gives an overview of the configuration file.
 *
 * The OfficeUI configuration file does have 5 different properties which can be exposed:
 *
 *  - Styles:               An array containing the various styles. A style in the OfficeUI is a color scheme.
 *                          In here you need to pass objects that does contain the name and the css file to load.
 *
 *  - DefaultStyle:         A name that represents the style to use when the page is being loaded.
 *                          The value of this field must match a value in the 'Styles' property.
 *
 *  - Themes:               An array containing the various themes. A theme in the OfficeUI is a background to use on
 *                          the application. In here you need to pass objects that does contain the name and the css
 *                          file to load.
 *
 *  - DefaultTheme:         A name that represents the theme to use when the page is being loaded.
 *                          The value of this field must match a value in the 'Themes' property.
 *
 *  - PreserveStyle:        A boolean that indicates whether the latest chosen style should be preserved on a
 *                          page refresh or not. This is done by using cookies.
 *                          When this value is set to 'true' and there's a cookie that defines the latest chosen style,
 *                          then this style will be used instead of the one defined in the 'DefaultStyle' property.
 *
 *  - PreserveTheme:        A boolean that indicates whether the latest chosen theme should be preserved on a page
 *                          refresh or not. This is done by using cookies.
 *                          When this value is set to 'true' and there's a cookie that defines the latest chosen theme,
 *                          then this theme will be used instead of the one defined in the 'DefaultTheme' property.
 */
OfficeUIModule.factory('OfficeUIConfigurationService', function($http) {
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
                        PreserveStyle: response.data.PreserveStyle,
                        PreserveTheme: response.data.PreserveTheme
                    };
                }, function(error) { OfficeUICore.Exceptions.officeUILoadingException('The OfficeUI Configuration file: \'' + $.fn.OfficeUI.Settings.OfficeUIConfigurationFileLocation + '\' could not be loaded.'); }
            );
        }
    }
});

/**
 * @type            Service
 * @name            OfficeUIRibbonConfigurationService
 *
 * @description
 * Provides a service which will read the necessary configuration file which is required for the OfficeUI ribbon
 * to function properly.
 *
 * @remarks
 * By default, the location of the configuration file to read is stored in a JavaScript library which can be accessed
 * with the following code:
 *
 * $.fn.OfficeUI.Settings.OfficeUIRibbonConfigurationFile
 *
 * The default location for the file which this service will try to read is the following:
 *
 * '/Configuration/Application/OfficeUI.Ribbon.config.json'
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
 *      $.fn.OfficeUI.Settings.OfficeUIRibbonConfigurationFile = '/path/to/configuration/file.json'
 *
 * The section below gives an overview of the configuration file.
 *
 * The OfficeUI Ribbon configuration file does have 2 different properties which can be exposed:
 *
 *  - ChangeActiveTabOnHover:       A boolean that indicates if the currently active tab should be change on hover.
 *                                  By setting the value to 'true', a tab becomes active when you hover on the tab
 *                                  element.
 *
 *  - PreserveRibbonState:          A boolean that indicates if the ribbon state should be preserved. The ribbon state
 *                                  is how the ribbon is showed on the page. (Showed or Hidden).
 */
OfficeUIModule.factory('OfficeUIRibbonConfigurationService', function($http) {
    // Defines the object that this service needs to return.
    return {

        /**
         * @type            Function
         * @name            getOfficeUIRibbonConfiguration
         *
         * @returns         {HttpPromise}:      A promise which is loading the OfficeUI ribbon configuration file.
         *
         * @remarks
         * This method can throw exceptions when an error occurred during the loading of this file.
         * The explanation below provides some information about which exception can occur when:
         *
         * OfficeUIConfigurationException:      This exception is throwed when the value of the field
         *                                      '$.fn.OfficeUI.Settings.OfficeUIRibbonConfigurationFile' is not
         *                                      provided. This does mean that the configuration file cannot be loaded.
         *
         * OfficeUILoadingException:            This exception is throwed when the configuration file cannot be loaded,
         *                                      or when there's an error in the configuration file.
         */
        getOfficeUIRibbonConfiguration: function() {
            // Check if the location of the file can be found somewhere. If it cannot be found, throw an error.
            if (typeof $.fn.OfficeUI.Settings.OfficeUIRibbonConfigurationFile === 'undefined' || $.fn.OfficeUI.Settings.OfficeUIRibbonConfigurationFile == '') {
                OfficeUICore.Exceptions.officeUIConfigurationException('The OfficeUI Ribbon Configuration file is not defined.');
            }

            // Returns the 'httpPromise' which is required for further processing.
            return $http.get($.fn.OfficeUI.Settings.OfficeUIRibbonConfigurationFile)
                .then(function (response) {
                    return {
                        ChangeActiveTabOnHover: response.data.ChangeActiveTabOnHover,
                        PreserveRibbonState: response.data.PreserveRibbonState
                    };
                }, function(error) { OfficeUICore.Exceptions.officeUILoadingException('The OfficeUI Ribbon Configuration file: \'' + $.fn.OfficeUI.Settings.OfficeUIRibbonConfigurationFile + '\' could not be loaded.'); }
            );
        }
    }
});

/**
 * @type            Service
 * @name            OfficeUIApplicationDefinitionService
 *
 * @description
 * Provides a service which will read the necessary data file for an OfficeUI application to function properly.
 *
 * @remarks
 * By default, the location of the configuration file to read is stored in a JavaScript library which can be accessed
 * with the following code:
 *
 * $.fn.OfficeUI.Settings.OfficeUIApplicationDefinitionFileLocation
 *
 * The default location for the file which this service will try to read is the following:
 *
 * '/Resources/Data/Application.json'
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
 *      $.fn.OfficeUI.Settings.OfficeUIApplicationDefinitionFileLocation = '/path/to/data/file.json'
 */
OfficeUIModule.factory('OfficeUIApplicationDefinitionService', function($http) {
    // Defines the object that this service needs to return.
    return {

        /**
         * @type            Function
         * @name            getOfficeUIApplicationDefinition
         *
         * @returns         {HttpPromise}:      A promise which is loading the OfficeUI application definition file.
         *
         * @remarks
         * This method can throw exceptions when an error occurred during the loading of this file.
         * The explanation below provides some information about which exception can occur when:
         *
         * OfficeUIConfigurationException:      This exception is throwed when the value of the field
         *                                      '$.fn.OfficeUI.Settings.OfficeUIApplicationDefinitionFileLocation' is
         *                                      not provided. This does mean that the configuration cannot be loaded.
         *
         * OfficeUILoadingException:            This exception is throwed when the configuration file cannot be loaded,
         *                                      or when there's an error in the configuration file.
         */
        getOfficeUIApplicationDefinition: function() {
            // Check if the location of the file can be found somewhere. If it cannot be found, throw an error.
            if (typeof $.fn.OfficeUI.Settings.OfficeUIApplicationDefinitionFileLocation === 'undefined' || $.fn.OfficeUI.Settings.OfficeUIApplicationDefinitionFileLocation == '') {
                OfficeUICore.Exceptions.officeUIConfigurationException('The OfficeUI application definition file is not defined.');
            }

            // Returns the 'httpPromise' which is required for further processing.
            return $http.get($.fn.OfficeUI.Settings.OfficeUIApplicationDefinitionFileLocation)
                .then(function (response) {
                    return {
                        Title: response.data.Title,
                        Icons: response.data.Icons
                    };
                }, function(error) { OfficeUICore.Exceptions.officeUILoadingException('The OfficeUI application definition file: \'' + $.fn.OfficeUI.Settings.OfficeUIApplicationDefinitionFileLocation + '\' could not be loaded.'); }
            );
        }
    }
});

/**
 * @type            Service
 * @name            OfficeUIRibbonDefinitionService
 *
 * @description
 * Provides a service which will read the necessary data file for an OfficeUI application to function properly.
 *
 * @remarks
 * By default, the location of the configuration file to read is stored in a JavaScript library which can be accessed
 * with the following code:
 *
 * $.fn.OfficeUI.Settings.OfficeUIRibbonDefinitionFileLocation
 *
 * The default location for the file which this service will try to read is the following:
 *
 * '/Resources/Data/Ribbon.json'
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
 *      $.fn.OfficeUI.Settings.OfficeUIRibbonDefinitionFileLocation = '/path/to/data/file.json'
 */
OfficeUIModule.factory('OfficeUIRibbonDefinitionService', function($http) {
    // Defines the object that this service needs to return.
    return {

        /**
         * @type            Function
         * @name            getOfficeUIRibbonDefinition
         *
         * @returns         {HttpPromise}:      A promise which is loading the OfficeUI application definition file.
         *
         * @remarks
         * This method can throw exceptions when an error occurred during the loading of this file.
         * The explanation below provides some information about which exception can occur when:
         *
         * OfficeUIConfigurationException:      This exception is throwed when the value of the field
         *                                      '$.fn.OfficeUI.Settings.OfficeUIApplicationDefinitionFileLocation' is
         *                                      not provided. This does mean that the configuration cannot be loaded.
         *
         * OfficeUILoadingException:            This exception is throwed when the configuration file cannot be loaded,
         *                                      or when there's an error in the configuration file.
         */
        getOfficeUIRibbonDefinition: function() {
            // Check if the location of the file can be found somewhere. If it cannot be found, throw an error.
            if (typeof $.fn.OfficeUI.Settings.OfficeUIRibbonDefinitionFileLocation === 'undefined' || $.fn.OfficeUI.Settings.OfficeUIRibbonDefinitionFileLocation == '') {
                OfficeUICore.Exceptions.officeUIConfigurationException('The OfficeUI ribbon definition file is not defined.');
            }

            // Returns the 'httpPromise' which is required for further processing.
            return $http.get($.fn.OfficeUI.Settings.OfficeUIRibbonDefinitionFileLocation)
                .then(function (response) {
                    return {
                        Tabs: response.data.Tabs,
                        ContextualGroups: response.data.ContextualGroups
                    };
                }, function(error) { OfficeUICore.Exceptions.officeUILoadingException('The OfficeUI ribbon definition file: \'' + $.fn.OfficeUI.Settings.OfficeUIRibbonDefinitionFileLocation + '\' could not be loaded.'); }
            );
        }
    }
});

/**
 * @type            Service
 * @name            stylesheetFactory
 *
 * @description
 * Provides various ways to work with stylesheets using the AngularJS way.
 *
 * @dependencies    $http, OfficeUIConfigurationService.
 */
OfficeUIModule.factory('stylesheetFactory', ['$http', 'OfficeUIConfigurationService', function($http, OfficeUIConfigurationService) {
    /* Define the service instance. This one is returned from the factory and it's through this instance that the
       required methods will be called. Thus all methods that this service needs to expose needs to be defined on this
       particular object. */
    var stylesheetFactoryServiceIntsance = {};

    // Defines the variables which are needed for this service.
    var availableStyles = [];
    var defaultStyle = '';
    var availableThemes = [];
    var defaultTheme = '';

    /**
     * @type            Function
     * @name            getOfficeUIConfiguration
     *
     * @description
     * Retrieved the OfficeUIConfiguration file and parse the data so it can be used further in the application.
     *
     * @returns         {HttpPromise}:      A Http Promise which the application does use to wait for asynchronous
     *                                      calls to complete.
     */
    stylesheetFactoryServiceIntsance.getOfficeUIConfiguration = function() {
        var promise = OfficeUIConfigurationService.getOfficeUIConfiguration();

        promise.then(function(response){
            availableStyles = response.Styles;
            defaultStyle = response.DefaultStyle;
            availableThemes = response.Themes;
            defaultTheme = response.DefaultTheme
        });

        return promise;
    }

    /**
     * @type            Function
     * @name            changeStyle
     *
     * @description
     * Change the current style of the application. In OfficeUI, a style is a color scheme. So, by calling this method
     * you'll change the current color of the application.
     *
     * @param           styleName (string):         The name of the style to load. This should be a name which has been
     *                                              defined in the 'availableStyles' array.
     *
     * @return          string:                     The url of the stylesheet to load.
     *
     * @remarks
     * The styles which can be loaded are defined in the variable 'availableStyles'.
     * When you pass a style which either match multiple entries or no entries an error is thrown.
     * The following errors can be throwed:
     *
     *  - OfficeUIStylesheetException:              This exception is throwed when you're passing a 'styleName' which
     *                                              cannot be found.
     *                                              This exception can also be throwed when you're passing a 'styleName'
     *                                              that causes multiple matches in the 'AvailableStyles' array.
     */
    stylesheetFactoryServiceIntsance.changeStyle = function(styleName) {
        var foundStyles = JSPath.apply('.{.name == "' + styleName + '"}', availableStyles);

        if (foundStyles.length == 0) { OfficeUICore.Exceptions.officeUIStylesheetException('A style with name \'' + styleName + '\' could not be found. Is the style defined in the \'availableStyles\' array?'); }
        else if (foundStyles.length > 1) { OfficeUICore.Exceptions.officeUIStylesheetException('Multiple entries in the \'availableStylesheets\' array matches a style with name \'' + styleName + '\''); }
        else if (foundStyles.length == 1) { return foundStyles[0].stylesheet; }
    }

    /**
     * @type            Function
     * @name            changeTheme
     *
     * @description
     * Change the current theme of the application. In OfficeUI, a theme is a background. So, by calling this method
     * you'll change the current background of the application.
     *
     * @param           themeName (string):     The name of the theme to load. This should be a name which has been defined
     *                                          in the 'availableThemes' array.
     *
     * @return          string:                 The url of the stylesheet to load.
     *
     * @remarks
     * The themes which can be loaded are defined in the variable 'availableThemes'.
     * When you pass a theme which either match multiple entries or no entries an error is thrown.
     * The following errors can be throwed:
     *
     *  - OfficeUIStylesheetException:              This exception is throwed when you're passing a 'themeName' which
     *                                              cannot be found.
     *                                              This exception can also be throwed when you're passing a 'themeName'
     *                                              that causes multiple matches in the 'availableThemes' array.
     */
    stylesheetFactoryServiceIntsance.changeTheme = function(themeName) {
        var foundThemes = JSPath.apply('.{.name == "' + themeName + '"}', availableThemes);

        if (foundThemes.length == 0) { OfficeUICore.Exceptions.officeUIStylesheetException('A theme with name \'' + themeName + '\' could not be found. Is the style defined in the \'availableThemes\' array?'); }
        else if (foundThemes.length > 1) { OfficeUICore.Exceptions.officeUIStylesheetException('Multiple entries in the \'availableThemes\' array matches a style with name \'' + themeName + '\''); }
        else if (foundThemes.length == 1) { return foundThemes[0].stylesheet; }
    }

    // Return the instance of the service.
    return stylesheetFactoryServiceIntsance;
}]);

/**
 * @type            Service
 * @name            officeUIRibbonConfigurationFactory
 *
 * @description
 * Provides various ways to work with an OfficeUI Ribbon using the AngularJS way.
 *
 * @dependencies    $http, OfficeUIRibbonConfigurationService.
 */
OfficeUIModule.factory('officeUIRibbonConfigurationFactory', ['$http', 'OfficeUIRibbonConfigurationService', function($http, OfficeUIRibbonConfigurationService) {
    /* Define the service instance. This one is returned from the factory and it's through this instance that the
     required methods will be called. Thus all methods that this service needs to expose needs to be defined on this
     particular object. */
    var officeUIRibbonConfigurationFactoryInstance = {};

    // Defines the variables which are needed for this service.
    var changeActiveTabOnHover = null;

    /**
     * @type            Function
     * @name            getOfficeUIRibbonConfiguration
     *
     * @description
     * Retrieved the OfficeUIRibbonConfiguration file and parse the data so it can be used further in the application.
     *
     * @returns         {HttpPromise}:      A Http Promise which the application does use to wait for asynchronous
     *                                      calls to complete.
     */
    officeUIRibbonConfigurationFactoryInstance.getOfficeUIRibbonConfiguration = function() {
        var promise = OfficeUIRibbonConfigurationService.getOfficeUIRibbonConfiguration();

        promise.then(function(response){});

        return promise;
    }

    // Return the instance of the service.
    return officeUIRibbonConfigurationFactoryInstance;
}]);

/**
 * @type            Service
 * @name            applicationDefinitionFactory
 *
 * @description
 * Provides various ways to work with an OfficeUI application using the AngularJS way.
 *
 * @dependencies    $http, OfficeUIApplicationDefinitionService.
 */
OfficeUIModule.factory('applicationDefinitionFactory', ['$http', 'OfficeUIApplicationDefinitionService', function($http, OfficeUIApplicationDefinitionService) {
    /* Define the service instance. This one is returned from the factory and it's through this instance that the
     required methods will be called. Thus all methods that this service needs to expose needs to be defined on this
     particular object. */
    var applicationDefinitionFactoryInstance = {};

    // Defines the variables which are needed for this service.
    var title = [];
    var icons = '';

    /**
     * @type        Function
     * @name        getOfficeUIApplicationDefinition
     *
     * @returns     {HttpPromise}:      A Http Promise which the application does use to wait for asynchronous calls to
     *                                  complete.
     */
    applicationDefinitionFactoryInstance.getOfficeUIApplicationDefinition = function() {
        var promise = OfficeUIApplicationDefinitionService.getOfficeUIApplicationDefinition();

        promise.then(function(response){});

        return promise;
    }

    // Returns the instance of the service.
    return applicationDefinitionFactoryInstance;
}]);

/**
 * @type            Service
 * @name            ribbonDefinitionFactory
 *
 * @description
 * Provides various ways to work with an OfficeUI Ribbon using the AngularJS way.
 *
 * @dependencies    $http, OfficeUIRibbonDefinitionService.
 */
OfficeUIModule.factory('ribbonDefinitionFactory', ['$http', 'OfficeUIRibbonDefinitionService', function($http, OfficeUIRibbonDefinitionService) {
    /* Define the service instance. This one is returned from the factory and it's through this instance that the
     required methods will be called. Thus all methods that this service needs to expose needs to be defined on this
     particular object. */
    var ribbonDefinitionFactoryInstance = {};

    // Defines the variables which are needed for this service.
    var tabs = [];
    var contextualGroups = '';

    /**
     * @type        Function
     * @name        getOfficeUIApplicationDefinition
     *
     * @returns     {HttpPromise}:      A Http Promise which the application does use to wait for asynchronous calls to
     *                                  complete.
     */
    ribbonDefinitionFactoryInstance.getOfficeUIRibbonDefinition = function() {
        var promise = OfficeUIRibbonDefinitionService.getOfficeUIRibbonDefinition();

        promise.then(function(response){});

        return promise;
    }

    // Returns the instance of the service.
    return ribbonDefinitionFactoryInstance;
}]);

/* ---- End: AngularJS Services. ---- */

/* ---- AngularJS Controllers. ---- */

/**
 * @type        Controller
 * @name        StylesheetController
 *
 * @notes
 * Defines the 'StylesheetController' controller. This controller is used to render an OfficeUI website in various
 * styles.
 */
OfficeUIModule.controller('OfficeUIController', function(stylesheetFactory, applicationDefinitionFactory,
                                                         ribbonDefinitionFactory, officeUIRibbonConfigurationFactory,
                                                         $scope) {
    var isInitializing = true;

    /**
     * @description
     * Defines the various states that a ribbon can have. A ribbon in an OfficeUI application can have 3 different
     * states. See the information below to our when the ribbon has which states.
     *
     * @type    {{Hidden: number, Visible: number, Showed: number}}
     *          Hidden:     The ribbon is hidden completely from view. It can only be showed when you click on one
     *                      of the tabs.
     *          Visible:    The ribbon is visible for the end-user but does not remain visible.
     *                      Once the focus from the ribbon has been lost for some time, the ribbon becomes invisible.
     *          Showed:     The ribbon is showed for the end user and does not collapse when the focus is lost.
     *
     * @notes
     * In a normal flow, when the ribbon is showed by default, this is are the various states through which it travels:
     * Showed - Hidden.
     *
     * In a normal flow, when the ribbon is hidden by default, this are the various states through which is travels.
     * Hidden - Visible - Showed.
     *
     * There's an additional state with the name 'Showed_Initialized'. But that's the state that the ribbon will get
     * when the page is being loaded. This is to prevent animations from being executed.
     */
    var ribbonStates = { Hidden: 1, Visible: 2, Showed: 3, Showed_Initialized: 99 }

    // Constants - The constants below are used for cookies to determine the current state of an OfficeUI application.
    var COOKIE_NAME_RIBBON_ACTIVE_TAB = 'OfficeUI_Ribbon_ActiveTab';
    var COOKIE_NAME_OFFICEUI_CURRENT_THEME = 'OfficeUI_CurrentTheme';
    var COOKIE_NAME_OFFICEUI_CURRENT_COLOR = 'OfficeUI_CurrentColor';

    var activeTab = null; // Variable that holds the currently active tab.
    var changeActiveTabOnHover = null; // Variable that defines if an active tab should be changed when hovering on it.
    var preserveRibbonState = null; // Variable that defines if the state of the ribbon should be preserved.
    var activeContextualGroups = []; // Variable that defines all the active contextual groups.
    var ribbonState = null; // Variable that defines the state of the ribbon.
    var preserveStyle = null; // Variable that defines if the state of the color should be preserved.
    var preserveTheme = null; // Variable that defines if the state of the theme should be preserved.

    // Get the cookie in which the previous activate state is stored.
    var previousActiveTab = OfficeUICore.StateManagement.GetCookie(COOKIE_NAME_RIBBON_ACTIVE_TAB);

    // Initializes the controller so that the application is configured to work.
    Initialize();

    /**
     * @type        Function
     * @name        Initialize
     *
     * @notes
     * Initializes the OfficeUI application by loading the configuration file and adjusting the application to meets
     * the specifications stored in that configuration file.
     * The changes which are being done here are the following:
     * - Apply a default style (as defined in the OfficeUI configuration file).
     * - Apply a default theme (as defined in the OfficeUI configuration file).
     */
    function Initialize() {
        // Initialize the stylesheet factory to make sure that all the data has been loaded.
        stylesheetFactory.getOfficeUIConfiguration().then(function(data) {
            var currentTheme = OfficeUICore.StateManagement.GetCookie(COOKIE_NAME_OFFICEUI_CURRENT_THEME);
            var currentStyle = OfficeUICore.StateManagement.GetCookie(COOKIE_NAME_OFFICEUI_CURRENT_COLOR);

            if (currentTheme == '') { $scope.Theme = stylesheetFactory.changeTheme(data.DefaultTheme); }
            else { $scope.Theme = stylesheetFactory.changeTheme(currentTheme); }

            if (currentStyle == '') { $scope.Style = stylesheetFactory.changeStyle(data.DefaultStyle); }
            else { $scope.Style = stylesheetFactory.changeStyle(currentStyle); }

            preserveStyle = data.PreserveStyle;
            preserveTheme = data.PreserveTheme;
        });

        // Initialize the application definition factory to make sure that all the data has been loaded.
        applicationDefinitionFactory.getOfficeUIApplicationDefinition().then(function(data) {
            $scope.Title = data.Title;
            $scope.Icons = data.Icons;
        });

        officeUIRibbonConfigurationFactory.getOfficeUIRibbonConfiguration().then(function(data) {
            changeActiveTabOnHover = data.ChangeActiveTabOnHover;
            preserveRibbonState = data.PreserveRibbonState;
        });

        // Initialize the ribbon definition factory to make sure that all the data has been loaded.
        ribbonDefinitionFactory.getOfficeUIRibbonDefinition().then(function(data) {
            $scope.Tabs = data.Tabs;
            $scope.ContextualGroups = data.ContextualGroups;

            // Set the first tab (not the application tab, as the currently active tab).
            if (preserveRibbonState) {
                if (previousActiveTab != '')
                {
                    var matches = jQuery.grep($scope.Tabs, function(tab) {
                        return tab.Id === previousActiveTab;
                    });

                    if (matches.length > 0) { activeTab = previousActiveTab; }
                    else { activeTab = $scope.Tabs[1].Id; }
                } else { activeTab = $scope.Tabs[1].Id; }
            } else { activeTab = $scope.Tabs[1].Id; }
        });

        // Sets the current state of the ribbon.
        ribbonState = ribbonStates.Showed_Initialized;

        $scope.isInitializing = false;
    }


    $scope.isLoading = function() {
        return isInitializing;
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
        if (preserveStyle) { OfficeUICore.StateManagement.SetCookie(COOKIE_NAME_OFFICEUI_CURRENT_COLOR, styleName, 365); }

        $scope.Style = stylesheetFactory.changeStyle(styleName);
    }

    /**
     * @type       Function
     * @name       changeTheme
     *
     * @param      themeName (string):          The name of the theme to load. This should be a name which has been
     *                                          defined in the 'availableThemes' array.
     *
     * @notes
     * The themes which can be loaded are defined in the variable 'availableThemes'.
     * When you pass a style which either match multiple entries or no entries an error is thrown.
     */
    $scope.changeTheme = function(themeName) {
        if (preserveTheme) { OfficeUICore.StateManagement.SetCookie(COOKIE_NAME_OFFICEUI_CURRENT_THEME, themeName, 365); }

        $scope.Theme = stylesheetFactory.changeTheme(themeName);
    }

    /**
     * @type        Function
     * @name        refresh
     *
     * @notes
     * Refresh the current scope so that changes are visible on the website.
     */
    $scope.refresh = function() {
        $scope.$apply();
    }

    /**
     * @type        Function
     * @name        isTabActive
     *
     * @param       tabId
     *              The id of the element that identifies the tab to check.
     *
     * @returns     {boolean} True is the given tab is active, false otherwise.
     *
     * @notes
     * Check if a given tab is active, based on it's id.
     */
    $scope.isTabActive = function(tabId) {
        return activeTab == tabId;
    }

    /**
     * @type        Function
     * @name        setActiveTab
     *
     * @param       tabId
     *              The id of the tab which you want to activate.
     *
     * @notes
     * Set a tab as the currently active tab based on it's id.
     */
    $scope.setActiveTab = function(tabId) {
        // Set the ribbon state as being showed when it was hidden.
        if (ribbonState == ribbonStates.Hidden) { ribbonState = ribbonStates.Visible; }

        activeTab = tabId;

        if (preserveRibbonState) { OfficeUICore.StateManagement.SetCookie(COOKIE_NAME_RIBBON_ACTIVE_TAB,  activeTab, 365); }
    }

    /**
     * @type        Function
     * @name        isAnyContextualGroupActive
     *
     * @returns     {boolean}
     *
     * @notes
     * Check if any contextual group is being active or not.
     */
    $scope.isAnyContextualGroupActive = function() {
        return activeContextualGroups.length > 0;
    }

    /**
     * @type        Function
     * @name        isContextualGroupActive
     *
     * @param       contextualGroupId       The id of the contextual group which you want to check for being active.
     *
     * @returns     {boolean}   True if any contextual group is being active, false otherwise.
     *
     * @notes
     * Checks if any contextual group is being marked as active.
     */
    $scope.isContextualGroupActive = function(contextualGroupId) {
        var matches = jQuery.grep(activeContextualGroups, function(item) {
            return(item === contextualGroupId);
        });

        return matches.length > 0;
    }

    /**
     * @type        Function
     * @name        activateContextualGroup
     *
     * @param       contextualGroupId       The id of the contextual group to activate.
     *
     * @notes
     * Activate a contextual group by it's id.
     */
    $scope.activateContextualGroup = function(contextualGroupId) {
        activeContextualGroups.push(contextualGroupId);
    }

    /**
     * @type        Function
     * @name        deactivateContextualGroup
     *
     * @param       contextualGroupId       The id of the contextual group to deactivate.
     *
     * @notes
     * Deactivate a contextual group by it's id.
     */
    $scope.deactivateContextualGroup = function(contextualGroupId) {
        activeContextualGroups = jQuery.grep(activeContextualGroups, function(value) {
            return value != contextualGroupId;
        });

        // Check if the group which is being is deactivated does hold a tab which is currently active.
        // If that's the case, we should activate the first tab in the entire ribbon.
        var contextualGroup = $('#' + contextualGroupId);
        var tabs = $('.contextual-tab', contextualGroup);

        var match = jQuery.grep(tabs, function(tab) {
            var tabId = $(tab).attr('id');
            return (tabId === activeTab);
        })

        // Select the first available tab is required.
        if (match.length > 0) { $scope.setActiveTab($('.tab:not(.application)', '.ribbon').attr('id')); }

        if (preserveRibbonState) { OfficeUICore.StateManagement.SetCookie(COOKIE_NAME_RIBBON_ACTIVE_TAB,  activeTab, 365); }
    }

    /**
     * @type        Function
     * @name        ribbonScroll
     *
     * @param       scrollEvent     The scroll event, which is passed from the DOMMouseScroll or mousewheel event.
     *
     * @notes
     * Sets the next as active when you're scrolling on the page.
     */
    $scope.ribbonScroll = function(scrollEvent) {
        var activeTab = $('.ribbon .active');
        var tabToActivate = null;

        // Scrolling forward, meaning that the next active tab should be activated.
        if (scrollEvent.detail > 0 || scrollEvent.wheelDelta < 0) {
            if (activeTab.hasClass('contextual-tab') && activeTab.next().length > 0) { tabToActivate = activeTab.next(); }
            else {
                var closestTab = $(activeTab).parent().parent();
                if ($(closestTab).next().length > 0) { tabToActivate = $('.tab', closestTab.next()); }
            }
        } else { // Scrolling backward, meaning that the previous active tab should be activated.
            if (activeTab.hasClass('contextual-tab') && activeTab.prev().length > 0) { tabToActivate = activeTab.prev(); }
            else {
                var closestTab = $(activeTab).parent().parent();
                if ($(closestTab).prev().length > 0 && !$('.tab', closestTab.prev()).hasClass('application')) { tabToActivate = $('.tab', closestTab.prev()).last(); }
            }
        }

        if (tabToActivate != null) { $scope.setActiveTab(tabToActivate.attr('id')); }
        if (preserveRibbonState && tabToActivate != null) { OfficeUICore.StateManagement.SetCookie(COOKIE_NAME_RIBBON_ACTIVE_TAB, tabToActivate.attr('id'), 365); }
    }

    /**
     * @type        Function
     * @name        setActiveTabOnHover
     *
     * @param       tabId       The id of the tab to activate.
     *
     * @notes
     * Set a tab as being active when hovering onto it.
     * This function will check if it's allowed to change the active tab on hover. If that's the case, the active tab
     * is being changed.
     */
    $scope.setActiveTabOnHover = function(tabId) {
        if (changeActiveTabOnHover) { $scope.setActiveTab(tabId); }
    }

    /**
     * @type        Function
     * @name        setActiveTabColor
     *
     * @param       tabId       The id of the tab.
     * @param       tabColor    The color of the tab.
     * @returns     {*}         The color of the tab.
     *
     * @notes
     * This method will change the color of the active tab, but only when the tab is active.
     * Otherwise, no color is returned and the default color is used.
     */
    $scope.setActiveTabColor = function(tabId, tabColor) {
        if (activeTab == tabId) { return tabColor; }
    }

    /**
     * @type        Function
     * @name        isRibbonShowed
     *
     * @returns     {boolean}
     *
     * @note
     * Check's the state of the ribbon. Return true if it's showed, false otherwise.
     */
    $scope.isRibbonShowed = function() {
        return ribbonState == ribbonStates.Showed;
    }

    $scope.isRibbonInitialized = function() {
        return ribbonState == ribbonStates.Showed_Initialized;
    }

    /**
     * @type        Function
     * @name        isRibbonVisible
     *
     * @returns     {boolean}
     *
     * @note
     * Check's the state of the ribbon. Return true if it's visible, false otherwise.
     */
    $scope.isRibbonVisible = function() {
        return ribbonState == ribbonStates.Visible;
    }

    /**
     * @type        Function
     * @name        isRibbonHidden
     *
     * @returns     {boolean}
     *
     * @note
     * Check's the state of the ribbon. Return true if it's hidden, false otherwise.
     */
    $scope.isRibbonHidden = function() {
        return ribbonState == ribbonStates.Hidden;
    }

    /**
     * @type        Function
     * @name        toggleRibbonState
     *
     * @note
     * The function will toggle the ribbon state.
     * This means that if the ribbon is visible, it will become showed.
     * If the ribbon is showed, it will become hidden.
     */
    $scope.toggleRibbonState = function() {
        if (ribbonState == ribbonStates.Showed || ribbonState == ribbonStates.Showed_Initialized) { ribbonState = ribbonStates.Hidden; }
        if (ribbonState == ribbonStates.Visible) { ribbonState = ribbonStates.Showed; }
    }

    /**
     * @type            Event Handler
     * @name            N.A.
     *
     * @description
     * Makes sure that when you click on the window and the state of the ribbon is set to 'Visible', that the ribbon
     * becomes hidden again.
     * This is done to mimic the same look-and-feel of a native Microsoft Office Application.
     */
    $(window).on('click', function(e) {
        console.log(ribbonState);
        if ($scope.isRibbonVisible()) {
            ribbonState = ribbonStates.Hidden;
        }

        $scope.$apply();
    });
});

/* ---- End: AngularJS Controllers. ---- */

/* ---- AngularJS Directives. ---- */

/**
 * @type            Directive
 * @usage           Attribute
 * @name            toggleClassOnClick
 *
 * @description
 * Defines the 'toggleClassOnClick' directive. This directive allows us to toggle a specific class when you click on
 * a certain element.
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
 *     <img class="application-icon" src="#" data-toggle-class-on-click="active" />
 * </div>
 *
 * @remarks
 * We're also binding the event handler 'mouseout' on the element. This is, because when you click on the element
 * and then you move away your mouse, the class 'active-ie-fix' doesn't get removed. It's only get removed if you
 * click on the element again. Now the class is also removed when your mouse leave the element.
 */
OfficeUIModule.directive('toggleClassOnClick', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            var toggleClass = attributes['toggleClassOnClick'];

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

/**
 * @type            Directive
 * @usage           Attribute
 * @name            toggleStyleAttributeOnHover
 *
 * @description
 * Defines the 'toggleStyleAttributeOnHover' directive. This directive allows us to add or remove a specific style on an
 * element when we hover on it.
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
 * <li class="tab contextual-tab label" data-toggle-style-attribute-on-hover='{"background-color": "red"}'>
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
OfficeUIModule.directive('toggleStyleAttributeOnHover', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attributes){
            var toggleStyleAttribute = attributes['toggleStyleAttributeOnHover'];
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

/**
 * @type            Directive
 * @usage           Attribute
 * @name            onHover
 *
 * @description
 * Defines the 'onHover' directive. This directive allows us to execute an AngularJS when we hover on the element.
 *
 * @example
 * Imagine that we have the following Html:
 *
 * <li class="tab contextual-tab label">
 *     <span>{{tab.Label}}</span>
 * </li>
 *
 * Now, let's say that we have a function in AngularJS named 'myFunction()'.
 * If you want to execute this function, you can modify the HTML to match the following:
 *
 * <li class="tab contextual-tab label" data-on-hover="myFunction()">
 *     <span>{{tab.Label}}</span>
 * </li>
 */
OfficeUIModule.directive('onHover', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attributes){
            var hoverAttribute = attributes['onHover'];

            // Bind the mouse enter event handler.
            element.bind('mouseenter', function() {
                scope.$apply(hoverAttribute);
            });
        }
    }
});

/**
 * @type            Directive
 * @usage           Attribute
 * @name            onScroll
 *
 * @description
 * Defines the 'onScroll' directive. This directive allows us to execute an AngularJS function when we're scrolling on
 * the element.
 *
 * @example
 * Imagine that we have the following Html:
 *
 * <ul class="tabs_content">
 *     <li></li>
 * </ul>
 *
 * Now, let's say that we have a function named 'ribbonScroll' that we want to execute when we scroll on that element,
 * then the Html can be adapted to match the following:
 *
 * <ul class="tabs_content" data-on-scroll="ribbonScroll">
 *     <li></li>
 * </ul>
 *
 * @remarks
 * This directive is implementing 'e.preventDefault()'. This does mean that default events are not executed anymore.
 * In this particular case, it's used to make sure that the page does not scroll when we scroll on the element which
 * has implemented this directive.
 */
OfficeUIModule.directive('onScroll', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attributes){
            var scrollAttribute = attributes['onScroll'];

            // Bind the mousewheel event handler.
            element.on('DOMMouseScroll mousewheel', function (e) {
                scope.$apply(function(self) {
                    self[scrollAttribute](e.originalEvent);
                });

                // Prevent default actions from happening.
                e.preventDefault();
            });
        }
    }
});

/**
 * @type            Directive
 * @usage           Attribute
 * @name            dynamicEventHandling
 *
 * @description
 * Defines the 'dynamicEventHandling' directive. This directive allows us to bind events to this element using the
 * OfficeUI.Core library.
 *
 * @remarks
 * When you want to bind an event handler to a given event, it should be done by using the code:
 *
 * $.fn.OfficeUICore.Bind(element, handler, action).
 *
 * See the method 'Bind' in 'OfficeUICore' library for more information on how it should be used.
 */
OfficeUIModule.directive('dynamicEventHandling', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            var idAttribute = attributes['id'];

            if (typeof idAttribute === 'undefined' || idAttribute == '') { OfficeUICore.Exceptions.officeUIDynamicEventHandlingException('The directive \'dynamicEventHandling\' could not be placed on an element without an id attribute.'); }
            else {
                var registeredEvent = OfficeUICore.SearchEvent('#' + idAttribute);

                if (registeredEvent != null) {
                    element.on(registeredEvent.handler, function() {
                        registeredEvent.action();
                    });
                }
            }
        }
    }
});

OfficeUIModule.directive('stopPropagation', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind(attr.stopPropagation, function (e) {
                e.stopPropagation();
            });
        }
    };
});

/* ---- End: AngularJS Directives. ---- */








