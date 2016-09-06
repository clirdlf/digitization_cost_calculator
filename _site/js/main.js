(function($) {
  'use strict';

  $(document).ready(function() {
    // app and form logic
    console.log('working');

    var max_fields = 10;
    var wrapper    = $('.form-group');
    var add_button = $('.add_field'); // add salary? add_wage?

    $(add_button).click(function(e) {
      e.preventDefault();
      var t = $(this);
      var field = t.siblings('label').attr('for');
      var clean_field = field.replace(/\[\]/, '');
      // TODO: finish off making this cleaner
      t.parent().append(`<div class="form-group"><label for="salary">${clean_field.toProperCase()}</label> <input name="${field}" type="number" step="any" placeholder="Annual Salary"> <input name="${field}-benefits[]" type="number" step="any" placeholder="% Benefits"> <a class="remove_field">X</a></div>`);
    });

    $(wrapper).on('click', '.remove_field', function(e) {
      e.preventDefault();
      $(this).parent('div').remove();
      //count--;
    });

  });
})(jQuery);

String.prototype.toProperCase = function() {
  return this.replace(/\w\S*/g, function(txt){
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};
