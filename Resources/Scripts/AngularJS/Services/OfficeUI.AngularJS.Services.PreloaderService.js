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