(function($) {
  // add a default option for the performed_by drop downs
  $('.performed_by').append($('<option>', { value: 0, text: '' }));

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
    // TODO: need to also exclude from 'staff_type'
    $('.performed_by').append($('<option>', {
      // $('.performed_by').append($('<option>', {
      value: newid,
      text: name
    }));

    // console.log('performed_by', $('.form-control .performed_by'));

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
      value: id,
      text: name
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
    var current_option = 'select option[value="' + id + '"]';
    $(current_option).remove();

    return false;
  });
})(jQuery);
