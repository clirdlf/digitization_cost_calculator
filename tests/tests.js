var hourly_employee = new Person(0, 'Thomas Jefferson', 'hourly', 10, 23);
var salaried_employee = new Person(1, 'George Washington', 'salaried', 52000, 23);
var scanner = 'Flatbed scanner (i.e., an Epson 11000XL)';

// QUnit.test("template", function( assert ) {
//     assert.ok(1 == "1", "Passed");
// });

QUnit.test("Estimate object defaults", function( assert ){
    var e = estimate;

    assert.equal(e.extent, 0, 'extent property');
    assert.equal(e.total_scans(), '', 'capture_device method');
    assert.equal(e.scans_per_hundred(), '', 'scans_per_hundred method');

    e.extent = 1;
    assert.equal(e.extent, 1, 'extent property');
    assert.equal(e.total_scans(), 1200, 'capture_device property');
    assert.equal(e.scans_per_hundred(), 12, 'scans_per_hundred method');

    assert.equal(e.capture_device, '', 'default capture_device property');
    assert.equal(e.capture_average(), 0, 'capture_average method');

    e.capture_device = 'iphone'; // test value not on list
    assert.equal(e.capture_average(), 0, 'capture_average method from unknown key');

    e.capture_device = 'Flatbed scanner (i.e., an Epson 11000XL)';
    assert.equal(e.capture_average(), 183.5533333333333, 'capture_average method from known key');

    assert.equal(e.quality_control, 'level_1', 'default quality control');
    assert.equal(e.quality_control_estimate().total_time, 45.301025641025646, 'level_1 quality control total_time');
    e.quality_control = 'level_2'; //37.93333333333333
    assert.equal(e.quality_control_estimate().total_time, 37.93333333333333, 'level_2 quality control total_time');
    e.quality_control = 'foo';
    assert.equal(e.quality_control_estimate().total_time, 0, 'foo quality control total_time');
});

QUnit.test("Estimate capture", function( assert ) {
    var e = estimate;
    e.extent = 1;
    e.capture_device = scanner;
    // 1 * (1200 / 100) * 183.5533333333333 = 2202.64 minutes
    assert.equal(e.capture_estimate(), 2202.64, '1 linear foot flatbed capture in minutes');
    e.extent = 10;
    assert.equal(e.capture_estimate(), 22026.399999999998, '10 linear foot flatbed capture in minutes');

    // this is sometimes needed, but really shouldn't be
    e.extent = 0;
    e.capture_device = '';
});

QUnit.test("preparation_estimate", function( assert ) {
    var e = estimate;

    e.extent = 1;
    e.capture_device = scanner;

    var prep = e.preparation_of_materials;
    prep.condition_review.percentage = 100;
    prep.condition_review.by = hourly_employee;

    assert.equal(prep.condition_review.average, 15.333333333333334, 'condition review average lookup');
    assert.equal(prep.condition_review.by, hourly_employee, 'hourly_employee doing condition_review');

    assert.equal(e.preparation_estimate().total_time, 184, 'time for condition_review by hourly employee');
    assert.equal(e.preparation_estimate().total, 15.333333333333334, 'total cost for condition review');
    assert.equal(e.preparation_estimate().salaried, 0, 'salary costs for condition review');
    assert.equal(e.preparation_estimate().hourly, 15.333333333333334, 'hourly costs for condition review');

    prep.fastener_removal.percentage = 100;
    prep.fastener_removal.by = salaried_employee;

    assert.equal(e.preparation_estimate().total_time, 525.2121212121212, 'time for condition_review by hourly employee');
    assert.equal(e.preparation_estimate().total, 43.76767676767677, 'total cost for condition review');
    assert.equal(e.preparation_estimate().salaried, 28.434343434343432, 'salary costs for condition review');
    assert.equal(e.preparation_estimate().hourly, 15.333333333333334, 'hourly costs for condition review');

    console.log(e.preparation_estimate());

    e.extent = 0;
    e.capture_device = '';

});
QUnit.test("People Instantiation without hours", function( assert ){
    var person = new Person(0, '', 'hourly', 23, 23);
    assert.equal(person.hours_per_week, 40, "hours per week");
});

QUnit.test("calculate_hourly_rate", function( assert ) {
    var salary = 30000;
    var result = calculate_hourly_rate(salary);
    var result2 = calculate_hourly_rate(salary, 40);
    var result3 = calculate_hourly_rate(salary, 35);

    // hourly rate == (30000/52/40) 14.423076923
    assert.equal(result, 14.42, 'salary to hourly_rate without hours');
    // hourly rate with hours should equal without hours
    assert.equal(result2, result, 'salary to hourly_rate with hours');
    // hourly_rate == (30000/52/35) 16.483516484
    assert.equal(result3, 16.48, 'salary to hourly rate with 35 hours');
});

QUnit.test("Hourly person properties", function( assert ){
    var person = new Person(0, 'Thomas Jefferson', 'hourly', 23, 23, 40);
    var person2 = new Person(1, 'Thomas Jefferson', 'hourly', 23, 23, 35);

    assert.equal(person.id, 0, 'id is 0');
    assert.equal(person.name, 'Thomas Jefferson', 'Name property');
    assert.equal(person.type, 'hourly', 'hourly property');
    assert.equal(person.rate, 23, 'rate property');
    assert.equal(person.benefits_percent, 0.23, 'benefits_percent property');
    assert.equal(person.slug, 'thomas-jefferson', 'slug property');

    assert.equal(person.hours_per_week, 40, 'hours property omitted'); // optional param
    assert.equal(person2.hours_per_week, 35, 'hours property set');

    // .23 * 23 == 5.29
    assert.equal(person.hourly_benefits, 5.29, 'hourly benefits');
    // 5.29 + 23 == 28.29
    assert.equal(person.total_hourly_rate, 28.29, 'total hourly rate');
    assert.equal(person.total_minute_rate, 0.47, 'total per-minute rate');
});

QUnit.test("Salaried person properties", function(assert){
    var person = new Person(0, 'Thomas Jefferson', 'salaried', 30000, 23);

    assert.equal(person.rate, 14.42, 'salaried hourly rate');
    // 14.42 * .23 == 3.32
    assert.equal(person.hourly_benefits, 3.32, 'salaried hourly benefits');
    // 14.42 + 3.32 == 17.7366
    assert.equal(person.total_hourly_rate, 17.74, 'salaried total hourly rate');
});

QUnit.test("Test unsupported Person type (not salaried|hourly)", function(assert){
    var person = new Person(0, 'Thomas Jefferson', 'under the table', 23, 23);
    assert.equal(person.rate, 23);
    assert.equal(person.type, 'under the table');
    assert.equal(person.hours_per_week, 40);
});

QUnit.test("Utilities", function( assert ) {
    var test_string = 'this is a Test strinG';
    var number = 23, number2 = 2000, number3 = 2.23344;
    assert.equal(test_string.toProperCase(), 'This Is A Test String', 'Proper case');
    assert.equal(test_string.sluggify(), 'this-is-a-test-string', 'test_string to slug');
    assert.equal(number.formatCurrency(), '23.00');
    assert.equal(number2.formatCurrency(), '2,000.00');
    assert.equal(number3.formatCurrency(), '2.23');
    assert.ok(test_string.includes('Test'), 'test_string includes "Test"');
    assert.notOk(test_string.includes('string'), 'test_string does not include "string"');
});
