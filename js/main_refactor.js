var people = []; // global object to keep track of people

// pre-populate one person in the people array
var empty_person = new Person(0, '', '', 0, 0);
people.push(empty_person);

(function($) {
  'use strict';

    $('[data-toggle="popover"]').popover();

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

    // quality_control
    estimate.quality_control = $('input:radio[name="quality_control"]:checked').val();
    estimate.metadata = $('input:radio[name="descriptive_medatadata"]:checked').val();
    // console.log('estimate.quality_control ', estimate.quality_control );

    $('.total-digitization-time').html(minutes_in_hours(estimate.total_digitization_time()));
    $('.total-staff-digization-cost').html((0).formatCurrency());
    $('.total-hourly-digization-cost').html((0).formatCurrency());

    // preparation stats
    // TODO: set these values correctly
    // total-staff-preperation-cost
    $('.total-preperation-time').html(estimate.preparation_estimate().total_time);
    $('.total-salaried-preperation-cost').html(estimate.preparation_estimate().salaried.formatCurrency());
    $('.total-hourly-preperation-cost').html(estimate.preparation_estimate().hourly.formatCurrency());

    // quality_control
    $('.total-quality-control-time').html(minutes_in_hours(estimate.quality_control_estimate().total_time));
    $('.total-quality-control-salaried-cost').html((0).formatCurrency());
    $('.total-quality-control-hourly-cost').html((0).formatCurrency());

    // post_processing
    $('.total-post-processing-time').html(minutes_in_hours(estimate.preparation_estimate().total_time));
    $('.total-salaried-post-processing-cost').html(estimate.preparation_estimate().salaried.formatCurrency());
    $('.total-hourly-post-processing-cost').html(estimate.preparation_estimate().hourly.formatCurrency());

    // metadata creation
    $('.total-metadata-time').html(minutes_in_hours(estimate.quality_control_estimate().total_time));
    $('.total-metadata-salaried-cost').html((0).formatCurrency());
    $('.total-metadata-hourly-cost').html((0).formatCurrency());

    // post_preparation
    $('.total-post-preparation-time').html(minutes_in_hours(estimate.preparation_estimate().total_time));
    $('.total-salaried-post-preparation-cost').html(estimate.preparation_estimate().salaried.formatCurrency());
    $('.total-hourly-post-processing-cost').html(estimate.preparation_estimate().hourly.formatCurrency());

    // TODO;
    $('.total-time').html(minutes_in_hours(0));
    $('.total-salaried-cost').html((0).formatCurrency());
    $('.total-hourly-cost').html((0).formatCurrency());
    //console.log('preparaton', estimate.preparation_estimate());
    console.log('estimate', estimate);

  }
})(jQuery);
