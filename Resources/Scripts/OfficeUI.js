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
var OfficeUIModule = angular.module('OfficeUI', ['ngSanitize']);

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

/* ---- End: AngularJS Services. ---- */

/* ---- AngularJS Controllers. ---- */

/**
 * @type            Controller
 * @name            OfficeUIController
 *
 * @description
 * Defines the 'OfficeUIController' controller. By this controller, everything for an OfficeUI application is
 * controlled.
 *
 * @dependencies    stylesheetFactory                   The factory which is used to manage stylesheets on the website.
 *                  OfficeUIApplicationDefinitionService        Provides the definition for the OfficeUI application.
 *                  OfficeUIRibbonDefinitionService     Provides the definition for the OfficeUI ribbon.
 *                  OfficeUIRibbonConfigurationService  Provides the configuration for the OfficeUI ribbon.
 */
OfficeUIModule.controller('OfficeUIController', function(stylesheetFactory, OfficeUIApplicationDefinitionService,
                                                         OfficeUIRibbonDefinitionService, OfficeUIRibbonConfigurationService,
                                                         $scope) {
    /**
     * @description
     * Defines the various states that a ribbon can have. A ribbon in an OfficeUI application can have 3 different
     * states. See the information below to our when the ribbon has which states.
     *
     * @type    {{Hidden: number, Visible: number, Showed: number, Showed_Initialized}}
     *          Hidden:                 The ribbon is hidden completely from view. It can only be showed when you click
     *                                  on one of the tabs.
     *          Visible:                The ribbon is visible for the end-user but does not remain visible.
     *                                  Once the focus from the ribbon has been lost for some time, the ribbon becomes
     *                                  invisible.
     *          Showed:                 The ribbon is showed for the end user and does not collapse when the focus is
     *                                  lost.
     *          Showed_Initialized:     The default initialization state of the ribbon.
     *                                  We need this special value to ensure that contents on the website are not being
     *                                  animated.
     *
     * @remarks
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

    // Constants: Various constants of the application.
    var COOKIE_NAME_RIBBON_ACTIVE_TAB = 'OfficeUI_Ribbon_ActiveTab';
    var COOKIE_NAME_OFFICEUI_CURRENT_STYLE = 'OfficeUI_CurrentStyle';
    var COOKIE_NAME_OFFICEUI_CURRENT_THEME = 'OfficeUI_CurrentTheme';
    var COOKIE_VALIDATY = 365;

    // Variables: Various variables that are required for the OfficeUIController to execute.
    var activeTab = null;
    var stylesheetData = null;
    var ribbonConfigurationData = [];
    var activeContextualGroups = [];
    var ribbonState = ribbonStates.Showed_Initialized;

    // Gets the values from the cookies which are used to initialize the ribbon.
    var previousActiveTab = OfficeUICore.StateManagement.GetCookie(COOKIE_NAME_RIBBON_ACTIVE_TAB);
    var previousStyle = OfficeUICore.StateManagement.GetCookie(COOKIE_NAME_OFFICEUI_CURRENT_STYLE);
    var previousTheme = OfficeUICore.StateManagement.GetCookie(COOKIE_NAME_OFFICEUI_CURRENT_THEME);

    Initialize();

    /**
     * @type            Function
     * @name            Initialize
     *
     * @description
     * Initializes the OfficeUI application by loading all the required files and adjusting the properties as needed.
     */
    function Initialize() {
        // Load the 'stylesheetFactory' which is used to manage the various styles.
        stylesheetFactory.getOfficeUIConfiguration().then(function (data) {
            stylesheetData = data;

            // Set the style to the previously found style in the cookie or the default style if it's not found.
            if (previousStyle == '') {
                $scope.Style = stylesheetFactory.changeStyle(stylesheetData.DefaultStyle);
            }
            else {
                $scope.Style = stylesheetFactory.changeStyle(previousStyle);
            }

            // Set the theme to the previously found theme in the cookie or the default theme if it's not found.
            if (previousTheme == '') {
                $scope.Theme = stylesheetFactory.changeTheme(stylesheetData.DefaultTheme);
            }
            else {
                $scope.Theme = stylesheetFactory.changeTheme(previousTheme);
            }
        });

        // Load the 'OfficeUIApplicationDefinitionService' in which the OfficeUI application data is stored.
        OfficeUIApplicationDefinitionService.getOfficeUIApplicationDefinition().then(function (data) {
            $scope.Title = data.Title;
            $scope.Icons = data.Icons;
        });

        // Load the 'OfficeUIRibbonConfigurationService' in which the OfficeUI ribbon data is stored.
        OfficeUIRibbonConfigurationService.getOfficeUIRibbonConfiguration().then(function(data) {
            ribbonConfigurationData = data;
        });

        // Load the 'OfficeUIRibbonDefinitionService' in which the configuration for the ribbon is found.
        OfficeUIRibbonDefinitionService.getOfficeUIRibbonDefinition().then(function(data) {
            $scope.Tabs = data.Tabs;
            $scope.ContextualGroups = data.ContextualGroups;

            // Set the first tab (not the application tab, as the currently active tab).
            if (ribbonConfigurationData.PreserveRibbonState && previousActiveTab != '') {
                var matches = jQuery.grep($scope.Tabs, function(tab) {
                    return tab.Id === previousActiveTab;
                });

                if (matches.length > 0) { activeTab = previousActiveTab; }
                else { activeTab = $scope.Tabs[1].Id; }
            } else { activeTab = $scope.Tabs[1].Id; }
        });
    }

    /**
     * @type            Function
     * @name            changeStyle
     *
     * @param           styleName (string):         The name of the style to load. This should be a name which has been
     *                                              defined in the 'availableStyles' array.
     *
     * @description
     * Change the style of the application.
     * When the style of the application should be preserved, then this value is stored inside a cookie and then
     * changed. By doing this, when you refresh the page, it's this style that will be loaded.
     * When the style of the application does not need to be preserved, the style is just changed without saving the
     * chosen value.
     */
    $scope.changeStyle = function(styleName) {
        if (stylesheetData.PreserveStyle) { OfficeUICore.StateManagement.SetCookie(COOKIE_NAME_OFFICEUI_CURRENT_STYLE, styleName, COOKIE_VALIDATY); }

        $scope.Style = stylesheetFactory.changeStyle(styleName);
    }

    /**
     * @type            Function
     * @name            changeTheme
     *
     * @param           themeName (string):         The name of the theme to load. This should be a name which has been
     *                                              defined in the 'availableThemes' array.
     *
     * @description
     * Change the theme of the application.
     * When the theme of the application should be preserved, then this value is stored inside a cookie and then
     * changed. By doing this, when you refresh the page, it's this theme that will be loaded.
     * When the theme of the application does not need to be preserved, the theme is just changed without saving the
     * chosen value.
     */
    $scope.changeTheme = function(themeName) {
        if (stylesheetData.PreserveTheme) { OfficeUICore.StateManagement.SetCookie(COOKIE_NAME_OFFICEUI_CURRENT_THEME, themeName, COOKIE_VALIDATY); }

        $scope.Theme = stylesheetFactory.changeTheme(themeName);
    }

    /**
     * @type            Function
     * @name            refresh
     *
     * @description
     * Refresh the current scope.
     * This is required when you're executing actions that needs to have an explicit reset.
     */
    $scope.refresh = function() {
        $scope.$apply();
    }

    /**
     * @type            Function
     * @name            isTabActive
     *
     * @description
     * Check if a given tab is active, based on it's id.
     *
     * @param           tabId (string):     The if of the element that identified the element for being active.
     *
     * @returns         {boolean} True is the given tab is active, false otherwise.
     */
    $scope.isTabActive = function(tabId) {
        return activeTab == tabId;
    }

    /**
     * @type            Function
     * @name            setActiveTab
     *
     * @description
     * Set a tab as the currently active tab based on it's id.
     *
     * @param           tabId
     *                  The id of the tab which you want to activate.
     *
     * @remarks
     * When the state of the ribbon should be preserved, the value of the active tab is being stored in a cookie.
     * This makes sure that when you load the page, the active tab will become the active tab stored in the cookie.
     * When the state of the ribbon should not be preserved, the active tab is just changed.
     */
    $scope.setActiveTab = function(tabId) {
        // Set the ribbon state as being showed when it was hidden.
        if (ribbonState == ribbonStates.Hidden) { ribbonState = ribbonStates.Visible; }

        activeTab = tabId;

        if (ribbonConfigurationData.PreserveRibbonState) { OfficeUICore.StateManagement.SetCookie(COOKIE_NAME_RIBBON_ACTIVE_TAB, activeTab, COOKIE_VALIDATY); }
    }

    /**
     * @type            Function
     * @name            isAnyContextualGroupActive
     *
     * @description
     * Check if any contextual group is being active or not.
     *
     * @returns         {boolean} True when any contextual group is being active, false otherwise.
     */
    $scope.isAnyContextualGroupActive = function() {
        return activeContextualGroups.length > 0;
    }

    /**
     * @type            Function
     * @name            isContextualGroupActive
     *
     * @description
     * Checks if contextual group is being active (based on it's id).
     *
     * @param           contextualGroupId (string):     The id of the contextual group which you want to check for
     *                                                  being active.
     *
     * @returns         {boolean}   True if the contextual group is being active, false otherwise.
     */
    $scope.isContextualGroupActive = function(contextualGroupId) {
        var matches = jQuery.grep(activeContextualGroups, function(item) {
            return(item === contextualGroupId);
        });

        return matches.length > 0;
    }

    /**
     * @type            Function
     * @name            activateContextualGroup
     *
     * @description
     * Activate a contextual group by it's id.
     *
     * @param           contextualGroupId (string):     The id of the contextual group to activate.
     */
    $scope.activateContextualGroup = function(contextualGroupId) {
        activeContextualGroups.push(contextualGroupId);
    }

    /**
     * @type            Function
     * @name            deactivateContextualGroup
     *
     * @notes
     * Deactivate a contextual group by it's id.
     *
     * @param           contextualGroupId (string)       The id of the contextual group to deactivate.
     *
     * @remarks
     * When you deactivate a contextual group and the currently active tab is a tab element defined in the contextual
     * group, then the active tab should be set to the first non-application tab in the entire ribbon.
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
    }

    /**
     * @type            Function
     * @name            ribbonScroll
     *
     * @description
     * Sets the next as active when you're scrolling on the page.
     *
     * @param           scrollEvent (event):    The scroll event, which is passed from the DOMMouseScroll or mousewheel
     *                                          event.
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
    }

    /**
     * @type            Function
     * @name            setActiveTabOnHover
     *
     * @description
     * Set a tab as being active when hovering onto it.
     * This function will check if it's allowed to change the active tab on hover. If that's the case, the active tab
     * is being changed.
     *
     * @param           tabId (string):     The id of the tab to activate.
     */
    $scope.setActiveTabOnHover = function(tabId) {
        if (ribbonConfigurationData.ChangeActiveTabOnHover) { $scope.setActiveTab(tabId); }
    }

    /**
     * @type            Function
     * @name            setActiveTabColor
     *
     * @description
     * This method will change the color of the active tab, but only when the tab is active.
     * Otherwise, no color is returned and the default color is used.
     *
     * @param           tabId (string):     The id of the tab.
     * @param           tabColor (string):  The color of the tab.

     * @returns         {*}                 The color of the tab.
     */
    $scope.setActiveTabColor = function(tabId, tabColor) {
        if (activeTab == tabId) { return tabColor; }
    }

    /**
     * @type            Function
     * @name            isRibbonShowed
     *
     * @description.
     * Check's if the ribbon is showed.
     *
     * @returns         {boolean}   True if it's showed, false otherwise.
     */
    $scope.isRibbonShowed = function() {
        return ribbonState == ribbonStates.Showed;
    }

    /**
     * @type            Function
     * @name            isRibbonInitialized
     *
     * @description.
     * Check's if the ribbon is initialized.
     *
     * @returns         {boolean}   True if it's initialized, false otherwise.
     */
    $scope.isRibbonInitialized = function() {
        return ribbonState == ribbonStates.Showed_Initialized;
    }

    /**
     * @type            Function
     * @name            isRibbonVisible
     *
     * @description.
     * Check's if the ribbon is visible.
     *
     * @returns         {boolean}   True if it's visible, false otherwise.
     */
    $scope.isRibbonVisible = function() {
        return ribbonState == ribbonStates.Visible;
    }

    /**
     * @type            Function
     * @name            isRibbonHidden
     *
     * @description.
     * Check's if the ribbon is hidden.
     *
     * @returns         {boolean}   True if it's hidden, false otherwise.
     */
    $scope.isRibbonHidden = function() {
        return ribbonState == ribbonStates.Hidden;
    }

    /**
     * @type            Function
     * @name            toggleRibbonState
     *
     * @description.
     * Toggle the state of the ribbon to the next logical state.
     * If the state of the ribbon is 'Showed' or 'Showed_Initialized', then the ribbon will become hidden.
     * If the ribbon is visible, then rhe ribbon does become showed.
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
OfficeUIModule.directive('officeuiToggleClassOnClick', function() {
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

/**
 * @type            Directive
 * @usage           Attribute
 * @name            officeuiToggleStyleAttributeOnHover
 *
 * @description
 * Defines the 'officeuiToggleStyleAttributeOnHover' directive. This directive allows us to add or remove a specific
 * style on an element when we hover on it.
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
 * <li class="tab contextual-tab label" data-officeui-toggle-style-attribute-on-hover='{"background-color": "red"}'>
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
OfficeUIModule.directive('officeuiToggleStyleAttributeOnHover', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attributes){
            var toggleStyleAttribute = attributes['officeuiToggleStyleAttributeOnHover'];
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
 * @name            officeuiOnHover
 *
 * @description
 * Defines the 'officeuiOnHover' directive. This directive allows us to execute an AngularJS when we hover on the
 * element.
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
 * <li class="tab contextual-tab label" data-officeui-on-hover="myFunction()">
 *     <span>{{tab.Label}}</span>
 * </li>
 */
OfficeUIModule.directive('officeuiOnHover', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attributes){
            var hoverAttribute = attributes['officeuiOnHover'];

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
 * @name            officeuiOnScroll
 *
 * @description
 * Defines the 'officeuiOnScroll' directive. This directive allows us to execute an AngularJS function when we're
 * scrolling on the element.
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
 * <ul class="tabs_content" data-officeui-on-scroll="ribbonScroll">
 *     <li></li>
 * </ul>
 *
 * @remarks
 * This directive is implementing 'e.preventDefault()'. This does mean that default events are not executed anymore.
 * In this particular case, it's used to make sure that the page does not scroll when we scroll on the element which
 * has implemented this directive.
 */
OfficeUIModule.directive('officeuiOnScroll', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attributes){
            var scrollAttribute = attributes['officeuiOnScroll'];

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
 * @name            officeuiDynamicEventHandling
 *
 * @description
 * Defines the 'officeuiDynamicEventHandling' directive. This directive allows us to bind events to this element using
 * the OfficeUI.Core library.
 *
 * @remarks
 * When you want to bind an event handler to a given event, it should be done by using the code:
 *
 * $.fn.OfficeUICore.Bind(element, handler, action).
 *
 * See the method 'Bind' in 'OfficeUICore' library for more information on how it should be used.
 */
OfficeUIModule.directive('officeuiDynamicEventHandling', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            var idAttribute = attributes['id'];

            if (typeof idAttribute === 'undefined' || idAttribute == '') { OfficeUICore.Exceptions.officeUIDynamicEventHandlingException('The directive \'officeuiDynamicEventHandling\' could not be placed on an element without an id attribute.'); }
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

/**
 * @type            Directive
 * @usage           Attribute
 * @name            officeuiStopPropagation
 *
 * @description
 * Defines the 'officeuiStopPropagation' directive. This directive allows us to stop propagating an event.
 */
OfficeUIModule.directive('officeuiStopPropagation', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            element.bind(attr.officeuiStopPropagation, function (e) {
                e.stopPropagation();
            });
        }
    };
});

/**
 * @type            Directive
 * @usage           Attribute
 * @name            officeuiTooltip
 *
 * @description
 * Defines the 'officeuiTooltip' directive. This directive allows us to show a tooltip for a specific element.
 */
OfficeUIModule.directive('officeuiTooltip', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attributes) {
            element.bind("mouseenter", function (e) {
                if (!element.hasClass('disabled')) {
                    var tooltipElement = $('.tooltip', element.parent());

                   var tooltipTimeout = setTimeout(function () {
                        $(tooltipElement).show();
                    }, 1000);

                    element.bind("mouseleave", function (e) {
                        clearTimeout(tooltipTimeout);

                        $.fn.OfficeUI.waitHandleHideTooltip = setTimeout(function () {
                            $(tooltipElement).hide();
                        }, 500);
                    });
                }
            });
        }
    };
});

/**
 * @type            Directive
 * @usage           Attribute
 * @name            customControlDropdown
 *
 * @description
 * Defines the 'customControlDropdown' directive. This directive allows us to transform an element into an
 * OfficeUIDropdown element.
 */
OfficeUIModule.directive('customControlDropdown', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attributes) {
            $(element).OfficeUIDropdown();
        }
    };
});

/* ---- End: AngularJS Directives. ---- */

/* ---- AngularJS Filters. ---- */

/**
 * @type            Filter
 * @name            actionLegend
 *
 * @description
 * Provides the 'actionLegend' filter. This filter will append some text to another element is a condition is matched.
 */
OfficeUIModule.filter('actionLegend', function() {
    return function(action) {
        if (action.MenuItems) {
            return action.Legend + ' <i class="fa fa-caret-down"></i>';
        }
        return action.Legend;
    }
});

/* ---- End: AngularJS Filters. ---- */