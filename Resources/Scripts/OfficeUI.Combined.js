/**
 * @filename       OfficeUI.js
 * @Author         Kevin De Coninck
 * @version        1.0.0
 * @date           30/03/2015
 *
 * @depends             AngularJS/Services/CssInjectorService.js
 * @depends             AngularJS/Services/ImagePreloaderService.js
 * @depends             AngularJS/Services/OfficeUIConfigurationService.js
 *
 * @depends             AngularJS/Controllers/OfficeUIController.js
 *
 * @depends             AngularJS/Directives/RibbonScroll.js
 * @depends             AngularJS/Directives/ToggleClassOnClick.js
 * @depends             AngularJS/Directives/ToggleStyleOnHover.js
 * @depends             AngularJS/Directives/StopPropagation.js
 * @depends             AngularJS/Directives/RibbonActionTooltip.js
 *
 * @depends             AngularJS/Filters/ActionLegend.js
 *
 * @depends             AngularJS/Services/Controls/Ribbon.js
 *
 * @notes
 * Defines the main starting point for the 'OfficeUIApplication' module.
 *
 * @remarks
 * In the comments above, you do some entries with the name 'depends'. Those entries should not be removed, nor
 * adjusted. There's a tool included which is stored in 'Tools/Build/JavaScriptCombiner/JavaScriptCombiner.exe'.
 * This tool will read this particular file, and search for all the 'depends' in the comments. The contents of this file
 * and all it's dependencies is outputted in a single file, which makes sure that there's only 1 request to the server
 * to request all those files, while keeping a high readability by using different files for development.
 * When you do change any of the dependent files, you should also touch this file to make sure that the combined version
 * is the latest version.
 */

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
/**
 * @filename       CssInjectorService.js
 * @Author         Kevin De Coninck
 * @version        1.0.0
 * @date           30/03/2015
 *
 * @notes
 * Defines the service 'CssInjectorService'.
 * This service allows us to load stylesheets asynchronously.
 */

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
        } else { OfficeUICore.Exceptions.OfficeUICssInjectorServiceException('[CssInjectorService.Inject]: There is already a link with id \'' + id + '\'. A new element could not be created.'); }

    };

    // return the service object itself.
    return cssInjectorServiceObject;
}]);
/**
 * @filename       ImagePreloaderService.js
 * @Author         Kevin De Coninck
 * @version        1.0.0
 * @date           30/03/2015
 *
 * @notes
 * Defines the service 'ImagePreloaderService'.
 * This service allows us to load data asynchronously.
 */

/**
 * @type                Service
 * @name                ImagePreloaderService
 *
 * @description
 * The 'PreloaderService' enables you to load data in the back-end. By doing this, we can make sure to change a scope
 * value only, and only when the data has been loaded.
 */
OfficeUI.factory('ImagePreloaderService', ['$q', function($q) {
    var imagePreloaderServiceObject = { }; // Defines the object that needs to be returned by the service.

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
    imagePreloaderServiceObject.Load = function(referencePath){
        var deferred = $q.defer();

        var preloadedElement = document.createElement('img');
        {
            preloadedElement.onload = deferred.resolve;
            preloadedElement.src = referencePath;
        }

        return deferred.promise;
    }

    // Return the service object itself.
    return imagePreloaderServiceObject;
}]);
/**
 * @filename       OfficeUIConfigurationService.js
 * @Author         Kevin De Coninck
 * @version        1.0.0
 * @date           30/03/2015
 *
 * @notes
 * Defines the controller 'OfficeUIConfigurationService'. This service is required for loading the initial configuration
 * of an OfficeUI application.
 */

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
         * @name            GetOfficeUIConfiguration
         *
         * @returns         {HttpPromise}:      A promise which is loading the OfficeUI configuration file.
         */
        GetOfficeUIConfiguration: function() {
            // Check if the location of the file can be found somewhere. If it cannot be found, throw an error.
            if (typeof $.fn.OfficeUI.Settings.OfficeUIConfigurationFileLocation === 'undefined' || $.fn.OfficeUI.Settings.OfficeUIConfigurationFileLocation == '') {
                OfficeUICore.Exceptions.OfficeUIConfigurationException('[OfficeUIConfigurationService.GetOfficeUIConfiguration] - The OfficeUI Configuration file is not defined.');
            }

            // Returns the 'httpPromise' which is required for further processing.
            return $http.get($.fn.OfficeUI.Settings.OfficeUIConfigurationFileLocation)
                .then(function (response) {
                    // Perform some checks to see if all the required data is stored in the Json file.
                    if (typeof response.data.Styles === 'undefined' || response.data.Styles == '') { OfficeUICore.Exceptions.OfficeUIInvalidConfigurationException('[OfficeUIConfigurationService.GetOfficeUIConfiguration] - The configuration element [Styles] is missing or could not be found in the file \'' + $.fn.OfficeUI.Settings.OfficeUIConfigurationFileLocation + '\''); }
                    if (typeof response.data.DefaultStyle === 'undefined' || response.data.Styles == '') { OfficeUICore.Exceptions.OfficeUIInvalidConfigurationException('[OfficeUIConfigurationService.GetOfficeUIConfiguration] - The configuration element [DefaultStyle] is missing or could not be found in the file \'' + $.fn.OfficeUI.Settings.OfficeUIConfigurationFileLocation + '\''); }
                    if (typeof response.data.Themes === 'undefined' || response.data.Styles == '') { OfficeUICore.Exceptions.OfficeUIInvalidConfigurationException('[OfficeUIConfigurationService.GetOfficeUIConfiguration] - The configuration element [Themes] is missing or could not be found in the file \'' + $.fn.OfficeUI.Settings.OfficeUIConfigurationFileLocation + '\''); }
                    if (typeof response.data.DefaultTheme === 'undefined' || response.data.Styles == '') { OfficeUICore.Exceptions.OfficeUIInvalidConfigurationException('[OfficeUIConfigurationService.GetOfficeUIConfiguration] - The configuration element [DefaultTheme] is missing or could not be found in the file \'' + $.fn.OfficeUI.Settings.OfficeUIConfigurationFileLocation + '\''); }
                    if (typeof response.data.Configuration === 'undefined' || response.data.Styles == '') { OfficeUICore.Exceptions.OfficeUIInvalidConfigurationException('[OfficeUIConfigurationService.GetOfficeUIConfiguration] - The configuration element [Configuration] is missing or could not be found in the file \'' + $.fn.OfficeUI.Settings.OfficeUIConfigurationFileLocation + '\''); }
                    if (typeof response.data.Controls === 'undefined' || response.data.Styles == '') { OfficeUICore.Exceptions.OfficeUIInvalidConfigurationException('[OfficeUIConfigurationService.GetOfficeUIConfiguration] - The configuration element [Controls] is missing or could not be found in the file \'' + $.fn.OfficeUI.Settings.OfficeUIConfigurationFileLocation + '\''); }
                    if (typeof response.data.LoadingMessage === 'undefined' || response.data.Styles == '') { OfficeUICore.Exceptions.OfficeUIInvalidConfigurationException('[OfficeUIConfigurationService.GetOfficeUIConfiguration] - The configuration element [LoadingMessage] is missing or could not be found in the file \'' + $.fn.OfficeUI.Settings.OfficeUIConfigurationFileLocation + '\''); }

                    // Retrieve the styles and themes as defined in the Json file.
                    var foundStyles = JSPath.apply('.{.name == "' + response.data.DefaultStyle + '"}', response.data.Styles);
                    var foundThemes = JSPath.apply('.{.name == "' + response.data.DefaultTheme + '"}', response.data.Themes);

                    // Check if the data is valid, if not, throw an error.
                    if (foundStyles.length == 0) { OfficeUICore.Exceptions.OfficeUIConfigurationException('[OfficeUIController.Initialize] - The requested default style: \'' + response.data.DefaultStyle + '\' which is referenced from \'' + $.fn.OfficeUI.Settings.OfficeUIConfigurationFileLocation + '\' cannot be found.'); }
                    if (foundThemes.length == 0) { OfficeUICore.Exceptions.OfficeUIConfigurationException('[OfficeUIController.Initialize] - The requested default theme: \'' + response.data.DefaultTheme + '\' which is referenced from \'' + $.fn.OfficeUI.Settings.OfficeUIConfigurationFileLocation + '\' cannot be found.'); }
                    if (foundStyles.length > 1) { OfficeUICore.Exceptions.OfficeUIConfigurationException('[OfficeUIController.Initialize] - The requested default style: \'' + response.data.DefaultStyle + '\' which is referenced from \'' + $.fn.OfficeUI.Settings.OfficeUIConfigurationFileLocation + '\' matches multiple defined styles.'); }
                    if (foundThemes.length > 1) { OfficeUICore.Exceptions.OfficeUIConfigurationException('[OfficeUIController.Initialize] - The requested default theme: \'' + response.data.DefaultTheme + '\' which is referenced from \'' + $.fn.OfficeUI.Settings.OfficeUIConfigurationFileLocation + '\' matches multiple defined themes.'); }

                    return {
                        Styles: response.data.Styles,
                        Themes: response.data.Themes,
                        Configuration: response.data.Configuration,
                        Controls: response.data.Controls,
                        LoadingMessage: response.data.LoadingMessage,
                        DefaultStyle: foundStyles[0].stylesheet,
                        DefaultTheme: foundThemes[0].stylesheet
                    };
                }, function(error) { OfficeUICore.Exceptions.OfficeUILoadingException('[OfficeUIConfigurationService.GetOfficeUIConfiguration] - The OfficeUI Configuration file: \'' + $.fn.OfficeUI.Settings.OfficeUIConfigurationFileLocation + '\' could not be loaded.'); }
            );
        }
    }
});
/**
 * @filename       OfficeUIController.js
 * @Author         Kevin De Coninck
 * @version        1.0.0
 * @date           30/03/2015
 *
 * @notes
 * Defines the controller 'OfficeUIController'.
 */

/**
 * @type                Controller
 * @name                OfficeUIController
 *
 * @description
 * Defines the 'OfficeUIController' controller. By this controller, everything for an OfficeUI application is
 * controlled.
 *
 * @remarks
 * There's a mechanism behind the loading of an OfficeUI application which is explained below.
 * As soon as this controller is placed on a website, the method 'Initialize' is called. This method does load the
 * configuration file in which the configuration for the application is stored.
 * With this minimal configuration, the stylesheets are loaded, and once the requested stylesheets are loaded a loading
 * screen is showed to the user. The screen will stay blank until all the data for the loading screen is loaded.
 * While the loading screen is loaded, the application does load all the other necessary files (Json, Images,
 * Stylesheets, Templates, ...). As soon as all those files are loaded the main application screen is showed.
 * This mechanism is implemented to make sure that there's no flickering while the application is being loaded.
 *
 * @dependencies        CssInjectorService:                     Provides a way to load stylesheets dynamically and
 *                                                              wait for them to be retrieved.
 *                      ImagePreloaderService:                  The service which is required for preloading images.
 *                      OfficeUIConfigurationService:           Provides the configuration for an OfficeUI application.
 */
OfficeUI.controller('OfficeUIController', function(CssInjectorService, ImagePreloaderService, OfficeUIConfigurationService,
                                                   $scope, $http, $injector, $q) {
    /* -- Section: Variables. -- */
    var registeredServices = { };           // Provides an array of all the registered services (OfficeUI controls).
                                            // A service is a control in an OfficeUI application and we can have a
                                            // variaty of controls such as (Ribbon, Menu, Buttons, Modals, ...)
    $scope.isInitialized = false;           // Provides a boolean that indicates that the application is fully
                                            // initialized.
    $scope.loadingScreenLoaded = false;     // Provides a boolean that indicates that the loading screen is fully
                                            // Initialized.

    // Initialize all the required components for the website.
    // This method will, like mentioned before always load the loading screen and the application, and then, based on
    // data stored in the configuration file, load other required data.
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
        OfficeUIConfigurationService.GetOfficeUIConfiguration().then(function(data) {
            // Defines the message of the loading message.
            $scope.LoadingMessage = data.LoadingMessage;

            // Preload the css files.
            // This is placed as one of the first call, because as soon as the files have been preloaded, the
            // loading screen will be showed to the user, which means that the application has all the time it needs
            // to do additional loading.
            PreloadCssFiles([data.DefaultStyle, data.DefaultTheme]).then(
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
        var cssLoaderPromises = []; // Defines the object which will hold all the promises.

        // Load each file which is in the 'stylesheetsCollection' and append it to the head.
        $(stylesheetsCollection).each(function(index, stylesheet) {
            cssLoaderPromises.push(CssInjectorService.Inject('OfficeUIStyle' + index, stylesheet));
        });

        // Return all the promises, so this call can be awaited.
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
     *                                              In an OfficeUI application, a service is nothing more than an
     *                                              OfficeUI control such as 'Ribbon', 'Button', 'Modal', ...
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

                // Preload the image files which are required for the application.
                PreloadImageFiles(JSPath.apply('.Icon', $scope.Icons)).then(function() {
                    LoadApplicationServices(services);
                });

            }, function(error) { OfficeUICore.Exceptions.OfficeUILoadingException('[OfficeUIController.LoadApplication] - The OfficeUI Application Definition file: \'' + configurationFile + '\' which is referenced from \'' + $.fn.OfficeUI.Settings.OfficeUIConfigurationFileLocation + '\' could not be loaded.'); }
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
        var iconReferencesPromises = []; // Defines the object which will hold all the promises.

        // Load each file which is in the 'imageFilesCollection'.
        $(imageFilesCollection).each(function(index, item) {
            iconReferencesPromises.push(ImagePreloaderService.Load(item));
        });

        // Return all the promises, so this call can be awaited.
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
     * @name                DisableApplicationIcon
     *
     * @description
     * Disables a given application icon based on it's id.
     *
     * @param               iconId          The id of the icon to disable.
     */
    $scope.DisableApplicationIcon = function(iconId) {
        var foundElement = JSPath.apply('.{.Id == "' + iconId + '"}', $scope.Icons);

        // If the element cannot be found, throw an exception.
        if (foundElement.length == 0) { OfficeUICore.Exceptions.OfficeUIElementNotFoundException('[OfficeUIController.DisableApplicationIcon] - An application icon with id \'' + iconId + '\' cannot be found.'); }

        // Disable the provided element.
        foundElement[0].Disabled = "True";
    }

    /**
     * @type                Function
     * @name                EnableApplicationIcon
     *
     * @description
     * Enables a given application icon based on it's id.
     *
     * @param               iconId          The id of the icon to enable.
     */
    $scope.EnableApplicationIcon = function(iconId) {
        var foundElement = JSPath.apply('.{.Id == "' + iconId + '"}', $scope.Icons);

        // If the element cannot be found, throw an exception.
        if (foundElement.length == 0) { OfficeUICore.Exceptions.OfficeUIElementNotFoundException('[OfficeUIController.EnableApplicationIcon] - An application icon with id \'' + iconId + '\' cannot be found.'); }

        // Disable the provided element.
        foundElement[0].Disabled = "False";
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
        var serviceLoaderPromises = []; // Defines the object which will hold all the promises.
        var serviceNames = []; // Defines an array that contains all the names of the services.

        // Load each srevice which is in the 'servicesCollection'.
        $(servicesCollection).each(function(index, service) {
            // Checks if another service with the same does already exists.
            var foundServices = $.grep(serviceNames, function(element) {
               return element.Name == service.Name;
            });

            serviceNames.push(service);

            // Throw an exception if another service with the same name is already registered.
            if (foundServices.length > 0) { OfficeUICore.Exceptions.OfficeUIServiceException('[OfficeUIController.PreloadServices] - A service with name \'' + service.Name + '\' is already registered.'); }

            serviceLoaderPromises.push(InitializeService(service.Name, registeredServices[service.Name][0], service.ConfigurationFile));
        });

        // Return all the promises, so this call can be awaited.
        return $q.all(serviceLoaderPromises);
    }

    /**
     * @type                Function
     * @name                InitializeService
     *
     * @description
     * Executes the initialization logic of the service.
     *
     * @param               serviceName:            The name of the service for which to execute the logic.
     * @param               serviceInstance:        The instance of the service for which to execute the logic.
     * @param               configurationFile:      The file that defines the configuration of the service.
     */
    function InitializeService(serviceName, serviceInstance, configurationFile) {
        var deferred = $q.defer();

        // Check if the service is valid. If it isn't, throw an error message.
        if (!$.isFunction(serviceInstance.SetLoadingMessage)) { OfficeUICore.Exceptions.OfficeUIServiceException('[OfficeUIController.InitializeService] - The service \'' + serviceName + '\' does not implement the \'SetLoadingMessage(scope) { }\' function.'); }
        if (!$.isFunction(serviceInstance.Initialize)) { OfficeUICore.Exceptions.OfficeUIServiceException('[OfficeUIController.InitializeService] - The service \'' + serviceName + '\' does not implement the \'Initialize(configurationFile) { }\' function.'); }

        // Change the loading message so the view can be updated.
        serviceInstance.SetLoadingMessage($scope);

        // Executes the initialization logic of the service itself.
        serviceInstance.Initialize(configurationFile).then(function() {
            deferred.resolve();
        });

        // Return the initialized service.
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
        // Check if the call is valid. If not, throw an error.
        if (typeof registeredServices[service] === 'undefined' || registeredServices[service] == '') { OfficeUICore.Exceptions.OfficeUIServiceException('[OfficeUIController.InitializeServiceCall] - The service \'' + service + '\' could not be found.'); }

        var serviceInstance = registeredServices[service][0];
        return serviceInstance[method](parameters, parameters);
    }
});
/**
 * @type            Directive
 * @usage           Attribute
 * @name            ribbonScroll
 *
 * @description
 * Defines the 'officeuiRibbonScroll' directive. This directive allows us to execute an AngularJS function when we're
 * scrolling on the element.
 *
 * @remarks
 * This directive is implementing 'e.preventDefault()'. This does mean that default events are not executed anymore.
 * In this particular case, it's used to make sure that the page does not scroll when we scroll on the element which
 * has implemented this directive.
 */
OfficeUI.directive('ribbonScroll', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attributes){
            var scrollAttribute = attributes['ribbonScroll'];

            // Bind the mousewheel event handler.
            element.on('DOMMouseScroll mousewheel', function (e) {
                scope.$apply(function(self) {
                    scope.InitializeServiceCall('Ribbon', 'ribbonScroll', e.originalEvent);
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
 * @name            toggleClassOnClick
 *
 * @description
 * Defines the 'toggleClassOnClick' directive. This directive allows us to toggle a specific class when you click
 * on a certain element.
 * Whenever you click on the element, the class provided as an attribute will be added to the element.
 *
 * @remarks
 * We're also binding the event handler 'mouseout' on the element. This is, because when you click on the element
 * and then you move away your mouse, the class 'active-ie-fix' doesn't get removed. It's only get removed if you
 * click on the element again. Now the class is also removed when your mouse leave the element.
 */
OfficeUI.directive('toggleClassOnClick', function() {
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
 * @name            toggleStyleOnHover
 *
 * @description
 * Defines the 'toggleStyleOnHover' directive. This directive allows us to add or remove a specific
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
 * <li class="tab contextual-tab label" data-cu-toggle-style-attribute-on-hover='{"background-color": "red"}'>
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
OfficeUI.directive('toggleStyleOnHover', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attributes){
            var toggleStyleAttribute = attributes['toggleStyleOnHover'];
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
 * @name            officeuiStopPropagation
 *
 * @description
 * Defines the 'officeuiStopPropagation' directive. This directive allows us to stop propagating an event.
 */
OfficeUI.directive('officeuiStopPropagation', function () {
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
 * @name            ribbonActionTooltip
 *
 * @description
 * Defines the 'officeuiTooltip' directive. This directive allows us to show a tooltip for a specific element.
 */
OfficeUI.directive('ribbonActionTooltip', function () {
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
 * @type            Filter
 * @name            actionLegend
 *
 * @description
 * Provides the 'actionLegend' filter. This filter will append some text to another element is a condition is matched.
 */
OfficeUI.filter('actionLegend', function() {
    return function(action) {
        if (action.MenuItems) { return action.Legend + ' <i class="fa fa-caret-down"></i>'; }
        return action.Legend;
    }
});
/**
 * @type                Service
 * @name                OfficeUIRibbonControlService
 *
 * @description
 * Provides the service which is needed to manage the OfficeUI ribbon control.
 *
 * @dependencies        rootScope:              Used to inject properties into the root scope.
 *                      http:                   Used to execute request to external providers.
 *                      q:                      Used to work with promises.
 *                      ImagePreloaderService:  Used to preload images.
 */
OfficeUI.factory('OfficeUIRibbonControlService', ['$rootScope', '$http', '$q', 'ImagePreloaderService', function($rootScope, $http, $q, ImagePreloaderService) {
    var OfficeUIRibbonControlServiceObject = { }; // Defines the object that needs to be returned by the service.

    // Defines the constants which are needed for this controller.
    const COOKIE_NAME_LATEST_SELECTED_TAB = 'OfficeUIRibbon_SelectedTab';

    // Defines the various states that a ribbon can have.
    var ribbonStates = { Hidden: 1, Visible: 2, Showed: 3, Showed_Initialized: 99 }

    // Defines all the variables which are needed for this control.
    var preserveSelectedRibbonTab;
    var activeTab;
    var activeContextualGroups = [];
    var ribbonState = ribbonStates.Showed_Initialized;

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
        scope.LoadingMessage = 'Office Web Controls Ribbon Control Initialization';
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
                // Validate the ribbon configuration file.
                if (typeof response.data.Configuration === 'undefined' || response.data.Configuration == '') { OfficeUICore.Exceptions.ThrowException('OfficeUIRibbonControlServiceException', '[OfficeUIRibbonControlService.Initialize] - The file defining the ribbon \'' + configurationFile + '\' does not contain a \'Configuration\' property.'); }
                if (typeof response.data.Tabs === 'undefined' || response.data.Tabs == '') { OfficeUICore.Exceptions.ThrowException('OfficeUIRibbonControlServiceException', '[OfficeUIRibbonControlService.Initialize] - The file defining the ribbon \'' + configurationFile + '\' does not contain a \'Tabs\' property.'); }
                if (typeof response.data.ContextualGroups === 'undefined' || response.data.ContextualGroups == '') { OfficeUICore.Exceptions.ThrowException('OfficeUIRibbonControlServiceException', '[OfficeUIRibbonControlService.Initialize] - The file defining the ribbon \'' + configurationFile + '\' does not contain a \'ContextualGroups\' property.'); }
                if (response.data.Tabs.length < 2) { OfficeUICore.Exceptions.ThrowException('OfficeUIRibbonControlServiceException', '[OfficeUIRibbonControlService.Initialize] - The file defining the ribbon \'' + configurationFile + '\' must contain at least 2 tabs.'); }

                // Sets a boolean that indicates wether or not the latest selected tab should be preserved.
                preserveSelectedRibbonTab = response.data.Configuration[0].PreserveSelectedRibbonTab == 'True';

                // Sets the correct properties to the scope.
                $rootScope.Tabs = response.data.Tabs;
                $rootScope.ContextualGroups = response.data.ContextualGroups;

                // Sets the currently active tab.
                // If the latest active tab should be remembered, then set the latest known tab as the active tab, otherwise, set the first non-application tab as the application tab.
                if (preserveSelectedRibbonTab) {
                    var latestKnownTab = OfficeUICore.StateManagement.GetCookie(COOKIE_NAME_LATEST_SELECTED_TAB);

                    // When the latest known tab is an empty string, meaning that the cookie didn't exist, then select
                    // the first non-application tab.
                    if (latestKnownTab == '') {OfficeUIRibbonControlServiceObject.setActiveTab($rootScope.Tabs[1].Id); }
                    else { OfficeUIRibbonControlServiceObject.setActiveTab(latestKnownTab); }
                }
                else { OfficeUIRibbonControlServiceObject.setActiveTab($rootScope.Tabs[1].Id); }

                // Gets all the images which are defined in the ribbon.
                // Images can be stored in either a 'Tab' element of in a 'ContextualGroup' element.
                var images = JSPath.apply('.Groups.Areas.Actions.Resource', $rootScope.Tabs);
                images.concat(JSPath.apply('.Tabs.Groups.Areas.Actions.Resource', $rootScope.ContextualGroups));

                // Defines all the promises that should be loaded.
                var imagesPromise = [];

                // Load every image that the ribbon will use.
                $(images).each(function(index, item) {
                    imagesPromise.push(ImagePreloaderService.Load(item));
                });

                // Resolve all the images.
                $q.all(imagesPromise).then(function() {
                    deferred.resolve();
                });
            });

        // Return the promise, which we could await. When this promise is ready, then the ribbon is initialized.
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

    /**
     * @type                Function
     * @name                setActiveTab
     *
     * @description         Set a tab as the active tab.
     *
     * @param               tabId:      The id of the tab to set as active.
     */
    OfficeUIRibbonControlServiceObject.setActiveTab = function(tabId) {
        // Set the ribbon state as being showed when it was hidden.
        if (ribbonState == ribbonStates.Hidden) { ribbonState = ribbonStates.Visible; }

        // Get all the tabs, except the first one.
        // We use the JSON.parse method here to create a new deep-copy of the array, not related to the first one.
        var tabs = JSON.parse(JSON.stringify($rootScope.Tabs)).splice(1, $rootScope.Tabs.length - 1);
        var isNormalTab = false;

        // Check if the requested tab is a valid tab or contextual tab element.
        var tabMatches = $.grep(tabs, function(tab) { return tab.Id == tabId; });

        // Sets a boolean that indicates that the tab to activate is a normal tab.
        // This is needed because only a normal tab will be saved in a cookie, this is because by default, contextual
        // groups and tabs are hidden on launch.
        if (tabMatches.length > 0) { isNormalTab = true; }

        // Get all the tabs in which we can search for the tab to activate.
        // The following tabs can be activated.
        // - All the normal tabs (except the first one).
        // - All the contextual tabs, but only if the contextual group is active.
        $.each($rootScope.ContextualGroups, function(index, contextualGroup) {
            if (OfficeUIRibbonControlServiceObject.isContextualGroupActive(contextualGroup.Id)) {
                $.each(contextualGroup.Tabs, function(contextualTabIndex, contextualTab) { tabs.push(contextualTab); });
            }
        });

        // Check if the requested tab is a valid tab or contextual tab element.
        tabMatches = $.grep(tabs, function(tab) { return tab.Id == tabId; });

        // If the tab cannot be actived for any reason, throw an error message.
        if (tabMatches.length == 0) { OfficeUICore.Exceptions.ThrowException('OfficeUIRibbonControlServiceException', '[OfficeUIRibbonControlService.setActiveTab] - The tab \'' + tabId + '\' cannot be activated. Either the tab does not exists, is an application tab, or the tab belongs to a contextual group which isn\'t active.'); }
        else
        {
            // If the latest selected tab of the ribbon should be preserved, store the value in a cookie.
            if (preserveSelectedRibbonTab && isNormalTab) { OfficeUICore.StateManagement.SetCookie(COOKIE_NAME_LATEST_SELECTED_TAB, tabId, 365); }

            // Change the active tab.
            activeTab = tabId;
        }
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
    OfficeUIRibbonControlServiceObject.setActiveTabColor = function(tabSettings) {
        var tabId = tabSettings[0];
        var tabColor = tabSettings[1];

        if (activeTab == tabId) { return tabColor; }
    }

    /**
     * @type                Function
     * @name                isContextualGroupActive
     *
     * @description         Checks if a given contextual group is active.
     *
     * @param               contextualGroupId       The id of the contextual group to check.
     *
     * @returns {boolean}               True if the contextual group is active, false otherwise.
     */
    OfficeUIRibbonControlServiceObject.isContextualGroupActive = function(contextualGroupId) {
        var matches = $.grep(activeContextualGroups, function(contextualGroup) {
            return contextualGroup == contextualGroupId
        });

        return matches.length == 1;
    }

    /**
     * @type                Function
     * @name                activateContextualGroup
     *
     * @description         Activate a contextual group based on it's id.
     *
     * @param               contextualGroupId       The id of the contextual group to activate.
     */
    OfficeUIRibbonControlServiceObject.activateContextualGroup = function(contextualGroupId) {
        // Only activate the contextual group if it isn't activated yet.
        if (!OfficeUIRibbonControlServiceObject.isContextualGroupActive(contextualGroupId)) { activeContextualGroups.push(contextualGroupId); }
    }

    /**
     * @type                Function
     * @name                deactivateContextualGroup
     *
     * @description         Deactivate a contextual group based on it's id.
     *
     * @param               contextualGroupId       The id of the contextual group to deactivate.
     */
    OfficeUIRibbonControlServiceObject.deactivateContextualGroup = function(contextualGroupId) {
        // Only deactivate the contextual group if it isn't activated yet.
        if (OfficeUIRibbonControlServiceObject.isContextualGroupActive(contextualGroupId)) {
            // Get the found contextual group.
            var foundContextualGroup = $.grep($rootScope.ContextualGroups, function(contextualGroup) {
                return contextualGroup.Id == contextualGroupId;
            });

            // See if the currently activated tab is a tab that's defined in the contextual group.
            var foundActiveTab = $.grep(foundContextualGroup[0].Tabs, function(contextualTab) {
                return contextualTab.Id == activeTab;
            });

            // If the contextual group which is being deactivated holds an active group, then set the currently active
            // tab to the first non-application tab.
            if (foundActiveTab.length > 0) { OfficeUIRibbonControlServiceObject.setActiveTab($rootScope.Tabs[1].Id); }

            // Deactivate the contextual group.
            activeContextualGroups = $.grep(activeContextualGroups, function(contextualGroup) {
                return contextualGroup != contextualGroupId;
            });
        }
    }

    /**
     * @type                Function
     * @name                areContextualGroupsActive
     *
     * @description         Checks if a given contextual group is active.
     *
     * @returns             {boolean}   True if there are active contextual groups, false otherwise.
     */
    OfficeUIRibbonControlServiceObject.areContextualGroupsActive = function() { return activeContextualGroups.length > 0; }

    /**
     * @type                Function
     * @name                DisableIcon
     *
     * @description
     * Disables a given application icon based on it's id.
     *
     * @param               iconId          The id of the icon to disable.
     */
    OfficeUIRibbonControlServiceObject.DisableIcon = function(iconId) {
        var foundElement = JSPath.apply('.Groups.Areas.Actions{.Id == "' + iconId + '"}', $rootScope.Tabs);

        // If the element cannot be found, throw an exception.
        if (foundElement.length == 0) { OfficeUICore.Exceptions.OfficeUIElementNotFoundException('[OfficeUIRibbonControlService.DisableIcon] - An icon with id \'' + iconId + '\' cannot be found.'); }

        // Disable the provided element.
        foundElement[0].Disabled = "True";
    }

    /**
     * @type                EnableIcon
     * @name                EnableApplicationIcon
     *
     * @description
     * Enables a given application icon based on it's id.
     *
     * @param               iconId          The id of the icon to enable.
     */
    OfficeUIRibbonControlServiceObject.EnableIcon = function(iconId) {
        var foundElement = JSPath.apply('.Groups.Areas.Actions{.Id == "' + iconId + '"}', $rootScope.Tabs);

        // If the element cannot be found, throw an exception.
        if (foundElement.length == 0) { OfficeUICore.Exceptions.OfficeUIElementNotFoundException('[OfficeUIRibbonControlService.EnableIcon] - An icon with id \'' + iconId + '\' cannot be found.'); }

        // Disable the provided element.
        foundElement[0].Disabled = "False";
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
    OfficeUIRibbonControlServiceObject.ribbonScroll = function(scrollEvent) {
        var availableTabs = [];
        var currentActiveTabIndex;

        // Push all the id's of the available tabs into an array, based on that array, the next tab element can be selected.
        $.each($rootScope.Tabs, function(index, tabElement) { availableTabs.push(tabElement.Id); });

        $.each($rootScope.ContextualGroups, function (contextualGroupIndex, contextualGroup) {
            if (OfficeUIRibbonControlServiceObject.isContextualGroupActive(contextualGroup.Id)) {
                $.each(contextualGroup.Tabs, function (contextualTabIndex, contextualTab) { availableTabs.push(contextualTab.Id); });
            }
        });

        $.each(availableTabs, function(index, tab) {
            if (tab == activeTab) { currentActiveTabIndex = index; }
        });

        if (scrollEvent.detail > 0 || scrollEvent.wheelDelta < 0) {
            if (currentActiveTabIndex < availableTabs.length - 1) { OfficeUIRibbonControlServiceObject.setActiveTab(availableTabs[currentActiveTabIndex + 1]); }
        } else {
            if (currentActiveTabIndex > 1) { OfficeUIRibbonControlServiceObject.setActiveTab(availableTabs[currentActiveTabIndex - 1]); }
        }
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
    OfficeUIRibbonControlServiceObject.isRibbonShowed = function() {
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
    OfficeUIRibbonControlServiceObject.isRibbonInitialized = function() {
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
    OfficeUIRibbonControlServiceObject.isRibbonVisible = function() {
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
    OfficeUIRibbonControlServiceObject.isRibbonHidden = function() {
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
    OfficeUIRibbonControlServiceObject.toggleRibbonState = function() {
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
        if (OfficeUIRibbonControlServiceObject.isRibbonVisible()) { ribbonState = ribbonStates.Hidden; }

        $rootScope.$apply();
    });

    // Return the service object itself.
    return OfficeUIRibbonControlServiceObject;
}]);
