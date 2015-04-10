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