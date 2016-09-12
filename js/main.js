(function($) {
  'use strict';

  //import * as calculator from './calculator';

  $(document).ready(function() {
    // app and form logic

    var wrapper    = $('.form-group');
    var add_button = $('.add_field'); // add salary? add_wage?

    $(add_button).click(function(e) {
      e.preventDefault();
      var t = $(this);
      var field = t.siblings('label').attr('for');
      var clean_field = field.replace(/\[\]/, '');
      // TODO: finish off making this cleaner
      t.parent().append(`<div class="form-group"><label for="${clean_field}">${clean_field.toProperCase()}</label> <input name="${field}" type="number" step="any" placeholder="Annual Salary"> <input name="${field}-benefits[]" type="number" step="any" placeholder="% Benefits"> <a class="remove_field">X</a></div>`);
    });

    $(wrapper).on('click', '.remove_field', function(e) {
      e.preventDefault();
      $(this).parent('div').remove();
    });

    // handle form submission
    $('form#calculator').submit(function(e) {
      e.preventDefault();
      console.log($(this).serialize());

      console.log(digitizationCalculator('hi'));
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
