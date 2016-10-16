(function($) {
  'use strict';

    // enable popovers
    $('[data-toggle="popover"]').popover();

    $(document).ready(function() {
        // set image capture devices from available fields
        $.each(image_capture, function(key){
          $('select[name="capture_device"]').append($('<option>', {
              value: key.sluggify(),
              text: key
          }));
        });

        // app and form logic
        var counter = 1; // for adding fields

        var wrapper = $('.form-group');
        var add_button = $('.add_field'); // add salary? add_wage?
        var form_wrapper = $('form#calculator');

        var extant = 0;

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
            total_time = 0,
            total_staff_cost = 0,
            total_hourly_cost = 0;

        // set initial values
        set_values();

        // add/remove fields by cloning entries and replacing classes
        $(document).on('click', '.add_field', function(e) {
            e.preventDefault();

            // This currently clones the first field to all the fields
            // which is what I'm telling it to do, but it's unexpected
            var currentEntry = $(this).parents('.form-group:first');
            //TODO: change the label value
            var newEntry = $(currentEntry.clone());
            currentEntry.after(newEntry);

            newEntry.find('.add_field').removeClass('add_field').addClass('remove_field');
            newEntry.find('.fa-plus').removeClass('fa-plus').addClass('fa-minus');

            // check if the slug exists
        }).on('click', '.remove_field', function(e) {
          var key = $(this).parent('.entry').find('field_label');
            console.log('key', key);

            $(this).parents('.entry:first').remove();
            // TODO:remove slug
            e.preventDefault();
            return false;
        });

        $('.field_label').change(function(e) {

          var slug = $(this).val().sluggify();

          // check if slug exists on slugs
          //
          var slug_exists = 0 !== $('select option[value='+slug+']').length;
          console.log('slug-test', slug_exists);

            $('select.perfomed_by').append($('<option>', {
                value: $(this).val().sluggify(),
                text: $(this).val()
            }));
        });


        // definately need the counter for this...
        // $("input[name='salary-label[]']").change(function() {
        //     // this will fail, as it needs to fire when someone adds, not when there's a change
        //     add_name('1', $(this).val());
        //     console.log($(this).val());
        // });

        // Appends names to "Performed By" labels
        function add_name(val, label) {
            $('select').append($('<option>', {
                value: val,
                text: label
            }));
        }

        function set_values() {
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
          var scans = (extent * 1200) / 100;
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

Number.prototype.formatCurrency = function(c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d === undefined ? "." : d,
        t = t === undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

// Polyfill for string.includes method
// @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes
if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    'use strict';
    if (typeof start !== 'number') {
      start = 0;
    }

    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}
