(function($) {
  'use strict';

    // enable popovers
    $('[data-toggle="popover"]').popover();

    $(document).ready(function() {

        var people = [];
        // pre-populate first object in array
        var empty_person = new Person(0, '', '', 0, 0);
        people.push(empty_person);
        // add a default empty option for performed_by
        $('select[name!="capture_device"]').append($('<option>', {
            value: 0,
            text: ''
        }));

        // set image capture devices from available fields
        $.each(image_capture, function(key){
          $('select[name="capture_device"]').append($('<option>', {
              value: key.sluggify(),
              text: key
          }));
        });

        // app and form logic
        var counter = 1; // for adding fields

        var scans = 0;

        var wrapper = $('.form-group');
        var add_button = $('.add_field'); // add salary? add_wage?
        var form_wrapper = $('form#calculator');

        var extant = 0;
        var hourly = [], staff = [];

        var preparation = [];

        function JobEstimate(label, percentage, performed_by, extent, lookup) {
          this.label = label;
          this.extent = 0;
          // this.average_time = 0; // look up from var object
          this.lookup = lookup; // why is this undefined?

          // this.lookup = 'preparation_stats';
          if ( preparation_stats[label] === 'undefined') {
            this.average_time = 0;
          }
          console.log('label', label);
          console.log('lookup', this.average_time);

          // console.log(lookup[label].average);

          this.percentage = parseFloat(percentage) / 100;
          this.performed_by = performed_by;
          this.type = performed_by.type;
          this.cost = this.percentage * this.extent * this.average_time * performed_by.total_hourly_rate;
        }

        var preparation_times = {
          'condition_review': new JobEstimate('condition_review', 0, empty_person, preparation_stats),
          'disbinding': new JobEstimate('disbinding', 0, empty_person, preparation_stats),
          'fastener_removal': new JobEstimate('fastener_removal', 0, empty_person, preparation_stats),
          'flattening': new JobEstimate('flattening', 0, empty_person, preparation_stats),
          'rights_review': new JobEstimate('rights_review', 0, empty_person, preparation_stats),
          'supporting_materials': new JobEstimate('supporting_materials', 0, empty_person, preparation_stats),
          'supporting': new JobEstimate('supporting', 0, empty_person, preparation_stats),
          'unique_id': new JobEstimate('unique_id', 0, empty_person, preparation_stats)
        };

        // console.log('preparation_stats', preparation_stats);

        var preparation_costs = {};

        function sum_hash_costs(hash) {
          var costs = { salaried: 0, hourly: 0, total: 0};
          $.each(hash, function(key, value) {
            // console.log(value);
            switch(value.performed_by.type) {
              case 'hourly':
                costs.hourly += parseFloat(value.performed_by.cost) || 0;
                break;
              case 'salaried':
                costs.salaried += parseFloat(value.performed_by.cost) || 0;
                break;
            }

            costs.total = costs.salaried + costs.hourly;
          });
          return costs;
        }

        var post_processing_times = {};
        var post_preparation_times = {};

        var total_digitization_time = 0,
            total_quality_control = 0,
            total_metadata = 0,
            total_staff_digization_cost = 0,
            total_hourly_digization_cost = 0,
            total_preperation_time = 0,
            total_staff_preperation_cost = 0,
            total_hourly_preperation_cost = 0,
            total_post_processing_time = 0,
            total_staff_post_processing_cost = 0,
            total_hourly_post_processing_cost = 0,
            total_quality_control_time = 0,
            total_metadata_hourly_cost = 0,
            total_quality_control_staff_cost = 0,
            total_quality_control_hourly_cost = 0,
            total_metadata_time = 0,
            total_metadata_staff_cost = 0,
            total_post_preparation_time = 0,
            total_staff_post_preparation_cost = 0,
            total_hourly_post_preparation_cost = 0,
            total_post_staff_preparation_cost = 0,
            total_post_hourly_preparation_cost = 0,
            total_time = 0,
            total_staff_cost = 0,
            total_hourly_cost = 0;

        // individual fields
        // preparation of original materials
        var condition_review = 0,
          disbanding = 0,
          fastener_removal = 0,
          flattening = 0,
          rights_review = 0,
          sorting_items = 0,
          supporting = 0,
          unique_id = 0;

          // post-processing

        var alignment = 0,
          background_removal = 0,
          clean_up = 0,
          color_correction = 0,
          cropping = 0,
          stitching = 0;
          // post-preparation
        var desorting = 0,
          rebinding = 0,
          refastening = 0;

        // set initial values
        set_values();

        $('form').on('change', set_values);

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
            var current_option = 'select option[value="' + id + '"]';
            $(current_option).remove();

            return false;
        });

        function update_condition_review(){
            var percent = parseFloat($('#condition_review_percentage').val() || 0);
            var performed_by = parseInt($('#condition_review_by').val()) || 0;
            var p = people[performed_by];
            var extent = parseFloat($('input#extent').val()) || 0;
            // var extent = parseFloat($('#extent').val()) || 0.0;
            var estimate = new JobEstimate('condition_review', percent, p, extant, preparation_stats);
            preparation_times.condition_review = estimate;
            preparation_costs = sum_hash_costs(preparation_times);
            // console.log(preparation_stats[label].average);
            console.log('preparation_times', preparation_times);
            console.log('preparation_costs', preparation_costs);
        }

        // function calculate_step_hourly_rate( field_prefix ){
        //   var percent_field = field_prefix + "_percentage";
        //   var performed_field = field_prefix + "_reviewed_by";
        //   var percent = parseFloat($(percent_field).val() || 0);
        //   var perfomed_by = parseInt($(performed_field).val() || 0);
        //   var person = people[performed_by];
        //
        //   return new JobEstimate('condition_review', percent, person);
        // }

        function update_preparation_time(){
          update_condition_review();
        }

        function update_post_processing_time(){

        }

        function update_metadata_time(){
          var level = $('input:radio[name="descriptive_medatadata"]:checked').val();
          total_metadata_time = Math.floor((metadata_stats[level].average * scans) / 100);
        }

        function update_quality_control(){
          var qc_level = $('input:radio[name="quality_control"]:checked').val();
          // TODO: ask about precision
          total_quality_control_time = Math.floor(quality_control_stats[qc_level].average * scans / 100);
        }

        function update_post_preperation_time(){

        }

        function update_totals() {
          update_preparation_time();
          update_post_processing_time();
          update_quality_control();
          update_metadata_time();
          update_post_preperation_time();

          total_time = total_digitization_time + total_preperation_time +
            total_post_processing_time + total_quality_control_time +
            total_metadata_time + total_post_staff_preparation_cost;
          total_staff_cost = total_staff_digization_cost + 0;
          total_hourly_cost = total_hourly_digization_cost;


        }

        function set_values() {
            update_totals();

            $('.total-digitization-time').html(total_digitization_time);
            $('.total-staff-digization-cost').html((total_staff_digization_cost).formatCurrency(2));
            $('.total-hourly-digization-cost').html((total_hourly_digization_cost).formatCurrency(2));

            $('.total-quality-control-time').html(total_quality_control_time);
            $('.total-quality-control-staff-cost').html((total_quality_control_staff_cost).formatCurrency(2));
            $('.total-quality-control-hourly-cost').html((total_quality_control_hourly_cost).formatCurrency(2));

            $('.total-preperation-time').html(total_preperation_time);
            $('.total-staff-preperation-cost').html((total_staff_preperation_cost).formatCurrency(2));
            $('.total-hourly-preperation-cost').html((total_hourly_preperation_cost).formatCurrency(2));

            $('.total-metadata-time').html(total_metadata_time);
            $('.total-metadata-staff-cost').html((total_metadata_staff_cost).formatCurrency(2));
            $('.total-metadata-hourly-cost').html((total_metadata_hourly_cost).formatCurrency(2));

            $('.total-post-processing-time').html(total_post_processing_time);
            $('.total-staff-post-processing-cost ').html((total_staff_post_processing_cost).formatCurrency(2));
            $('.total-hourly-post-processing-cost').html((total_hourly_post_processing_cost).formatCurrency(2));

            $('.total-post-preparation-time').html(total_post_preparation_time);
            $('.total-staff-post-preparation-cost').html((total_staff_post_preparation_cost).formatCurrency(2));
            $('.total-hourly-post-processing-cost').html((total_hourly_post_preparation_cost).formatCurrency(2));

            $('.total-time').html(total_time);
            $('.total-staff-cost').html((total_staff_cost).formatCurrency(2));
            $('.total-hourly-cost').html((total_hourly_cost).formatCurrency(2));
        }

        $(form_wrapper).change(function(element) {
            update_values($(this));
        });

        function get_scanner_average(scanner){
            return image_capture[scanner];
        }

        function minutes_in_hours(m) {
          return Math.floor(m / 60);
        }

        function scan_time(){
          var extent = parseInt($('input#extent').val());
          // TODO: alert user that this must be a number
          if( isNaN(extent) ){
            extent = 0;
          }
          // 1 linear ft == 1,200 scans
          // recorded as time per 100 scans
          scans = (extent * 1200) / 100;
          // figure out the selected scanner
          var scanner = $('select[name="capture_device"] option:selected').text();

          if(scanner !== 'Select'){
            var device  = get_scanner_average(scanner);
            var minutes = scans * device.average;
            var time    = minutes_in_hours(minutes);
            total_digitization_time = time;
            set_values();
          }

          // console.log(scanner);
        }

        function update_values(form) {
            var values = {};
            scan_time();
            update_quality_control();
            // values.extent = "";
            total_digitization_time = '';
            // extant = $('#extent').val();
            $.each($('#calculator').serializeArray(), function(i, field) {
                // console.log(field);
                values[field.name] = field.value;
            });

            // console.log(values);
            // salaried = $('#calculator :input').val();
            // console.log('extant: ', extant);
            // total_digitization_time =
        }


        // $(wrapper).on('click', '.remove_field', function(e) {
        //     e.preventDefault();
        //     //todo remove the option from the drop-down menu
        //     $(this).parent('div').remove();
        // });

        // handle form submission
        $('form#calculator').submit(function(e) {
            e.preventDefault();
            console.log($(this).serialize());

            // console.log(digitizationCalculator.getVariables());
            //var calculator = digitizationCalculator.getVariables();
            //console.table($(this).serializeArray());
        });

    });
})(jQuery);

// @see http://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
String.prototype.toProperCase = function() {
    return this.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

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

    if (this.type === 'salaried') {
        this.rate = calculate_hourly_rate(rate, hpw);
    } else {
        this.rate = parseFloat(rate);
    }

    this.benefits = calculate_hourly_rate(this.benefits_percent * this.rate);
    this.total_hourly_rate = (this.rate + this.benefits).toFixed(2);
}
