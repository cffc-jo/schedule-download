# Chicago Fire FC – Schedule Calendar Page

A one-page website that helps fans add the Chicago Fire FC match schedule to
their phone or computer calendar. Fans land here automatically after they
submit our Jotform sign-up form.

- **Live page:** https://cffc-jo.github.io/schedule-download/
- **This page collects no data.** Jotform handles the form. There are no
  cookies, trackers, or outside services.
- Fans **subscribe** to the calendar (they don't download a one-time file), so
  when a match time changes mid-season, it updates in their calendar on its own.

### What's in this folder

| File | What it is | Do you edit it? |
|---|---|---|
| `config.js` | All settings: calendar links, test mode, text, tickets link | **Yes – this is the main one** |
| `colors.css` | Brand colors and where each one is used | Colors only |
| `fonts.css` | MLS Tifo font setup (files in `assets/fonts/`) | Rarely |
| `styles.css` | Layout and look of the page | Rarely |
| `assets/` | Official logo (`logo.png`) and browser icon (`favicon.png`) | Only to replace them |
| `index.html` | The page layout | Rarely |
| `app.js` | The page's logic (device detection, building links) | No |
| `test/` | Three sample calendars with fake matches, for testing | No |

**How to edit a file on GitHub:** open the file on github.com, click the
pencil icon (✏️), make your change, then click **Commit changes**. The live
page updates within a few minutes. (Your browser may keep the old version for
up to 10 minutes – refresh, or open the page in a private window.)

---

## 1. Turn on GitHub Pages

1. On github.com, open this repository: https://github.com/cffc-jo/schedule-download
2. Click **Settings** (top menu) → **Pages** (left menu).
3. Under **Build and deployment** → **Source**, choose **Deploy from a branch**.
4. Under **Branch**, choose **main** and **/ (root)**, then click **Save**.
5. Wait 1–2 minutes, then open https://cffc-jo.github.io/schedule-download/
   You should see the page with a black **TEST MODE** bar at the top.
6. Also check that this sample calendar opens (your browser may download it –
   that's fine): https://cffc-jo.github.io/schedule-download/test/sample-all.ics

---

## 2. Set up the Jotform redirect (this form only)

This setting belongs to one form, so it won't affect any of your other forms.

1. In Jotform, open the sign-up form in the **Form Builder**.
2. Click the **Settings** tab at the top → **Thank You Page** on the left.
3. Choose **Redirect to an external link**.
4. Paste this address:

   ```
   https://cffc-jo.github.io/schedule-download/?feed={whichMatches}
   ```

5. Replace `{whichMatches}` with the real field name of your "which matches"
   question (see below). Keep the curly braces `{ }`.
6. Click **Save** (or **Update**).

If your form doesn't ask which matches, you can use just
`https://cffc-jo.github.io/schedule-download/` – the page then starts on **All**.

### Finding the field's "unique name"

Every Jotform field has a unique name, which Jotform uses as the placeholder.

1. In the Form Builder (**Build** tab), click the "which matches" question.
2. Click the **gear icon** (Properties) next to it.
3. Open the **Advanced** tab and look for **Unique Name** (under Field Details).
   It looks like `whichMatches` or `input5`.

Tip: the redirect box may also have a **Form Fields** button that inserts a
field for you.

### What the page does with this value

- **feed** – pre-selects All, Home or Away. It's matched loosely, so answers
  like `Home Matches`, `home`, or `HOME` work. Anything containing "home" picks
  Home, anything containing "away" picks Away, and everything else picks All.
  So your Jotform answer options can be worded however you like, as long as
  the Home and Away options include those words.
- It's removed from the address bar right away, so links fans share start clean.
- The page doesn't use the fan's name. If an older redirect link still adds
  `?name=`, the page ignores it and removes it from the address bar.
- **Never** add email or phone fields to the redirect address. The page
  ignores them, but they would still appear briefly in the address.

---

## 3. Switch to the real calendars

Do this once for each of the three Google Calendars (All, Home, Away).

### Find the calendar's public iCal address

1. On a **computer**, open [Google Calendar](https://calendar.google.com)
   signed in to the account that owns the calendar.
2. Click the **gear icon** (top right) → **Settings**.
3. On the left, under **Settings for my calendars**, click the calendar.
4. Under **Access permissions for events**, tick **Make available to public**
   and make sure it says **See all event details**. (Without this, fans get an
   empty calendar.)
5. Scroll down to **Integrate calendar**. Copy the
   **Public address in iCal format**. It looks like:
   `https://calendar.google.com/calendar/ical/xxxxxxxx/public/basic.ics`

   ⚠️ Use the **public** address, *not* the "Secret address in iCal format".

### Paste it into config.js

1. Open `config.js` and find section **2. THE REAL CALENDARS**.
2. Replace `PASTE_ALL_MATCHES_ICAL_URL_HERE` with the All Matches address,
   and do the same for Home and Away. Keep the quotes around it, e.g.:

   ```js
   icalUrl: 'https://calendar.google.com/calendar/ical/xxxxxxxx/public/basic.ics',
   ```

3. In section **1. TEST MODE**, change `TEST_MODE: true,` to `TEST_MODE: false,`
4. Commit the change. The TEST MODE bar disappears and the buttons now add the
   real calendars. (If a calendar link is missing or mistyped, the page shows
   a red "hasn't been set up yet" message instead of a broken button.)

### How fast do changes reach fans?

When you change a match in Google Calendar, fans' calendars update on their own,
but **not instantly**:

- **Apple Calendar** (iPhone, iPad, Mac) usually updates within an hour or so.
- **Google Calendar** and **Outlook** can take **several hours, up to a day**.
  This is controlled by Google and Microsoft and can't be sped up from our side.

Fans who subscribed during test mode keep the *test* calendar. Remove the test
subscription from your own devices once you switch over.

---

## 4. Change the colors, logo, text, and tickets link

**Colors** – open `colors.css`. It has two parts:

1. **Brand palette** – the official Chicago Fire FC colors (Fire Red, Red,
   Navy, Flag Blue, etc.).
2. **Where each color is used** – for example:

```css
--cf-primary: var(--red);   /* main buttons, headings */
--cf-accent:  var(--navy);  /* "Get tickets" button, selected choice */
```

To restyle the page, change Part 2, e.g. swap `var(--red)` for another brand
color. Buttons use white text on `--cf-primary` and `--cf-accent`, so those
need a contrast ratio of at least **4.5:1** against white – check at
https://webaim.org/resources/contrastchecker/. That's why bright Fire Red
(`#FF0000`, only 4.0:1) is used just for the thin stripe at the top, and the
buttons use the deeper Red (`#AA0000`).

**Logo** – the official crest is at `assets/logo.png` (512×512, transparent
background). To replace it, upload a new file with the same name: on GitHub,
open the `assets` folder → **Add file** → **Upload files**. If `logo.png` is
ever missing, the page tries `logo.svg`, then shows the text
"Chicago Fire FC" in its place.

**Favicon** – the browser-tab and home-screen icon is `assets/favicon.png`
(the crest at 192×192).

**Fonts** – the page uses MLS Tifo, served from `assets/fonts/` (WOFF2, a
compact web format). Only three styles are loaded to keep it fast: Tifo
Headline Bold (headings), Tifo Standard Regular (body text) and Tifo Standard
Bold (buttons and labels). They're set up in `fonts.css`. To add another
style (e.g. Medium), convert the `.otf` to `.woff2`, put it in
`assets/fonts/`, and copy one of the `@font-face` blocks in `fonts.css`.

**Link preview** (optional) – add `assets/og-image.png` (1200×630), shown
when the page link is shared in a message.

**Text** – in `config.js`:
- Section 4 (**PAGE TEXT**): the small line at the top ("Chicago Fire FC")
  and the main heading ("2026 Schedule"). Update the year each season.
- Section 2: each calendar's `name` (what it's called in the fan's calendar
  app), `label` and `detail` (the choice buttons on the page).

**Tickets button** – in `config.js` section 3, paste a full link:

```js
TICKETS_URL: 'https://www.chicagofirefc.com/tickets',
```

Leave it as `''` to hide the button.

**Analytics** (optional, off by default) – `config.js` section 5 has a hook
that runs on every button click (`subscribe_click`, `copy_calendar_link`,
`tickets_click`, etc.). To use GA4 later, add the GA4 tag to `index.html`, set
`ANALYTICS_ENABLED: true`, and un-comment the `gtag` line. No names or contact
details are ever sent.

---

## 5. Testing checklist

**Preview any device from your laptop** by adding `?device=` to the address:

| Preview | Address |
|---|---|
| iPhone / iPad | https://cffc-jo.github.io/schedule-download/?device=ios |
| Android | https://cffc-jo.github.io/schedule-download/?device=android |
| Mac | https://cffc-jo.github.io/schedule-download/?device=mac |
| Windows | https://cffc-jo.github.io/schedule-download/?device=windows |
| Unknown device | https://cffc-jo.github.io/schedule-download/?device=other |
| Instagram/Facebook app | https://cffc-jo.github.io/schedule-download/?device=inapp |

Then test **for real** on each device, going through the actual Jotform form
so the redirect is tested too. For each one, confirm the TEST matches appear
in the calendar app (November and early December 2026, titled
"TEST – …").

- [ ] **iPhone, Safari:** "Add to my calendar" → Subscribe → Done. Matches
      appear in the Calendar app.
- [ ] **Android, Chrome:** "Add to my calendar" → Add. Matches appear at
      calendar.google.com right away. If they're missing from the phone's
      Calendar app: Calendar app → Settings → tap the calendar → turn on Sync.
- [ ] **Mac, Safari or Chrome:** "Add to my calendar" opens Apple Calendar →
      Subscribe.
- [ ] **Windows – Outlook:** click Outlook → sign in → Import/Add.
- [ ] **Windows – Google Calendar:** click Google Calendar → Add.
- [ ] **Work Outlook:** "Other devices / calendars" → Outlook for work or school.
- [ ] **Instagram in-app browser:** DM yourself the form link and open it
      inside Instagram. The yellow "open this page in your browser" box
      appears at the top. "Copy page link" works.
- [ ] **"Copy calendar link":** paste the copied link somewhere – it should be
      the `.ics` address.
- [ ] **Feed values:** submit once with each answer (All / Home / Away) and
      check the right option is pre-selected. Subscribe to Home and Away and
      check each only has its own matches.
- [ ] **Address bar:** after the page loads, the feed value is gone from
      the address.
- [ ] **After going live:** repeat a quick iPhone + Android test with
      `TEST_MODE: false`.

---

## How the links are built (for reference)

From each calendar's https iCal address, `app.js` builds:

| Option | Link |
|---|---|
| Apple | the same address with `https://` changed to `webcal://` |
| Google Calendar | `https://calendar.google.com/calendar/render?cid=` + webcal address (encoded) |
| Outlook.com | `https://outlook.live.com/calendar/0/addfromweb?url=` + https address + `&name=` + calendar name |
| Microsoft 365 | `https://outlook.office.com/calendar/0/addfromweb?url=` + https address + `&name=` + calendar name |
| Copy link | the https address |
