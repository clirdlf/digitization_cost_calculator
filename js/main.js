(function($) {
  'use strict';

  //import * as calculator from './calculator';

  $(document).ready(function() {
    // app and form logic

    var wrapper      = $('.form-group');
    var add_button   = $('.add_field'); // add salary? add_wage?
    var form_wrapper = $('form#calculator');

    var total_digitization_time = 0,
        total_quality_control = 0,
        total_metadata = 0,
        total_staff_digization_cost = 0,
        total_hourly_digization_cost = 0,
        total_quality_control_time = 0,
        total_metadata_hourly_cost = 0,
        total_quality_control_staff_cost = 0,
        total_quality_control_hourly_cost = 0,
        total_metadata_time = 0,
        total_metadata_staff_cost = 0;

    // set initial values
    set_values();

    $(add_button).click(function(e) {
      e.preventDefault();
      var t = $(this);
      var field = t.siblings('label').attr('for');
      var clean_field = field.replace(/\[\]/, '');
      // TODO: finish off making this cleaner
      t.parent().append(`<div class="form-group"><label for="${clean_field}">${clean_field.toProperCase()}</label> <input name="${field}" type="number" step="any" placeholder="Annual Salary"> <input name="${field}-benefits[]" type="number" step="any" placeholder="% Benefits"> <input name="${field}-label[]" placeholder="Name"> <a class="remove_field"><i class="fa fa-close" aria-hidden="true"></i></a></div>`);
      // TODO: append to drop downs
    });


    function set_values(){
      $('.total-digitization-time').html(total_digitization_time);
      $('.total-staff-digization-cost').html((total_staff_digization_cost).formatCurrency(2));
      $('.total-hourly-digization-cost').html((total_hourly_digization_cost).formatCurrency(2));

      $('.total-quality-control-time').html(total_quality_control_time);
      $('.total-quality-control-staff-cost').html((total_quality_control_staff_cost).formatCurrency(2));
      $('.total-quality-control-hourly-cost').html((total_quality_control_hourly_cost).formatCurrency(2));

      $('.total-quality-control-time').html(total_quality_control_time);
      $('.total-quality-control-staff-cost').html((total_quality_control_staff_cost).formatCurrency(2));
      $('.total-quality-control-hourly-cost').html((total_quality_control_hourly_cost).formatCurrency(2));

      $('.total-quality-control-time').html(total_metadata_time);
      $('.total-quality-control-staff-cost').html((total_metadata_staff_cost).formatCurrency(2));
      $('.total-quality-control-hourly-cost').html((total_metadata_hourly_cost).formatCurrency(2));
    }

    $(form_wrapper).change(function(element) {
      var $this = $(this);

    });


    $(wrapper).on('click', '.remove_field', function(e) {
      e.preventDefault();
      $(this).parent('div').remove();
    });

    // handle form submission
    $('form#calculator').submit(function(e) {
      e.preventDefault();
      console.log($(this).serialize());

      console.log(digitizationCalculator.getVariables());
      //var calculator = digitizationCalculator.getVariables();
      //console.table($(this).serializeArray());
    });

  });
})(jQuery);

String.prototype.toProperCase = function() {
  return this.replace(/\w\S*/g, function(txt){
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

Number.prototype.formatCurrency = function(c, d, t) {
  var n = this,
    c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };
