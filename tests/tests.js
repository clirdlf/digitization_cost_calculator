QUnit.test("example", function( assert ) {
    assert.ok(1 == "1", "Passed");
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
    assert.equal(person.benefits_percent, 23, 'benefits_percent property');
    assert.equal(person.slug, 'thomas-jefferson', 'slug property');

    assert.equal(person.hours_per_week, 40, 'hours property omitted'); // optional param
    assert.equal(person2.hours_per_week, 35, 'hours property set');

    // .23 * 23 == 5.29
    assert.equal(person.hourly_benefits, 5.29, 'hourly benefits');
    // 5.29 + 23 == 28.29
    assert.equal(person.total_hourly_rate, 28.29, 'total hourly rate');

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
});
