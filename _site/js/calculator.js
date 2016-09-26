var digitizationCalculator = (function() {

  var salaries, hourly_rates;

  return {

    getVariables: function() {
      return 'hi';
    },

    calculateHourlySalary: function(salary, benefits, hours = 40) {
      // there are not always 52 weeks in a year; use the current locale to
      // figure out how many weeks are in a year
      return (salary * benefits) / (moment().weeksInYear() / hours);
    },
    calculateHourlyRate: function(rate, benefits) {

    }
  };

})();

//var digitizationCalculator = (function () {
  //'use strict';

  //var digitizationCalculator = {
    
  //};

  //// The actual calculator logic in vanilla JS

  //var calcuations = {
    //extent:                         0,
    //salary:                         0,
    //salary_benefits:                0,
    //hourly:                         0,
    //hourly_benefits:                0,
    //condition_review_percentage:    0,
    //condition_review_by:            '',
    //disbinding_percentage:          0,
    //disbinding_by:                  0,
    //fastener_removal_percentage:    0,
    //fastener_remval_by:             '',
    //capture_device:                 '',
    //capture_level:                  0,
    //alignment_percentage:           0,
    //alignment_percentage_by:        '',
    //background_removal_percentage:  0,
  //background_removal_by:          '',
    //}

   
  //}

  //return digitizationCalculator;

//})();
