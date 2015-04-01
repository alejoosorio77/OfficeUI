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
 * @type                Service
 * @name                PreloaderService
 *
 * @description
 * Provides a way to preload data. By using this, we can make sure that for example, icons are being loaded and displayed
 * before we show the element that does contain those images.
 */
OfficeUI.factory('PreloaderService', ['$q', function($q) {
    function Preloader( imageLocations ) {}

    /**
     * @type                Function
     * @name                PreloadImages
     *
     * @description
     * Preload all the images which are passed as an array into this object.
     *
     * @param               imageLocations:     An array containing all the paths that needs to be resolved.
     *
     * @returns {*}
     * A promise containing the images which are being loaded.
     */
    Preloader.PreloadImages = function(imageLocations) {
        var preloader = new Preloader( imageLocations );
        return( preloader.load() );
    }
}]);

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

/**
 * @type                Service
 * @name                PreloaderService
 *
 * @description
 * The 'PreloaderService' enables you to load data in the back-end. By doing this, we can make sure to change a scope
 * value only, and only when the data has been loaded.
 */
OfficeUI.factory('PreloaderService', ['$q', function($q) {
    var preloaderServiceObject = { }; // Defines the object that needs to be returned by the service.

    /**
     * @type                Function
     * @name                Load
     *
     * @description
     * Provides a way to load a resource in the backend.
     *
     * @param               referencePath:      An array containing the resource that should be loaded in the
     *                                          background.
     *
     * @returns {*}
     * An HttpPromise which can be used to wait until this call has been completed.
     */
    preloaderServiceObject.Load = function(referencePath){
        var deferred = $q.defer();

        var preloadedElement = document.createElement('img');
        {
            preloadedElement.onload = deferred.resolve;
            preloadedElement.src = referencePath;
        }

        return deferred.promise;
    }

    // Return the service object itself.
    return preloaderServiceObject;
}]);

/* ---- End: AngularJS Services. ---- */

/* ---- OfficeUI Services (controls). ---- */

/**
 * @type                Service
 * @name                OfficeUIRibbonControlService
 *
 * @description
 * Provides the service which is needed to manage the OfficeUI ribbon control.
 *
 * @dependencies        rootScope:          Used to inject properties into the root scope.
 *                      http:               Used to execute request to external providers.
 *                      q:                  Used to work with promises.
 *                      PreloaderService:   Used to preload images.
 */
OfficeUI.factory('OfficeUIRibbonControlService', ['$rootScope', '$http', '$q', 'PreloaderService', function($rootScope, $http, $q, PreloaderService) {
    var OfficeUIRibbonControlServiceObject = { }; // Defines the object that needs to be returned by the service.

    // Defines all the variables which are needed for this control.
    var activeTab;

    /**
     * @type                Function
     * @name                SetLoadingImage
     *
     * @description
     * Sets the text that should be displayed on the loading screen when this service is being loaded.
     *
     * @param               scope:      The scope object on which the loading message is defined.
     */
    OfficeUIRibbonControlServiceObject.SetLoadingMessage = function(scope) {
        scope.LoadingMessage = 'OfficeUI Ribbon Control Initialization';
    }
    /**
     * @type                Function
     * @name                Initialize
     *
     * @description
     * Initializes the service.
     *
     * @param               configurationFile:      The file that contains the configuration of the service.
     */
    OfficeUIRibbonControlServiceObject.Initialize = function(configurationFile) {
        var deferred = $q.defer();

        $http.get(configurationFile)
            .then(function (response) {
                $rootScope.Tabs = response.data.Tabs;
                $rootScope.ContextualGroups = response.data.ContextualGroups;

                // Sets the currently active tab.
                activeTab = $rootScope.Tabs[1].Id;

                var images = JSPath.apply('.Groups.Areas.Actions.Resource', $rootScope.Tabs);
                images.concat(JSPath.apply('.Tabs.Groups.Areas.Actions.Resource', $rootScope.ContextualGroups));

                var imagesPromise = [];

                $(images).each(function(index, item) {
                    imagesPromise.push(PreloaderService.Load(item));
                });

                $q.all(imagesPromise).then(function() {
                    deferred.resolve();
                });
            });

        return deferred.promise;
    }

    /**
     * @type                Function
     * @name                isTabActive
     *
     * @description
     * Checks if a given tab is active, based on it's id.
     *
     * @param               tabId:      The id of the tab element to check for being active.
     */
    OfficeUIRibbonControlServiceObject.isTabActive = function(tabId) {
        return activeTab == tabId;
    }

    OfficeUIRibbonControlServiceObject.setActiveTab = function(tabId) {
        activeTab = tabId;
    }

    // Return the service object itself.
    return OfficeUIRibbonControlServiceObject;
}]);

/* ---- End: OfficeUI Services (controls). ---- */

/* ---- AngularJS Controllers. ---- */

/**
 * @type                Controller
 * @name                OfficeUIController
 *
 * @description
 * Defines the 'OfficeUIController' controller. By this controller, everything for an OfficeUI application is
 * controlled.
 *
 * @dependencies        CssInjectorService:                     Provides a way to load stylesheets dynamically and
 *                                                              wait for them to be retrieved.
*                       PreloaderService:                       The service which is required for preloading data.
 *                      OfficeUIConfigurationService:           Provides the configuration for an OfficeUI application.
 */
OfficeUI.controller('OfficeUIController', function(CssInjectorService, PreloaderService, OfficeUIConfigurationService,
                                                   $scope, $http, $injector, $q) {
    /* -- Section: Variables. -- */
    var registeredServices = { };           // Provides an array of all the registered services (OfficeUI controls).
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
     *
     * @remarks
     * This method is called as soon as the controller is initialized.
     * This method performs all the required initialization logic which can be quite a lot when you're dealing with a
     * rather complex OfficeUI application which holds a lot of controls.
     * Therefore, some properties are being set which are rendering a loading screen on the front-end as long as this
     * method is running. As soon as this method has done it's execution logic, the control is transferred to the
     * application and the user does have control right now.
     * In the loading screen, there isn't any interactive suite for the end user.
     *
     * Please note that on very slow connections the loading screen might not appear directly, because there are various
     * loading screens that can be showed. Which loading screen that should be loaded is defined in a configuration file,
     * so the application does need to read this file first and based on the settings found in there, built up the
     * loading screen.
     */
    function Initialize() {
        $scope.LoadingMessage = 'Loading the application';
        OfficeUIConfigurationService.getOfficeUIConfiguration().then(function(data) {
            // Retrieve the styles and themes as defined in the Json file.
            var foundStyles = JSPath.apply('.{.name == "' + data.DefaultStyle + '"}', data.Styles);
            var foundThemes = JSPath.apply('.{.name == "' + data.DefaultTheme + '"}', data.Themes);

            // Preload the css files.
            // This is placed as one of the first call, because as soon as the files have been preloaded, the
            // loading screen will be showed to the user, which means that the application has all the time it needs
            // to do additional loading.
            PreloadCssFiles([foundStyles[0].stylesheet, foundThemes[0].stylesheet]).then(
                function() { $scope.loadingScreenLoaded = true; }
            );

            // Loads the entire application.
            LoadApplication(data.Configuration, JSPath.apply('.', data.Controls));
        });
    }

    /**
     * @type                Function
     * @name                PreloadCssFiles
     *
     * @description
     * Preloads an inject the css files which are requested.
     *
     * @param               stylesheetsCollection:      The collection of stylesheets that should be loaded.
     */
    function PreloadCssFiles(stylesheetsCollection) {
        var cssLoaderPromises = [];

        $(stylesheetsCollection).each(function(index, stylesheet) {
            cssLoaderPromises.push(CssInjectorService.Inject('OfficeUIStyle' + index, stylesheet));
        });

        return $q.all(cssLoaderPromises);
    }

    /**
     * @type                Function
     * @name                LoadApplication
     *
     * @description
     * Loads all the application data which is required for the application to function.
     *
     * @param               configurationFile:      The configuration file of the application itself.
     * @param               services:               A collection of services that should be registered.
     */
    function LoadApplication(configurationFile, services) {
        // Inject all the required services into the AngularJS application.
        $(services).each(function(index, service) {
            registeredServices[service.Name] = [ $injector.get(service.Service), service.ConfigurationFile ];
        });

        // Load the configuration file of the application.
        $http.get(configurationFile)
            .then(function (response) {
                $scope.Title = response.data.Title;
                $scope.Icons = response.data.Icons;

                PreloadImageFiles(JSPath.apply('.Icon', $scope.Icons)).then(function() {
                    LoadApplicationServices(services);
                });


            }, function(error) { OfficeUICore.Exceptions.officeUILoadingException('The OfficeUI application definition file: \'' + data.Configuration + '\' could not be loaded.'); }
        );
    }

    /**
     * @type                Function
     * @name                PreloadImageFiles
     *
     * @description
     * Loads a collection of image files and return the promise.
     *
     * @param               imageFilesCollection:       A collection of images that should be loaded.
     */
    function PreloadImageFiles(imageFilesCollection) {
        var iconReferencesPromises = [];

        $(imageFilesCollection).each(function(index, item) {
            iconReferencesPromises.push(PreloaderService.Load(item));
        });

        return $q.all(iconReferencesPromises);
    }

    /**
     * @type                Function
     * @name                LoadApplicationServices
     *
     * @description
     * Loads the various services which should be registered.
     *
     * @param               servicesCollection:     The collection of services that should be registered.
     */
    function LoadApplicationServices(servicesCollection) {
        PreloadServices(servicesCollection).then(function() {
            $scope.isInitialized = true;
        })
    }

    /**
     * @type                Function
     * @name                PreloadServices
     *
     * @description
     * Preloads the services which should be registered in the application.
     *
     * @param               servicesCollection:     The collection of services that should be preloaded.
     */

    function PreloadServices(servicesCollection) {
        var serviceLoaderPromises = [];

        $(servicesCollection).each(function(index, service) {
            serviceLoaderPromises.push(InitializeService(registeredServices[service.Name][0], service.ConfigurationFile));
        });

        return $q.all(serviceLoaderPromises);
    }

    /**
     * @type                Function
     * @name                InitializeService
     *
     * @description
     * Executes the initialization logic of the service.
     *
     * @param               serviceInstance:        The instance of the service for which to execute the logic.
     * @param               configurationFile:      The file that defines the configuration of the service.
     */
    function InitializeService(serviceInstance, configurationFile) {
        // Change the loading message so the view can be updated.
        serviceInstance.SetLoadingMessage($scope);

        var deferred = $q.defer();

        // Executes the initialization logic of the service itself.
        serviceInstance.Initialize(configurationFile).then(function() {
            deferred.resolve();
        });

        return deferred.promise;
    }

    /**
     * @type                Function
     * @name                InitializeServiceCall
     *
     * @description
     * This controller could have registered multiple services. This method is used to execute a method on one of those
     * services.
     *
     * @param               service:        The name of the service for which to execute a function.
     * @param               method:         The method on the service to call.
     * @param               parameters:     The parameters to pass to the method call.
     */
    $scope.InitializeServiceCall = function(service, method, parameters) {
        var serviceInstance = registeredServices[service][0];
        return serviceInstance[method](parameters);
    }
});

/* ---- End: AngularJS Controllers. ---- */

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