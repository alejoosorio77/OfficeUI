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

    /**
     * @type                Function
     * @name                setActiveTab
     *
     * @description         Set a tab as the active tab.
     *
     * @param               tabId:      The id of the tab to set as active.
     */
    OfficeUIRibbonControlServiceObject.setActiveTab = function(tabId) {
        activeTab = tabId;
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

    // Return the service object itself.
    return OfficeUIRibbonControlServiceObject;
}]);