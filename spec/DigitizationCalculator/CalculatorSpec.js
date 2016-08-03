describe("Calculator", function(){
  var Calculator = require('../../js/main.js');

  describe("Extent Calcuation", function(){
      var test_extent = 100;

      it("should be 1200 * linear_feet", function(){
          expect(Calculator.calculate_linear_feet(test_extent)).toEqual(test_extent * 1200);
      });
  });
});
