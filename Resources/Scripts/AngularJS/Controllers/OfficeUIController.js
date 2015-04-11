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