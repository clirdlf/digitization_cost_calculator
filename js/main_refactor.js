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

  var preparation_of_materials_fields = Object.keys(estimate.preparation_of_materials);
  var post_processing_fields = Object.keys(estimate.post_processing);
  var post_preparation_fields = Object.keys(estimate.post_preparation);

  $('form').on('change', set_values);

  // set object values sections (except with radio buttons)
  function set_object_values(obj, lookup){
      $.each(obj, function(i){
        var prefix = obj[i];
        var percent_selector = '#' + prefix + '_percent';
        var person_selector = '#' + prefix + '_by option:selected';
        estimate[lookup][prefix].percentage = parseFloat($(percent_selector).val());
        estimate[lookup][prefix].by = people[$(person_selector).val()];
      });
  }

  function set_values() {
    estimate.extent = parseFloat($('input#extent').val());
    estimate.capture_device = $('select[name="capture_device"] option:selected').text();

    // preparation of materials
    set_object_values(preparation_of_materials_fields, 'preparation_of_materials');
    set_object_values(post_processing_fields, 'post_processing');
    set_object_values(post_preparation_fields, 'post_preparation');
    // $.each(preparation_of_materials_fields, function(i){
    //   var prefix = preparation_of_materials_fields[i];
    //   var percent_selector = '#' + prefix + '_percent';
    //   var person_selector = '#' + prefix + '_by option:selected';
    //
    //   estimate.preparation_of_materials[prefix].percentage = parseFloat($(percent_selector).val());
    //   estimate.preparation_of_materials[prefix].by = people[$('#condition_review_by option:selected').val()];
    // });
    // quality_control
    estimate.quality_control = $('input:radio[name="quality_control"]:checked').val();
    estimate.metadata = $('input:radio[name="descriptive_medatadata"]:checked').val();
    // console.log('estimate.quality_control ', estimate.quality_control );

    $('.total_digitization_time').html(estimate.total_digitization_time());

    // preparation stats
    // TODO: set these values correctly
    $('total-preperation-time').html(estimate.preparation_estimate().total_time);
    $('total-salaried-preperation-time').html(estimate.preparation_estimate().salaried);
    $('total-hourly-preperation-time').html(estimate.preparation_estimate().hourly);

    // quality_control
    $('total-quality-control-time').html(estimate.quality_control_estimate().total_time);

    // post_processing
    $('total-post-processing-time').html(estimate.preparation_estimate().total_time);
    $('total-salaried-preperation-time').html(estimate.preparation_estimate().salaried);
    $('total-hourly-preperation-time').html(estimate.preparation_estimate().hourly);

    // metadata creation
    $('total-metadata-time').html(estimate.quality_control_estimate().total_time);

    // post_preparation
    $('total-post-processing-time').html(estimate.preparation_estimate().total_time);
    $('total-salaried-preperation-time').html(estimate.preparation_estimate().salaried);
    $('total-hourly-preperation-time').html(estimate.preparation_estimate().hourly);

    //console.log('preparaton', estimate.preparation_estimate());
    console.log('estimate', estimate.preparation_estimate());

  }
})(jQuery);
