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
        return serviceInstance[method](parameters, parameters);
    }
});