/* ==========================================================================
   Chicago Fire FC – schedule calendar page
   Plain JavaScript, no libraries. All settings live in config.js.

   What this file does, in order:
     1. Reads ?feed= from the address, then removes it.
     2. Works out the fan's device (or uses ?device= for previewing).
     3. Builds the calendar links from the iCal addresses in config.js.
     4. Shows the right button(s) and steps for that device.
   ========================================================================== */
(function () {
  'use strict';

  var CONFIG = window.CF_CONFIG || {};
  var FEEDS = ['all', 'home', 'away'];

  var $ = function (id) { return document.getElementById(id); };


  /* ------------------------------------------------------------------------
     1. URL PARAMETERS
     ------------------------------------------------------------------------ */

  var params = new URLSearchParams(window.location.search);

  // "Home Matches", "home", "HOME" -> 'home'. Anything else -> 'all'.
  function cleanFeed(raw) {
    var value = String(raw || '').toLowerCase();
    if (value.indexOf('home') !== -1) return 'home';
    if (value.indexOf('away') !== -1 || value.indexOf('road') !== -1) return 'away';
    return 'all';
  }

  var selectedFeed = cleanFeed(params.get('feed'));
  var forcedDevice = (params.get('device') || '').toLowerCase();

  // Remove feed from the address bar so shared links start clean. Older
  // redirect links may still add ?name=, so that is removed too (it's never
  // shown). ?device= is kept so previews survive a refresh.
  if (params.has('name') || params.has('feed')) {
    params.delete('name');
    params.delete('feed');
    var query = params.toString();
    var cleanUrl = window.location.pathname + (query ? '?' + query : '') + window.location.hash;
    try { window.history.replaceState(null, '', cleanUrl); } catch (e) { /* ignore */ }
  }


  /* ------------------------------------------------------------------------
     2. DEVICE DETECTION
     Returns { os: 'ios'|'android'|'mac'|'windows'|'other', inApp: true|false }
     If anything goes wrong we fall back to 'other', which shows every option.
     ------------------------------------------------------------------------ */

  function detectDevice() {
    var result = { os: 'other', inApp: false };
    try {
      var ua = navigator.userAgent || '';
      var touchPoints = navigator.maxTouchPoints || 0;

      if (/iPhone|iPad|iPod/i.test(ua)) result.os = 'ios';
      // iPads (iPadOS 13+) pretend to be a Mac – but Macs don't have touch screens.
      else if (/Macintosh/i.test(ua) && touchPoints > 1) result.os = 'ios';
      else if (/Android/i.test(ua)) result.os = 'android';
      else if (/Macintosh|Mac OS X/i.test(ua)) result.os = 'mac';
      else if (/Windows/i.test(ua)) result.os = 'windows';

      // Browsers built into social apps
      result.inApp = /Instagram|FBAN|FBAV|FB_IAB|FBIOS|Messenger|musical_ly|TikTok|Bytedance|Twitter|LinkedInApp|Snapchat/i.test(ua);
    } catch (e) {
      result = { os: 'other', inApp: false };
    }

    // Preview override: ?device=ios|android|mac|windows|other|inapp
    if (['ios', 'android', 'mac', 'windows', 'other'].indexOf(forcedDevice) !== -1) {
      result = { os: forcedDevice, inApp: false };
    } else if (forcedDevice === 'inapp') {
      result.inApp = true;
    }
    return result;
  }

  var device = detectDevice();


  /* ------------------------------------------------------------------------
     3. CALENDAR LINKS
     Everything is built from one https iCal address per calendar.
     ------------------------------------------------------------------------ */

  function getCalendar(feed) {
    var cal = (CONFIG.CALENDARS && CONFIG.CALENDARS[feed]) || {};
    var url = CONFIG.TEST_MODE
      ? (CONFIG.TEST_CALENDAR_URLS || {})[feed]
      : cal.icalUrl;
    return {
      url: String(url || '').trim(),
      name: cal.name || 'Chicago Fire FC',
      label: cal.label || feed,
    };
  }

  function isValidIcalUrl(url) {
    return /^https:\/\/\S+$/i.test(url);
  }

  function buildLinks(feed) {
    var cal = getCalendar(feed);
    var https = cal.url;
    var webcal = https.replace(/^https:\/\//i, 'webcal://');
    var enc = encodeURIComponent;
    return {
      valid: isValidIcalUrl(https),
      apple:   webcal,
      google:  'https://calendar.google.com/calendar/render?cid=' + enc(webcal),
      outlook: 'https://outlook.live.com/calendar/0/addfromweb?url=' + enc(https) + '&name=' + enc(cal.name),
      office:  'https://outlook.office.com/calendar/0/addfromweb?url=' + enc(https) + '&name=' + enc(cal.name),
      copy:    https,
    };
  }


  /* ------------------------------------------------------------------------
     Small helpers
     ------------------------------------------------------------------------ */

  // Create an element. Text is always set with textContent (never innerHTML).
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (key) {
      if (key === 'text') node.textContent = attrs[key];
      else if (key === 'className') node.className = attrs[key];
      else node.setAttribute(key, attrs[key]);
    });
    (children || []).forEach(function (child) {
      node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
    });
    return node;
  }

  // Optional analytics hook – off unless ANALYTICS_ENABLED is true in config.js.
  function track(eventName, details) {
    if (!CONFIG.ANALYTICS_ENABLED || typeof CONFIG.onEvent !== 'function') return;
    try {
      CONFIG.onEvent(eventName, Object.assign({ feed: selectedFeed, device: device.os }, details || {}));
    } catch (e) { /* never let analytics break the page */ }
  }

  function announce(status, message) {
    status.textContent = '';
    // Small delay so screen readers notice repeat messages.
    setTimeout(function () { status.textContent = message; }, 50);
  }

  // Copy text to the clipboard, with an older fallback for some browsers.
  // If copying is blocked, the link is shown in `field` so it can be copied by hand.
  // The button briefly says "Copied!". `status` is a hidden spot that tells
  // screen-reader users the same thing.
  function copyText(text, button, field, status) {
    function done(ok) {
      var original = button.dataset.label || button.textContent;
      button.dataset.label = original;
      button.textContent = ok ? 'Copied!' : 'Copy the link below';
      announce(status, ok ? 'Link copied' : 'Could not copy automatically. Press and hold the link to copy it.');
      setTimeout(function () {
        button.textContent = original;
        status.textContent = '';
      }, 2500);
      if (!ok) {
        field.value = text;
        field.hidden = false;
        field.focus();
        field.select();
      }
    }
    function fallback() {
      var area = el('textarea', { readonly: '', 'aria-hidden': 'true' });
      area.value = text;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(area);
      done(ok);
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, fallback);
    } else {
      fallback();
    }
  }


  /* ------------------------------------------------------------------------
     4. BUILD THE PAGE
     ------------------------------------------------------------------------ */

  function renderHeader() {
    var text = CONFIG.TEXT || {};
    if (text.preheader) $('preheader').textContent = text.preheader;
    if (text.heading) $('heading').textContent = text.heading;
  }

  function renderFeedOptions() {
    var container = $('feed-options');
    FEEDS.forEach(function (feed) {
      var cal = getCalendar(feed);
      var input = el('input', { type: 'radio', name: 'feed', value: feed, id: 'feed-' + feed });
      input.checked = feed === selectedFeed;
      input.addEventListener('change', function () {
        selectedFeed = feed;
        updateLinks();
        track('feed_change');
      });
      var label = el('label', { className: 'feed-option', 'for': 'feed-' + feed }, [
        input,
        el('span', { text: cal.label }),
      ]);
      container.appendChild(label);
    });
  }

  // A big link button. href is filled in by updateLinks().
  function linkButton(text, method, className) {
    var attrs = { className: 'btn ' + className, href: '#', 'data-method': method };
    if (method !== 'apple') { attrs.target = '_blank'; attrs.rel = 'noopener'; }
    return el('a', attrs, [text]);
  }

  function stepsList(items) {
    return el('ol', { className: 'steps' }, items.map(function (item) {
      return el('li', { text: item });
    }));
  }

  // The main button(s) + steps for this device.
  function renderPrimary() {
    var area = $('primary-area');

    if (device.os === 'ios') {
      area.appendChild(linkButton('Add to Calendar', 'apple', 'btn-primary'));
      area.appendChild(stepsList([
        'Tap the button above',
        'Tap “Subscribe”',
        'Tap “Done”',
      ]));
      area.appendChild(el('p', { className: 'hint', text: 'This adds it to Apple Calendar. Use Google or Outlook instead? See “Other Devices and Calendars” below.' }));

    } else if (device.os === 'mac') {
      area.appendChild(el('div', { className: 'btn-row two' }, [
        linkButton('Apple Calendar', 'apple', 'btn-primary'),
        linkButton('Outlook', 'outlook', 'btn-primary'),
      ]));
      area.appendChild(stepsList([
        'Select your preferred calendar',
        'Apple Calendar: click “Subscribe,” then “OK”',
        'Outlook: sign in if asked, then click “Add” or “Import”',
      ]));
      area.appendChild(el('p', { className: 'hint', text: 'Using Google Calendar or Outlook for work or school? Select it under “Other Devices and Calendars” below.' }));

    } else if (device.os === 'android') {
      area.appendChild(linkButton('Add to Calendar', 'google', 'btn-primary'));
      area.appendChild(stepsList([
        'Tap the button above',
        'Tap “Add” (sign in to Google if it asks)',
      ]));
      area.appendChild(el('p', { className: 'hint', text: 'Not showing up? Open your calendar app’s settings, select the Chicago Fire calendar, and turn on Sync.' }));

    } else if (device.os === 'windows') {
      area.appendChild(el('div', { className: 'btn-row two' }, [
        linkButton('Outlook', 'outlook', 'btn-primary'),
        linkButton('Google Calendar', 'google', 'btn-primary'),
      ]));
      area.appendChild(stepsList([
        'Select your preferred calendar',
        'Sign in if asked, then click “Add” or “Import”',
      ]));
      area.appendChild(el('p', { className: 'hint', text: 'Using Outlook for work or school? Select it under “Other Devices and Calendars” below.' }));

    } else {
      // Unknown device: show every option straight away.
      area.appendChild(el('p', { className: 'intro', text: 'Choose the calendar app you use below.' }));
      setOtherOpen(true);
    }
  }

  // Fill in every link on the page for the selected calendar.
  function updateLinks() {
    var links = buildLinks(selectedFeed);
    var error = $('config-error');

    if (!links.valid) {
      error.textContent = 'This calendar link hasn’t been set up yet. (Site admin: add the iCal address in config.js.)';
      error.hidden = false;
    } else {
      error.hidden = true;
    }

    document.querySelectorAll('[data-method]').forEach(function (link) {
      if (links.valid) {
        link.href = links[link.dataset.method];
        link.removeAttribute('aria-disabled');
      } else {
        link.removeAttribute('href');
        link.setAttribute('aria-disabled', 'true');
      }
    });
    $('calendar-link').value = links.valid ? links.copy : '';
    $('copy-cal-btn').disabled = !links.valid;
  }

  function setOtherOpen(open) {
    $('other-toggle').setAttribute('aria-expanded', open ? 'true' : 'false');
    $('other-panel').hidden = !open;
  }

  function wireUpEvents() {
    // Calendar buttons (one listener for all of them)
    document.addEventListener('click', function (event) {
      var link = event.target.closest('[data-method]');
      if (link && link.hasAttribute('href')) track('subscribe_click', { method: link.dataset.method });
    });

    $('other-toggle').addEventListener('click', function () {
      var open = $('other-toggle').getAttribute('aria-expanded') !== 'true';
      setOtherOpen(open);
      if (open) track('other_options_open');
    });

    $('copy-cal-btn').addEventListener('click', function () {
      copyText($('calendar-link').value, this, $('calendar-link'), $('cal-copy-status'));
      track('copy_calendar_link');
    });

    $('calendar-link').addEventListener('focus', function () { this.select(); });
    $('page-link').addEventListener('focus', function () { this.select(); });

    // Page link for in-app browsers – includes the chosen feed, never the name.
    $('copy-page-btn').addEventListener('click', function () {
      var url = new URL(window.location.href);
      url.search = '';
      url.hash = '';
      url.searchParams.set('feed', selectedFeed);
      copyText(url.toString(), this, $('page-link'), $('page-copy-status'));
      track('copy_page_link');
    });
  }

  function renderExtras() {
    $('test-banner').hidden = !CONFIG.TEST_MODE;

    // Inside apps like Instagram, show only the "open in your browser" page.
    if (device.inApp) {
      $('inapp-page').hidden = false;
      $('schedule-page').hidden = true;
      // Android apps use vertical dots (⋮); iPhone apps use horizontal dots (⋯).
      var dots = device.os === 'android' ? '⋮' : '⋯';
      $('inapp-steps').textContent = 'For the best experience, open this page in your browser by tapping the ' + dots +
        ' in the top or bottom corner of your screen and clicking “Open in Browser”';
    }

    var tickets = $('tickets-btn');
    if (CONFIG.TICKETS_URL && /^https?:\/\//i.test(CONFIG.TICKETS_URL)) {
      tickets.href = CONFIG.TICKETS_URL;
      tickets.textContent = CONFIG.TICKETS_LABEL || 'Get tickets';
      tickets.hidden = false;
      tickets.addEventListener('click', function () { track('tickets_click'); });
    }
  }

  // Run everything. If something unexpected breaks, show all options.
  try {
    renderHeader();
    renderFeedOptions();
    renderPrimary();
    renderExtras();
    wireUpEvents();
    updateLinks();
  } catch (e) {
    setOtherOpen(true);
    if (window.console) console.error(e);
  }
})();
