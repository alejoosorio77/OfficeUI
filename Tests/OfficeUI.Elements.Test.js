/**
 * @filename:       OfficeUI.Elements.Test.js
 * @Author:         Kevin De Coninck
 * @version:        1.0.0
 * @date:           06/03/2015
 *
 * @notes:
 * Defines various tests that can be executed to ensure that all the methods in OfficeUI.Elements.js are working.
 */
describe("Unit: OfficeUI Elements", function() {
    // Provides a section to define code to execute before every test is executed.
    beforeEach(function() {
        jasmine.getFixtures().fixturesPath = 'base/Tests/Fixtures/';
        loadFixtures('OfficeUI.Elements.Button.Test.html');
    });

    //it("A class 'ie-fix' should be added to any 'a href' which is marked with a 'button' class when you click the element.", function() {

    //});
});