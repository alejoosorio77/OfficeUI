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