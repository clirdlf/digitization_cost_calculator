people = [];
console.log(prep_times);

var average = 0;

/**
$(function()
{
    people = [];

    $(document).on('click', '.btn-add', function(e)
    {
        e.preventDefault();

        var controlForm = $('.controls form:first'),
            currentEntry = $(this).parents('.entry:first'),
            newEntry = $(currentEntry.clone()).appendTo(controlForm);
            name = $(this).parents('.entry:first').children('.form-control').val();

            // this should be if one of these fields is changed...
            people.push(name);

            // append option
            $('.performed_by').append($('<option>', {
                value: name.sluggify(),
                text: name
            }));

            console.log('people array', people);

        newEntry.find('input').val('');
        controlForm.find('.entry:not(:last) .btn-add')
            .removeClass('btn-add').addClass('btn-remove')
            .removeClass('btn-success').addClass('btn-danger')
            .html('<span class="glyphicon glyphicon-minus"></span>');
    }).on('click', '.btn-remove', function(e)
    {
        var obj = $(this).parents('.entry:first');
        name = obj.children('.form-control').val();
        // remove the form field
        obj.remove();
        // remove the option from the select box
        var option = 'select option[value="' + name.sluggify() + '"]';
        $(option).remove();
        // remove from the array
        people.splice($.inArray(name, people), 1);
        // var index = people.indexOf(name);
        // if (index > -1) {
        //     people.splice(index, 1);
        // }
        console.log('people array', people);
		e.preventDefault();
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
    var hpw = (typeof hours_per_week !== 'undefined') ?  hours_per_week : 40;
    return parseFloat(salary) / 52 / parseFloat(hpw);
}

function Person(name, type, rate, benefits, hours_per_week) {
    // sets the hours_per_week to 40
    var hpw = (typeof hours_per_week !== 'undefined') ?  hours_per_week : 40;
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
