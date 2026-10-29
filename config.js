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

     name  = the calendar's name when it's added to a fan's calendar app
     label = the text on the All / Home / Away buttons on the page
     ------------------------------------------------------------------------ */
  CALENDARS: {
    all: {
      icalUrl: 'https://calendar.google.com/calendar/ical/16de724f01ddf9927b3b8200318361a557a9dc8593e1bce8d0b1a2c8d2155977%40group.calendar.google.com/public/basic.ics',
      name:    'Chicago Fire FC – All Matches',
      label:   'All',
    },
    home: {
      icalUrl: 'https://calendar.google.com/calendar/ical/e887ca276780d2826b37e116d840fd0a767e0cf593bf01101e3d94ca58930eb8%40group.calendar.google.com/public/basic.ics',
      name:    'Chicago Fire FC – Home Matches',
      label:   'Home',
    },
    away: {
      icalUrl: 'https://calendar.google.com/calendar/ical/7eb2d4771f8bee6c72947bc701f074e3a2c4cb89c2ad36ee2695c0eb906bc128%40group.calendar.google.com/public/basic.ics',
      name:    'Chicago Fire FC – Away Matches',
      label:   'Away',
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
     preheader = the small line above the main heading
     heading   = the main heading at the top of the page
     ------------------------------------------------------------------------ */
  TEXT: {
    preheader: 'Chicago Fire FC',
    heading:   'Sync the 2027 Schedule',
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
