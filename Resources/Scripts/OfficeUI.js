/**
 * @filename       OfficeUI.js
 * @Author         Kevin De Coninck
 * @version        1.0.0
 * @date           30/03/2015
 *
 * @depends             AngularJS/Services/CssInjectorService.js
 * @depends             AngularJS/Services/ImagePreloaderService.js
 * @depends             AngularJS/Services/OfficeUIConfigurationService.js
 *
 * @depends             AngularJS/Controllers/OfficeUIController.js
 *
 * @depends             AngularJS/Directives/OfficeUIRibbonScroll.js
 * @depends             AngularJS/Directives/OfficeUIToggleClassOnClick.js
 * @depends             AngularJS/Directives/OfficeUIToggleStyleOnHover.js
 * @depends             AngularJS/Directives/StopPropagation.js
 * @depends             AngularJS/Directives/OfficeUITooltip.js
 *
 * @depends             AngularJS/Filters/ActionLegend.js
 *
 * @depends             AngularJS/Services/Controls/Ribbon.js
 *
 * @notes
 * Defines the main starting point for the 'OfficeUIApplication' module.
 *
 * @remarks
 * In the comments above, you do some entries with the name 'depends'. Those entries should not be removed, nor
 * adjusted. There's a tool included which is stored in 'Tools/Build/JavaScriptCombiner/JavaScriptCombiner.exe'.
 * This tool will read this particular file, and search for all the 'depends' in the comments. The contents of this file
 * and all it's dependencies is outputted in a single file, which makes sure that there's only 1 request to the server
 * to request all those files, while keeping a high readability by using different files for development.
 * When you do change any of the dependent files, you should also touch this file to make sure that the combined version
 * is the latest version.
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