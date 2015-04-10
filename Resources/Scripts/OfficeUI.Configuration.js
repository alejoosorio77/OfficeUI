/**
 * @filename:       OfficeUI.Configuration.js
 * @Author:         Kevin De Coninck
 * @version:        1.0.0
 * @date:           11/03/2015
 *
 * @notes:
 * Defines the necessary configuration which is required for the OfficeUI application to function.
 */
(function($) {
    // Defines the OfficeUI plugin.
    $.fn.OfficeUI = function(options) { return this; }

    // Defaults settings for the OfficeUI website.
    // When you want to change the location of the file, it can be done like the following:
    // $.fn.OfficeUI.Settings.OfficeUIConfigurationFileLocation = '/Configuration/Application/OfficeUI.config.json';
    $.fn.OfficeUI.Settings = {
        OfficeUIConfigurationFileLocation: '/Configuration/Application/OfficeUI.config.json'
    };
}(jQuery));