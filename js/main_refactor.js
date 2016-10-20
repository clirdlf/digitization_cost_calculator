var people = []; // global object to keep track of people
// pre-populate one person in the people array
var empty_person = new Person(0, '', '', 0, 0);
people.push(empty_person);

(function($) {
  'use strict';

  // set image capture devices from available fields
  $.each(image_capture, function(key){
    $('select[name="capture_device"]').append($('<option>', {
      value: key.sluggify(),
      text: key
    }));
  });

  $('form').on('change', set_values);

  function set_values() {
    estimate.extent = parseFloat($('input#extent').val());
    estimate.capture_device = $('select[name="capture_device"] option:selected').text();
    estimate.preparation_of_materials.condition_review.percentage = parseFloat($('#condition_review_percent').val());
    // look up the person
    estimate.preparation_of_materials.condition_review.by = people[$('#condition_review_by option:selected').val()];

    console.log('revied', $('#condition_review_by option:selected').val());
    console.log('estimate', estimate);
  }

  // sort the options, though this does all of them ()
  // $('select[name="capture_device"]').sort_select_box();


  console.log('people', people);

})(jQuery);
