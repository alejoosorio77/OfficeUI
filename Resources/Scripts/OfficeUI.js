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
        if (typeof $.fn.OfficeUI.Settings.OfficeUIConfigurationFileLocation === 'undefined' || $.fn.OfficeUI.Settings.OfficeUIConfigurationFileLocation == '') { new OfficeUIConfigurationException('The OfficeUI Configuration file is not defined.'); }
            return $http.get($.fn.OfficeUI.Settings.OfficeUIConfigurationFileLocation)
                .then(function (response) {
                    return {
                        Styles: response.data.Styles,
                        DefaultStyle: response.data.DefaultStyle,
                        Themes: response.data.Themes,
                        DefaultTheme: response.data.DefaultTheme
                    };
                }, function(error) { new OfficeUILoadingException('The OfficeUI Configuration file: \'' + $.fn.OfficeUI.Settings.OfficeUIConfigurationFileLocation + '\' could not be loaded.'); });
        }
    }
});

/**
 * @type        Service
 * @name        OfficeUIRibbonConfigurationService
 *
 * @notes
 * Provides a service which will read the necessary configuration file which is required for the OfficeUI ribbon
 * to function properly.
 */
OfficeUIModule.factory('OfficeUIRibbonConfigurationService', function($http) {
    // Defines what needs to be returned by the service.
    return {

        /**
         * @type        Function
         * @name        getOfficeUIRibbonConfiguration
         *
         * @returns     {HttpPromise}:      A promise which is loading the OfficeUI ribbon configuration file.
         */
        getOfficeUIRibbonConfiguration: function() {
            if (typeof $.fn.OfficeUI.Settings.OfficeUIRibbonConfigurationFile === 'undefined' || $.fn.OfficeUI.Settings.OfficeUIRibbonConfigurationFile == '') { new OfficeUIConfigurationException('The OfficeUI Ribbon Configuration file is not defined.'); }
            return $http.get($.fn.OfficeUI.Settings.OfficeUIRibbonConfigurationFile)
                .then(function (response) {
                    return {
                        ChangeActiveTabOnHover: response.data.ChangeActiveTabOnHover
                    };
                }, function(error) { new OfficeUILoadingException('The OfficeUI Ribbon Configuration file: \'' + $.fn.OfficeUI.Settings.OfficeUIRibbonConfigurationFile + '\' could not be loaded.'); });
        }
    }
});

/**
 * @type        Service
 * @name        OfficeUIApplicationDefinitionService
 *
 * @notes
 * Provides a service which will read the necessary application definition file. Based on this file, various elements will be placed on the website.
 */
OfficeUIModule.factory('OfficeUIApplicationDefinitionService', function($http) {
    // Defines what needs to be returned by the service.
    return {

        /**
         * @type        Function
         * @name        getOfficeUIConfiguration
         *
         * @returns     {HttpPromise}:      A promise which is loading the OfficeUI application definition file.
         */
        getOfficeUIApplicationDefinition: function() {
            if (typeof $.fn.OfficeUI.Settings.OfficeUIApplicationDefinitionFileLocation === 'undefined' || $.fn.OfficeUI.Settings.OfficeUIApplicationDefinitionFileLocation == '') { new OfficeUIConfigurationException('The OfficeUI application definition file is not defined.'); }
            return $http.get($.fn.OfficeUI.Settings.OfficeUIApplicationDefinitionFileLocation)
                .then(function (response) {
                    return {
                        Title: response.data.Title,
                        Icons: response.data.Icons
                    };
                }, function(error) { new OfficeUILoadingException('The OfficeUI application definition file: \'' + $.fn.OfficeUI.Settings.OfficeUIApplicationDefinitionFileLocation + '\' could not be loaded.'); });
        }
    }
});

/**
 * @type        Service
 * @name        OfficeUIRibbonDefinitionService
 *
 * @notes
 * Provides a service which will read the necessary ribbon definition file. Based on this file, various elements will be placed on the website.
 */
OfficeUIModule.factory('OfficeUIRibbonDefinitionService', function($http) {
    // Defines what needs to be returned by the service.
    return {

        /**
         * @type        Function
         * @name        getOfficeUIConfiguration
         *
         * @returns     {HttpPromise}:      A promise which is loading the OfficeUI ribbon definition file.
         */
        getOfficeUIRibbonDefinition: function() {
            if (typeof $.fn.OfficeUI.Settings.OfficeUIRibbonDefinitionFileLocation === 'undefined' || $.fn.OfficeUI.Settings.OfficeUIRibbonDefinitionFileLocation == '') { new OfficeUIConfigurationException('The OfficeUI ribbon definition file is not defined.'); }
            return $http.get($.fn.OfficeUI.Settings.OfficeUIRibbonDefinitionFileLocation)
                .then(function (response) {
                    return {
                        Tabs: response.data.Tabs,
                        ContextualGroups: response.data.ContextualGroups
                    };
                }, function(error) { new OfficeUILoadingException('The OfficeUI ribbon definition file: \'' + $.fn.OfficeUI.Settings.OfficeUIRibbonDefinitionFileLocation + '\' could not be loaded.'); });
        }
    }
});

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
    var defaultStyle = '';
    var availableThemes = [];
    var defaultTheme = '';

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
            availableThemes = response.Themes;
            defaultTheme = response.DefaultTheme
        });

        return promise;
    }

    /**
     * @type       Function
     * @name       changeStyle
     *
     * @param      styleName (string):         The name of the style to load. This should be a name which has been
     *                                         defined in the 'availableStyles' array.
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

    /**
     * @type        Function
     * @name        changeTheme
     *
     * @param       themeName (string):     The name of the theme to load. This should be a name which has been defined
     *                                      in the 'availableThemes' array.
     *
     * @return     string:      The url of the stylesheet to load.
     *
     * @notes
     * The themes which can be loaded are defined in the variable 'availableThemes'.
     * When you pass a style which either match multiple entries or no entries, and error is thrown.
     */
    stylesheetFactoryServiceIntsance.changeTheme = function(themeName) {
        var foundThemes = JSPath.apply('.{.name == "' + themeName + '"}', availableThemes);

        if (foundThemes.length == 0) { new OfficeUIStylesheetException('A theme with name \'' + themeName + '\' could not be found. Is the style defined in the \'availableThemes\' array?'); }
        else if (foundThemes.length > 1) { new OfficeUIStylesheetException('Multiple entries in the \'availableThemes\' array matches a style with name \'' + themeName + '\''); }
        else if (foundThemes.length == 1) { return foundThemes[0].stylesheet; }
    }

    // Return the instance of the service.
    return stylesheetFactoryServiceIntsance;
}]);

/**
 * @type        Service
 * @name        applicationDefinitionFactory
 *
 * @notes
 * Provides common work to work with an OfficeUI application using the AngularJS way.
 */
OfficeUIModule.factory('officeUIRibbonConfigurationFactory', ['$http', 'OfficeUIRibbonConfigurationService', function($http, OfficeUIRibbonConfigurationService) {
    // Define the service instance. This one is returned from the factory and it's through this instance that the
    // required methods will be called. Thus all methods that this service needs to expose needs to be defined on this
    // particular object.
    var officeUIRibbonConfigurationFactoryInstance = {};

    // Defines the variables which are needed for this service.
    var changeActiveTabOnHover = null;

    /**
     * @type        Function
     * @name        getOfficeUIApplicationDefinition
     *
     * @returns     {HttpPromise}:      A Http Promise which the application does use to wait for asynchronous calls to
     *                                  complete.
     */
    officeUIRibbonConfigurationFactoryInstance.getOfficeUIRibbonConfiguration = function() {
        var promise = OfficeUIRibbonConfigurationService.getOfficeUIRibbonConfiguration();

        promise.then(function(response){});

        return promise;
    }

    return officeUIRibbonConfigurationFactoryInstance;
}]);

/**
 * @type        Service
 * @name        applicationDefinitionFactory
 *
 * @notes
 * Provides common work to work with an OfficeUI application using the AngularJS way.
 */
OfficeUIModule.factory('applicationDefinitionFactory', ['$http', 'OfficeUIApplicationDefinitionService', function($http, OfficeUIApplicationDefinitionService) {
    // Define the service instance. This one is returned from the factory and it's through this instance that the
    // required methods will be called. Thus all methods that this service needs to expose needs to be defined on this
    // particular object.
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

    return applicationDefinitionFactoryInstance;
}]);

/**
 * @type        Service
 * @name        ribbonDefinitionFactory
 *
 * @notes
 * Provides common work to work with an OfficeUI ribbon using the AngularJS way.
 */
OfficeUIModule.factory('ribbonDefinitionFactory', ['$http', 'OfficeUIRibbonDefinitionService', function($http, OfficeUIRibbonDefinitionService) {
    // Define the service instance. This one is returned from the factory and it's through this instance that the
    // required methods will be called. Thus all methods that this service needs to expose needs to be defined on this
    // particular object.
    var ribbonDefinitionFactoryInstance = {};

    // Defines the variables which are needed for this service.
    var tabs = [];
    var contextualGroups = '';

    /**
     * @type        Function
     * @name        getOfficeUIRibbonDefinition
     *
     * @returns     {HttpPromise}:      A Http Promise which the application does use to wait for asynchronous calls to
     *                                  complete.
     */
    ribbonDefinitionFactoryInstance.getOfficeUIRibbonDefinition = function() {
        var promise = OfficeUIRibbonDefinitionService.getOfficeUIRibbonDefinition();

        promise.then(function(response){});

        return promise;
    }

    return ribbonDefinitionFactoryInstance;
}]);

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
    var activeTab = null; // Variable that holds the currently active tab.
    var changeActiveTabOnHover = null; // Variable that defines if an active tab should be changed when hovering on it.

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
            $scope.Style = stylesheetFactory.changeStyle(data.DefaultStyle);
            $scope.Theme = stylesheetFactory.changeTheme(data.DefaultTheme);
        });

        // Initialize the application definition factory to make sure that all the data has been loaded.
        applicationDefinitionFactory.getOfficeUIApplicationDefinition().then(function(data) {
            $scope.Title = data.Title;
            $scope.Icons = data.Icons;
        });

        // Initialize the ribbon definition factory to make sure that all the data has been loaded.
        ribbonDefinitionFactory.getOfficeUIRibbonDefinition().then(function(data) {
            $scope.Tabs = data.Tabs;
            $scope.ContextualGroups = data.ContextualGroups;

            // Set the first tab (not the application tab, as the currently active tab).
            activeTab = $scope.Tabs[1].Id;
        });

        officeUIRibbonConfigurationFactory.getOfficeUIRibbonConfiguration().then(function(data) {
            changeActiveTabOnHover = data.ChangeActiveTabOnHover;
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
        activeTab = tabId;
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

        // Scrolling forward, meaning that the next active tab should be activated.
        if (scrollEvent.detail > 0 || scrollEvent.wheelDelta < 0) {
            var closestTab = $(activeTab).parent().parent();
            var nextTab = $(closestTab).next();
            var tabToActivate = $('.tab', nextTab);
        } else { // Scrolling backward, meaning that the previous active tab should be activated.

        }

        if (tabToActivate != null) { $scope.setActiveTab(tabToActivate.attr('id')); }
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
});

/**
 * @type        Directive
 * @name        toggleClassOnClick
 *
 * @notes
 * Defines the 'toggleClassOnClick' directive. This directive allows us to toggle a specific class when you click on
 * a certain element.
 */
OfficeUIModule.directive('toggleClassOnClick', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            var toggleClass = attributes['toggleClassOnClick'];

            // Bind the necessary event handlers and add the toggled class to the correct element.
            element.bind('mousedown mouseup', function() {
                element.toggleClass(toggleClass);
            });
        }
    }
});

/**
 * @type        Directive
 * @name        toggleStyleAttributeOnHover
 *
 * @notes
 * Defines the 'toggleClassOnHover' directive. This directive allows us to add or remove a specific style on an
 * element when we hover on it.
 * Note, the added class will only be removed when the element doesn't have a class 'active'.
 */
OfficeUIModule.directive('toggleStyleAttributeOnHover', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attributes){
            var toggleStyleAttribute = attributes['toggleStyleAttributeOnHover'];
            var toggleStyleAttributes = JSON.parse(toggleStyleAttribute)

            // Bind the necessary event handlers and add the toggled class to the correct element.
            element.bind('mouseleave', function() {
                $.each(toggleStyleAttributes, function(key, value){
                    if (!element.hasClass('active')) {
                        element.css(key, 'inherit');
                    }
                });
            });

            element.bind('mouseenter', function() {
                $.each(toggleStyleAttributes, function(key, value){
                    element.css(key, value);
                });
            });
        }
    }
});

/**
 * @type        Directive
 * @name        onHover
 *
 * @notes
 * Defines the 'onHover' directive. This directive allows us to execute a function when we hover on the element.
 */
OfficeUIModule.directive('onHover', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attributes){
            var hoverAttribute = attributes['onHover'];

            // Bind the necessary event handlers and add the toggled class to the correct element.
            element.bind('mouseenter', function() {
                scope.$apply(hoverAttribute);
            });
        }
    }
});

/**
 * @type        Directive
 * @name        onScroll
 *
 * @notes
 * Defines the 'onScroll' directive. This directive allows us to execute a function when we're scrolling on the element.
 */
OfficeUIModule.directive('onScroll', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attributes){
            var scrollAttribute = attributes['onScroll'];

            // Bind the necessary event handlers and add the toggled class to the correct element.
            element.on('DOMMouseScroll mousewheel', function (e) {
                scope.$apply(function(self) {
                    self[scrollAttribute](e.originalEvent);
                });

                e.preventDefault();
            });
        }
    }
});

/**
 * @type        Directive
 * @name        dynamicEventHandling
 *
 * @notes
 * Defines the 'dynamicEventHandling' directive. This directive allows us to toggle a specific class when you click on
 * a certain element.
 */
OfficeUIModule.directive('dynamicEventHandling', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            var idAttribute = attributes['id'];

            if (typeof idAttribute === 'undefined' || idAttribute == '') { new OfficeUIDynamicEventHandlingException('The directive \'dynamicEventHandling\' could not be placed on an element without an id attribute.'); }
            else {
                var registeredEvent = $.fn.OfficeUICore.searchEvent(idAttribute);

                if (registeredEvent != null) {
                element.on(registeredEvent.handler, function() {
                    registeredEvent.action();
                });
            }
            }
        }
    }
});








