/**
 * @filename:       OfficeUI.General.js
 * @Author:         Kevin De Coninck
 * @version:        1.0.0
 * @date:           11/03/2015
 *
 * @notes:
 * Defines various methods that are called from within other javascript files which makes the development more easy.
 */

/**
 * @Type            Function
 * @name            OfficeUIStylesheetException
 *
 * @param           message (string):       A message to pass to this exception type.
 *
 * @notes
 * When this method is called an error is written in the console window of the browser which is formatted according
 * to the following syntax: ['OfficeUIStylesheetException:' {message}]
 */
var OfficeUIStylesheetException = function(message) {
    return console.error('\'OfficeUIStylesheetException:\' ' + message);
}

/**
 * @Type            Function
 * @name            OfficeUILoadingException
 *
 * @param           message (string):       A message to pass to this exception type.
 *
 * @notes
 * When this method is called an error is written in the console window of the browser which is formatted according
 * to the following syntax: ['OfficeUILoadingException:' {message}]
 */
var OfficeUILoadingException = function(message) {
    return console.error('\'OfficeUILoadingException:\' ' + message);
}

/**
 * @Type            Function
 * @name            OfficeUIConfigurationException
 *
 * @param           message (string):       A message to pass to this exception type.
 *
 * @notes
 * When this method is called an error is written in the console window of the browser which is formatted according
 * to the following syntax: ['OfficeUIConfigurationException:' {message}]
 */
var OfficeUIConfigurationException = function(message) {
    return console.error('\'OfficeUILoadingException:\' ' + message);
}