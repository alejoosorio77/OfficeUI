/**
 * @filename:       OfficeUI.js
 * @Author:         Kevin De Coninck
 * @version:        1.0.0
 * @date:           10/03/2015
 *
 * @notes:
 * Defines the core components behind the OfficeUI application.
 * In this file all the required AngularJS code will be placed (Modules, Controller, Directives, ...)
 */
var OfficeUIModule = angular.module('OfficeUI', []);

/**
 * @type:           Controller
 * @name:           StylesheetController
 *
 * @notes:
 * Defines the 'StylesheetController' controller. This controller is used to render an OfficeUI website in various
 * styles.
 */
OfficeUIModule.controller('StylesheetController', ['$scope', function($scope) {
    // Defines all the available stylesheets.
    var availableStyles = [
        { name: 'Blue', stylesheet: '/Resources/Stylesheets/Styles/Blue/OfficeUI.Style.Blue.min.css' },
        { name: 'Green', stylesheet: '/Resources/Stylesheets/Styles/Green/OfficeUI.Style.Green.min.css' },
        { name: 'LightBlue', stylesheet: '/Resources/Stylesheets/Styles/LightBlue/OfficeUI.Style.LightBlue.min.css' },
        { name: 'Orange', stylesheet: '/Resources/Stylesheets/Styles/Orange/OfficeUI.Style.Orange.min.css' },
        { name: 'Purple', stylesheet: '/Resources/Stylesheets/Styles/Purple/OfficeUI.Style.Purple.min.css' },
        { name: 'Red', stylesheet: '/Resources/Stylesheets/Styles/Red/OfficeUI.Style.Red.min.css' },
        { name: 'Turquoise', stylesheet: '/Resources/Stylesheets/Styles/Turquoise/OfficeUI.Style.Turquoise.min.css' }
    ];

    // Sets the default stylesheet.
    this.style = availableStyles[0];
}]);