/**
 * @filename       OfficeUI.js
 * @Author         Kevin De Coninck
 * @version        1.0.0
 * @date           30/03/2015
 *
 * @depends             AngularJS/Services/OfficeUI.AngularJS.Services.CssInjectorService.js
 * @depends             AngularJS/Services/OfficeUI.AngularJS.Services.OfficeUIConfigurationService.js
 * @depends             AngularJS/Services/OfficeUI.AngularJS.Services.PreloaderService.js
 * @depends             AngularJS/Services/OfficeUI.AngularJS.Services.OfficeUIRibbonControlService.js
 *
 * @depends             AngularJS/Controllers/OfficeUI.AngularJS.Controllers.OfficeUIController.js
 *
 * @depends             AngularJS/Directives/OfficeUI.AngularJS.Directives.OfficeUIToggleClassOnClick.js
 * @depends             AngularJS/Directives/OfficeUI.AngularJS.Directives.OfficeUIToggleStyleOnHover.js
 *
 * @notes
 * Defines the core components behind the OfficeUI application.
 * In this file all the required AngularJS code will be placed (Modules, Controller, Directives, ...)
 */

/**
 * @type            Module
 * @name            OfficeUI
 *
 * @description
 * Defines the AngularJS module 'OfficeUI' which groups all the necessary data and functions for an OfficeUI
 * application. It's on the module 'OfficeUI' that all the hooks needs to be connected.
 * By 'hooks', we do mean the Controllers, Directives, Filters, Services, ...
 */
var OfficeUI = angular.module('OfficeUIApplication', ['ngSanitize']);