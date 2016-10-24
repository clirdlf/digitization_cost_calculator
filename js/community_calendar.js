(function($) {
  'use strict';

  $(document).ready(function() {
    var CALENDAR_ID = 'g2hval0pee3rmrv4f3n9hp9cok@group.calendar.google.com';
    var API_KEY     = 'AIzaSyA5W2MDJs9uknQv6Cn4OZ07K-wtvkoqYwE';

    // see https://developers.google.com/google-apps/calendar/v3/reference/events/list#parameters
    var extra_params = {
      timeMin: moment().format(),
      key: API_KEY,
      // maxResults: 2
    };

    var cal_url = 'https://www.googleapis.com/calendar/v3/calendars/';
    cal_url += CALENDAR_ID + '/events?';
    cal_url += $.param(extra_params);

    // console.log(cal_url);

    formatGoogleCalendar.init({
      calendarUrl: cal_url,
      past: false,
      upcoming: true,
      sameDayTimes: true,
      upcomingTopN: 2,
      itemsTagName: 'li',
      upcomingSelector: '#upcoming-events',
      upcomingHeading: '',
      format: ['<p>', '*summary*', '</p><p>', '*date*', ' </p> ']
    });
  });
})(jQuery);
