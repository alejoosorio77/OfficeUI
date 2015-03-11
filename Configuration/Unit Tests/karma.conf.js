/**
 * @filename:       karma.conf.js
 * @Author:         Kevin De Coninck
 * @version:        1.0.0
 *
 * @notes:
 * Defines the main configuration for the Karma Unit Test Runner.
 * It says basically the following:
 *
 * basePath:        The base path that is used to resolve all the paths in the files parameters.
 * files:           Contains all the files which are required to execute the unit tests, also the test files itself
 *                  are placed here. However, a filter is being used to automatically include all the test as long
 *                  as they've been placed in a specific folder.
 * autoWatch:       Enabled or disables watching of files as executing the tests as soon as one of those files does
 *                  change.
 * frameworks:      The frameworks which are used to perform the tests.
 * browsers:        The browsers to test in.
 */
module.exports = function(config){
    config.set({
        basePath : '../../',

        // List of files / patterns to load in the browser.
        files : [
            // Resources
            'Resources/External/Bower/jquery/dist/jquery.js',
            'Resources/External/Bower/angular/angular.js',
            'Resources/External/Bower/angular-mocks/angular-mocks.js',
            'Resources/Scripts/OfficeUI.js',
            'Resources/Scripts/Elements/OfficeUI.Elements.js',

            // Fixtures
            { pattern: 'Tests/Fixtures/*.Test.html', watched: true, served: true, included: false },

            // Unit Tests
            'Tests/**/*.Test.js'
        ],
        autoWatch : true,
        watched: true,
        server: true,
        include: false,
        frameworks: ['jasmine-jquery', 'jasmine'],
        browsers: ['Chrome']
    });
};
