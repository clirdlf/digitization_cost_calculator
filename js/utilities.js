var dlf = [
' _____   _       _______',
'(____ \\ | |     (_______)',
' _   \\ \\| |      _____',
'| |   | | |     |  ___)',
'| |__/ /| |_____| |',
'|_____/ |_______)_|'
].join('\n');

console.log(dlf);

/** Simple spam protection for email addresses using jQuery.
 * Well, the protection isn’t jQuery-based, but you get the idea.
 * This snippet allows you to slightly ‘obfuscate’ email addresses to make it harder for spambots to harvest them, while still offering a readable address to your visitors.
 * E.g.
 * <a href="mailto:foo(at)example(dot)com">foo at example dot com</a>
 * →
 * <a href="mailto:foo@example.com">foo@example.com</a>
 */
 $('a[href^="mailto:"]').each(function() {
   this.href = this.href.replace('(at)', '@').replace(/\(dot\)/g, '.');
   // Remove this line if you don't want to set the email address as link text:
   this.innerHTML = this.href.replace('mailto:', '');
 });

// @see http://stackoverflow.com/questions/45888/what-is-the-most-efficient-way-to-sort-an-html-selects-options-by-value-while
// TODO: only sort things that have value in the select box; may be better to do in the Rakefile...
$.fn.sort_select_box = function(){
  // Get options from select box
  var my_options = $("#" + this.attr('id') + ' option');
  // sort alphabetically
  my_options.sort(function(a,b) {
    if (a.text > b.text) return 1;
    else if (a.text < b.text) return -1;
    else return 0;
  });
  //replace with sorted my_options;
  $(this).empty().append( my_options );

  // clearing any selections
  $("#"+this.attr('id')+" option").attr('selected', false);
};

// Estimates minutes in hours (returns an int)
function minutes_in_hours(m) {
  return Math.floor(m / 60);
}

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

// @see http://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript
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
