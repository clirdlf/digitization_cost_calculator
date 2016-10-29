var people = []; // global object to keep track of people

// pre-populate one person in the people array
var empty_person = new Person(0, '', '', 0, 0);
people.push(empty_person);

(function($) {
  'use strict';

  $('[data-toggle="popover"]').popover();

  // set image capture devices from available fields
  $.each(sortObject(image_capture), function(key){
    $('select[name="capture_device"]').append($('<option>', {
      value: key.sluggify(),
      text: key
    }));
  });

  var preparation_of_materials_fields = Object.keys(estimate.preparation_of_materials);
  var post_processing_fields = Object.keys(estimate.post_processing);
  var post_preparation_fields = Object.keys(estimate.post_preparation);

  // When there is a change in the form, set the values
  $('form').on('change', set_values);

  // set object values sections (except with radio buttons)
  function set_object_values(obj, lookup){
    $.each(obj, function(i){
      var prefix = obj[i];
      var percent_selector = '#' + prefix + '_percent';
      var person_selector = '#' + prefix + '_by option:selected';
      estimate[lookup][prefix].percentage = parseFloat($(percent_selector).val());
      estimate[lookup][prefix].label = prefix;
      estimate[lookup][prefix].by = people[$(person_selector).val()];
    });
  }

  // get object values that have an average > 0
  function get_object_values(obj, lookup) {
    var values = [];
    $.each(obj, function(i){
      var prefix = obj[i];
      // TODO: deal with percentage == 0
      if(!isNaN(estimate[lookup][prefix].percentage)){
        values.push(estimate[lookup][prefix]);
      }
    });

    return values;
  }

  function format_report(){
    var prep_items = get_object_values(preparation_of_materials_fields, 'preparation_of_materials');
    var post_processing_items = get_object_values(post_processing_fields, 'post_processing');
    var post_preparation_items = get_object_values(post_preparation_fields, 'post_preparation');

    // console.log(estimate);
    // var prep_items = get_object_values(preparation_of_materials_fields, 'preparation_of_materials');
    // console.log('prep_items', prep_items);

    $('#report .extent').html(estimate.extent);

    if(estimate.capture_device !== '' && estimate.capture_device !== 'Select Your Capture Device') {
      $('#digitization_report').removeClass('hidden');
      $('#report .image_capture_device').html(estimate.capture_device);
    }


    if(estimate.capture_by && estimate.capture_by.name){
      $('#report .scan_by').html(estimate.capture_by.name);
      $('#report .scan_rate').html(estimate.capture_by.rate.formatCurrency());
      $('#report .total_hourly_rate').html(estimate.capture_by.total_hourly_rate.formatCurrency());
    }

    if(estimate.capture_device && image_capture[estimate.capture_device]){
      var capture_min = image_capture[estimate.capture_device].min;
      var capture_max = image_capture[estimate.capture_device].max;

      $('#report .scanner_average').html(image_capture[estimate.capture_device].average.toFixed(2));
      $('#report .scanner_range').html(capture_min + ' - ' + capture_max);
      $('#report .scanner_time').html(estimate.capture_estimate().toFixed(2));
      $('#report .scanning_cost').html(estimate.capture_estimate());
    }

    if(prep_items.length > 0){
      $('#preparation_of_materials_report').removeClass('hidden');
      $('#prep_data').html(report_table(prep_items));
    }

    if(post_processing_items.length > 0){
      $('#post_processing_report').removeClass('hidden');
      $('#post_processing_data').html(report_table(post_processing_items));
    }

    console.log(post_processing_items);
  }


  function set_values() {
    estimate.extent = parseFloat($('input#extent').val());
    estimate.capture_device = $('select[name="capture_device"] option:selected').text();
    estimate.capture_by = people[$('#scanning_by option:selected').val()];

    console.log(estimate);
    // preparation of materials
    set_object_values(preparation_of_materials_fields, 'preparation_of_materials');
    set_object_values(post_processing_fields, 'post_processing');
    set_object_values(post_preparation_fields, 'post_preparation');

    // quality_control
    // check if undefined, or set
    // console.log($('input:radio[name="quality_control"]:checked').val());
    if($('input:radio[name="quality_control"]:checked')){
      estimate.quality_control.level = $('input:radio[name="quality_control"]:checked').val();
      estimate.quality_control.percentage = $('#quality_control_percentage').val();
      estimate.quality_control.by = $('#quality_control_by option:selected').text();
    }

    if($('input:radio[name="metadata"]:checked')){
      estimate.metadata.level = $('input:radio[name="descriptive_medatadata"]:checked').val();
      console.log('estimate.quality_control ', estimate.quality_control );
    }

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
    $('.total-metadata-time').html(minutes_in_hours(estimate.metadata_estimate().total_time));
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
    // console.log('estimate', estimate);
    format_report();
  }

  // Build a report tsble from an array of tasks
  function report_table(tasks_array){
    var content = '<table class="table">';
    var total_time = 0, total_cost = 0;

    content += '<tr><th>Task</th><th>Percentage</th><th>Performed By</th><th>Time Estimate</th><th>Cost Estimate</th></tr>';
    $.each(tasks_array, function(item){
        var row = '<tr>';
        row += '<td>' + this.label + '</td>';
        row += '<td>' + this.percentage + '</td>';
        row += '<td>' + this.by.name + '</td>';
        row += '<td>' + '0' + '</td>';
        row += '<td> 0 </td>';
        row += '</tr>';
        content += row;
    });
    content += '<tr><td>&nbsp;</td><td>&nbsp;</td><td><strong>Total</strong></td>';
    content += '<td>' + total_time.toFixed(2) +'</td>';
    content += '<td>$' + total_cost.formatCurrency() + '</td></tr>';
    content += '</table>';
    return content;
  }
})(jQuery);
