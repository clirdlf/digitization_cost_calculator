// from http://jsfiddle.net/sxGtM/3/

$.fn.serializeObject = function()
{
  var o = {};
  var a = this.serializeArray();
  $.each(a, function() {
    if (o[this.name] !== undefined) {
      if (!o[this.name].push) {
        o[this.name] = [o[this.name]];
      }
      o[this.name].push(this.value || '');
    } else {
      o[this.name] = this.value || '';
    }
  });
  return o;
};

// from http://bootsnipp.com/snippets/XaXB0
$(document).ready(function () {
  //@naresh action dynamic childs
  var next = 0;
  var previous;

  var fields = {};

  $('form').change(function(){
    console.log('hi');
    $('#result').text(JSON.stringify($('form').serializeObject()));
    console.log('serializeArray', $('form').serializeArray());
    var values = $('input[name="name[]"]').map(function(){return $(this).val();}).get();
    console.log('values map', values);
    //console.log('formData', new FormData($('form').getAll));
    return false;
  });

  $('.form-group').on('focus', 'input[id="name"]', function(e) {
    previous = this.value.sluggify();
    console.log('focus value', previous);
  }).on('change', 'input[id="name"]', function(e) {
    // check if the option exists in a select option
    var slug = $(this).val().sluggify();
    var slug_selector = 'select option[value=' + slug + ']';
    var t = $('option[value=' + slug + ']').remove();
    console.log('slug_selector', t);

    $('select.people-dropdown-menu').append($('<option>', {
      value: $(this).val().sluggify(),
      text: $(this).val()
    }));

    console.log('change', previous);

  });

  // $('.form-group').on('focus', 'input[id="name"]', function(e) {
  //   var previous = this.value;
  //   console.log('previous', previous);
  //
  // }).change(function(e){
  //   var slug = $(this).val().sluggify();
  //
  //   // if this is a change, update the value by popping
  //   if (typeof previous != 'undefined') {
  //     var previous_slug = previous.sluggify();
  //
  //     console.log('previous_slug', previous_slug);
  //   }
  // });

  //$('[id="name"]').change(function(e) {
  //// todo: need the validate the previous state to check value

  //var $this = $(this);

  //var slug = $(this).val().sluggify();
  ////
  //console.log('change', slug);
  //});

  $("#add-more").click(function(e){
    e.preventDefault();
    var addto = "#field" + next;
    var addRemove = "#field" + (next);
    next = next + 1;
    var newIn = ' <div id="field'+ next +'" name="field'+ next +'"><!-- Text input--><div class="form-group"> <label class="col-md-4 control-label" for="name">Name</label> <div class="col-md-5"> <input id="name" name="name[]" type="text" placeholder="Name" class="name form-control input-md"> </div></div><br><br> <!-- Text input--><div class="form-group"> <label class="col-md-4 control-label" for="action_name">Action Name</label> <div class="col-md-5"> <input id="action_name" name="action_name" type="text" placeholder="" class="form-control input-md"> </div></div><br><br><!-- File Button --> <div class="form-group"> <label class="col-md-4 control-label" for="action_json">Action JSON File</label> <div class="col-md-4"> <input id="action_json" name="action_json" class="input-file" type="file"> </div></div></div>';
    var newInput = $(newIn);
    var removeBtn = '<button id="remove' + (next - 1) + '" class="btn btn-danger remove-me" >Remove</button></div></div><div id="field">';
    var removeButton = $(removeBtn);
    $(addto).after(newInput);
    $(addRemove).after(removeButton);
    $("#field" + next).attr('data-source',$(addto).attr('data-source'));
    $("#count").val(next);

    $('.remove-me').click(function(e){
      e.preventDefault();
      var fieldNum = this.id.charAt(this.id.length-1);
      var fieldID = "#field" + fieldNum;
      $(this).remove();
      $(fieldID).remove();
    });
  });

});

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
