$(function() {

    var people = [];
    // pre-populate first object in array
    var empty_person = new Person(0, '', '', 0, 0);
    people.push(empty_person);
    // add a default empty option for performed_by
    $('select[name!="capture_device"]').append($('<option>', {
        value: 0,
        text: ''
    }));

    // console.log($('.performed_by'));

    $(document).on('click', '.btn-add', function(e) {
        e.preventDefault();

        var newid = 0;
        $.each($('.person'), function() {
            if (parseInt($(this).data('id')) > newid) {
                newid = parseInt($(this).data('id'));
            }
        });
        newid++;

        var staff_div = $('.staff:first'),
            currentEntry = $(this).parents('.person:first'),
            newEntry = $(currentEntry.clone()).appendTo(staff_div);

        newEntry.attr('data-id', newid); // increment the data-id value
        newEntry.find('input').val(''); // reset values in input

        // add a new row and update the classes
        staff_div.find('.person:not(:last) .btn-add')
            .removeClass('btn-add').addClass('btn-remove')
            .removeClass('btn-success').addClass('btn-danger')
            .html('<span class="glyphicon glyphicon-minus"></span>');

        // add to select options
        $('select[name!="capture_device"]').append($('<option>', {
        // $('.performed_by').append($('<option>', {
            value: newid,
            text: name
        }));

    }).on('change', '.person', function(e) {
        // change on the actual form name?
        var currentEntry = $(this);

        // read the values
        var id = $(this).data('id'),
            name = currentEntry.children('.staff_name').val(),
            type = currentEntry.children('select.type').find(":selected").val(),
            rate = currentEntry.children('.rate').val(),
            benefits = currentEntry.children('.benefits').val();
        // Set the Person object
        var person = new Person(id, name, type, rate, benefits);
        // Add/edit person in array
        people[id] = person;

        var current_option = 'select option[value="' + id + '"]';
        var new_option = $('<option>', {
            value: id, text: name
        });

        $(current_option).replaceWith(new_option);

        e.preventDefault();
    }).on('click', '.btn-remove', function(e) {
        e.preventDefault();

        var obj = $(this).parents('.person:first');
        obj.remove();

        // remove the person from the array
        people.splice(obj.data('id'), 1);

        // remove the option from the selects
        var id = obj.data('id');
        var current_option = 'select.performed_by option[value="' + id + '"]';
        $(current_option).remove();

        return false;
    });

});

String.prototype.sluggify = function() {
    var str = this;

    str = str.replace(/^\s+|\s+$/g, '');
    str = str.toLowerCase();
    str = str.replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    return str;
};

// Calculate the hourly rate for salaried employee calculations
// This current
function calculate_hourly_rate(salary, hours_per_week) {
    var hpw = (typeof hours_per_week !== 'undefined') ? hours_per_week : 40;
    return parseFloat(salary) / 52 / parseFloat(hpw);
}

function Person(id, name, type, rate, benefits, hours_per_week) {
    // sets the hours_per_week to 40
    var hpw = (typeof hours_per_week !== 'undefined') ? hours_per_week : 40;
    this.id = parseInt(id);
    this.name = name;
    this.type = type;
    this.slug = name.sluggify();
    this.benefits_percent = benefits;

    if (this.type === 'Salaried') {
        this.rate = calculate_hourly_rate(rate, hpw);
    } else {
        this.rate = parseFloat(rate);
    }

    this.benefits = calculate_hourly_rate(this.benefits_percent * this.rate);
    this.total_hourly_rate = (this.rate + this.benefits).toFixed(2);
}
