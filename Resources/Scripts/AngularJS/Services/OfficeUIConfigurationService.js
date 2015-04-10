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