/**
 * @type            Filter
 * @name            actionLegend
 *
 * @description
 * Provides the 'actionLegend' filter. This filter will append some text to another element is a condition is matched.
 */
OfficeUI.filter('actionLegend', function() {
    return function(action) {
        if (action.MenuItems) { return action.Legend + ' <i class="fa fa-caret-down"></i>'; }
        return action.Legend;
    }
});