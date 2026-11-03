# Bicycle Kitchen / La Bici-Cocina website

New website for bicyclekitchen.org, a volunteer-run nonprofit bike co-op at
4429 Fountain Ave, Los Angeles. It replaces a slow WordPress/Elementor site
that volunteers found too hard to update. The people maintaining it are
volunteers, not developers, so simplicity beats cleverness everywhere.

## Source of truth for the design

`design/*.dc.html` are approved design mockups made on a design canvas. They
use a template syntax (`{{holes}}`, `<sc-if>`, `<sc-for>`, a `DCLogic` class).
Treat them as the visual and content reference: match their layout, copy,
colors, type, spacing, and links closely, but rebuild them as a real site.
Do not ship the `.dc.html` files or their runtime.

| Design file              | Page                                   | URL                 |
|--------------------------|----------------------------------------|---------------------|
| Main.dc.html             | Home                                   | /                   |
| Hours.dc.html            | Hours                                  | /hours              |
| LearnRepair.dc.html      | Learn to repair                        | /learn-to-repair    |
| ProjectBikes.dc.html     | Project bikes                          | /project-bikes      |
| About.dc.html            | Our mission + Who we are (#who)        | /about              |
| CoOps.dc.html            | Other LA Co-Ops                        | /other-la-co-ops    |
| Supporters.dc.html       | Supporters                             | /supporters         |
| Volunteer.dc.html        | Volunteer                              | /volunteer          |
| Donate.dc.html           | Donate (#other = bikes and parts)      | /donate             |

Links between mockups (`Main.dc.html#x`, `Donate.dc.html#other`) map to the
URLs above.

## Stack

- Astro, static output. No client framework unless something truly needs it;
  a few lines of vanilla JS for the menus and the wheel animation is plenty.
- Hosted on Netlify (or Cloudflare Pages), deployed from GitHub on every push.
- Pages CMS (pagescms.org) as the editing dashboard for volunteers, via a
  `.pages.yml` config. Editable content lives in `src/content/` as YAML or
  Markdown so both volunteers (through Pages CMS) and Claude can edit it.
- Images go through Astro's image pipeline (resized, WebP/AVIF, lazy-loaded).

## What volunteers must be able to edit without code (via Pages CMS)

1. Alert banner: an on/off switch plus a message. One setting controls the
   banner on every page. Default message: "We’re closed tonight because of
   volunteer shortages. Open during our next Open Shop hours." followed by a
   "Call (323) 662-2776" tel link.
2. Weekly hours (day, time, optional note). Thursday 6–9 pm carries the note
   "FTWNB night: femme, trans, women and non-binary folks".
3. Photos: replace any placeholder photo slot with an uploaded image + alt text.
4. Supporters list (neighborhood councils, individuals, grants).
5. Contact info and donation links in one site settings file.

## Site-wide pieces

- Header: logo top-left (`assets/bk-logo.svg`, keep the SVG), then
  Bike Repair ▾ (Learn to repair, Project bikes), Hours, About ▾ (Our mission,
  Who we are, Other LA Co-Ops, Supporters), Get Involved ▾ (Donate, Donate
  bikes and parts, Volunteer), Instagram icon (@bicicocina), red Donate button.
  Menu text 24px.
- Dropdowns: open on click, close on outside click and on Escape, keyboard
  accessible (aria-expanded, focus management).
- Phones: collapse the menu behind a ☰ button that opens the full list.
- Highlight the current page's menu item/group.
- Breadcrumbs on every subpage, footer repeats the menu (no newsletter).
- The wheel "periods" after Fun / Safe / Accessible and after each subpage
  title roll in once on page load, then stay still. Respect
  prefers-reduced-motion.

## Look

- Background / primary: #D6CEC1 (stone). Alternate sections: #ECE7DE.
- Ink: #221F20. Accent red (from the logo): #A63A22 for buttons and the alert.
- Headings: Zilla Slab 600/700. Body: Work Sans 400/600. Self-host the fonts.
- Keep WCAG AA contrast, real alt text, visible focus styles, 44px tap targets.

## Contact and links

- Phone (323) 662-2776, shown as "During Open Hours" where noted in the design
- Email kitchen@bicyclekitchen.com (confirm .com vs .org with the user)
- Instagram https://www.instagram.com/bicicocina/
- PayPal https://www.paypal.com/paypalme/bicyclekitchen
- Venmo https://www.venmo.com/u/BicycleKitchen
- Zeffy https://www.zeffy.com/en-US/donation-form/donate-to-bicycle-kitchen

## Moving off WordPress

- Add redirects (Netlify `_redirects`) from old URLs so links and search
  results keep working, at least: /about-us/ → /about,
  /support-us/donate/ → /donate, /support-us/volunteer/ → /volunteer,
  /available-project-bikes/ → /project-bikes, /subscribe/ → /.
- Do not change DNS or email records. The user will handle the domain switch
  separately, after the site is reviewed on its Netlify preview URL.

## Working style

The user is not a developer. Explain what you are about to do in plain
language, work in small steps, run the site locally so they can preview it,
and ask before anything that touches accounts, deployment, or the domain.
