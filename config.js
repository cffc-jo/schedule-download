/* ==========================================================================
   CHICAGO FIRE FC – SCHEDULE CALENDAR PAGE SETTINGS
   --------------------------------------------------------------------------
   This is the ONLY file you need to edit for day-to-day changes.
   - Keep the quotes ' ' around every value.
   - Keep the comma at the end of each line.
   - Lines starting with // are notes and are ignored by the browser.
   ========================================================================== */

window.CF_CONFIG = {

  /* ------------------------------------------------------------------------
     1. TEST MODE
     true  = the page uses the sample calendars in the /test folder (fake
             matches) and shows a "TEST MODE" banner.
     false = the page uses the real calendars you paste in section 2.
     ------------------------------------------------------------------------ */
  TEST_MODE: false,

  // Sample calendars used while TEST_MODE is true. You don't need to change these.
  TEST_CALENDAR_URLS: {
    all:  'https://cffc-jo.github.io/schedule-download/test/sample-all.ics',
    home: 'https://cffc-jo.github.io/schedule-download/test/sample-home.ics',
    away: 'https://cffc-jo.github.io/schedule-download/test/sample-away.ics',
  },

  /* ------------------------------------------------------------------------
     2. THE REAL CALENDARS
     For each calendar, paste the Google Calendar "Public address in iCal
     format" into icalUrl. It looks like:
       https://calendar.google.com/calendar/ical/XXXXXXXX/public/basic.ics
     Every other link (Apple, Google, Outlook, copy link) is built from it.

     name   = the calendar's name when it's added to a fan's calendar app
     label  = the short title on the choice buttons on the page
     detail = the small line under the label
     ------------------------------------------------------------------------ */
  CALENDARS: {
    all: {
      icalUrl: 'https://calendar.google.com/calendar/ical/c45f999fe76e7be2ffc7ef3ef13aed9a0ee5bd938dfe62ab8c3cc915cae1cbaf%40group.calendar.google.com/public/basic.ics',
      name:    'Chicago Fire FC – All Matches',
      label:   'All Matches',
      detail:  'Every match, home and away',
    },
    home: {
      icalUrl: 'https://calendar.google.com/calendar/ical/96ec7f6ad0f8984fe53d34f0ded0fde5358e7f71a14800a762277469e91b48ca%40group.calendar.google.com/public/basic.ics',
      name:    'Chicago Fire FC – Home Matches',
      label:   'Home Matches',
      detail:  'Only matches in Chicago',
    },
    away: {
      icalUrl: 'https://calendar.google.com/calendar/ical/86e232d562be0b2b582d0e3980dd9875a31095a9c7c2e5e6c9c57d0966644ae5%40group.calendar.google.com/public/basic.ics',
      name:    'Chicago Fire FC – Away Matches',
      label:   'Away Matches',
      detail:  'Only road matches',
    },
  },

  /* ------------------------------------------------------------------------
     3. TICKETS BUTTON
     Paste a full link (starting with https://) to show a "Get tickets"
     button at the bottom of the page. Leave as '' to hide it.
     ------------------------------------------------------------------------ */
  TICKETS_URL: '',
  TICKETS_LABEL: 'Get tickets',

  /* ------------------------------------------------------------------------
     4. PAGE TEXT
     {name} is replaced with the fan's first name, if we have it.
     ------------------------------------------------------------------------ */
  TEXT: {
    greetingWithName: 'You’re in, {name}!',
    greetingNoName:   'You’re in!',
    intro:            'Thanks for signing up. Add the Chicago Fire FC schedule to your calendar and every match shows up automatically – including any time changes during the season.',
  },

  /* ------------------------------------------------------------------------
     5. ANALYTICS (OFF BY DEFAULT)
     When ANALYTICS_ENABLED is true, onEvent() runs every time a fan clicks
     a button. To use Google Analytics 4 later: add the GA4 tag to
     index.html, set ANALYTICS_ENABLED to true, and un-comment the gtag line.
     No names, emails, or phone numbers are ever passed to this function.
     ------------------------------------------------------------------------ */
  ANALYTICS_ENABLED: false,
  onEvent: function (eventName, details) {
    // Example for GA4:
    // if (window.gtag) { window.gtag('event', eventName, details); }
  },
};
