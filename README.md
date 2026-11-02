# evalinanoel.com

Static portfolio site: plain HTML, CSS and JavaScript. No build step, no backend, no outside font services.

## Files

```
index.html                 home page
about.html / work.html / contact.html   the other pages
assets/css/style.css       all styling (colors, fonts and spacing are variables at the top)
assets/js/main.js          signature intro, scroll effects, film lightbox
assets/fonts/              Young Serif (headlines) and Archivo (body and labels), self-hosted
images/film/               your photos (used in the film strips, hero and polaroid)
images/projects/           project cover images (4:5)
images/en-signature.svg    your "En" signature as a clean vector (cobalt)
favicon.svg                "En" in a cobalt arch
CNAME                      keeps the site at evalinanoel.com (do not delete)
.nojekyll                  tells GitHub Pages to serve files as-is
```

## The signature animation

Your hand-drawn "En" is traced to a vector and lives inline in `index.html` three times (intro, header, contact). An invisible "pen" path inside each one reveals the ink in the order you wrote it. It plays on every page load; click or press any key to skip. Anyone with "reduce motion" turned on skips it automatically.

## Project cards

The six Selected Work cards are solid color blocks with the project name, matching the style you chose. To change a card color, edit the `--c` value in that card's `style` attribute in `index.html`. Every card links to your Behance.

## Changing things

- **Colors:** top of `assets/css/style.css` (`--cobalt`, `--blush`, `--sun`, etc.).
- **Add a film photo:** drop the JPG in `images/film/` and copy one `<figure class="shot ...">` line.
- **Project links:** every card links to your Behance. Swap a card's `href` for a project-specific URL any time.

## Deploying

Upload the contents of this folder to the `main` branch of `evalinanoel/evalinanoel.github.io` (replace everything except keep `CNAME`). The previous site is saved on the `backup-old-site` branch.

## Pages

Home, About, Work and Contact share the same header, footer, styles and script. The signature intro plays on the home page once per visit.

## Contact form

The form on contact.html sends messages to eviegnoel@gmail.com through FormSubmit (formsubmit.co), a free service that needs no account.
**The very first message sends you a one-time "Activate form" email. Click the button in it** and every message after that lands in your inbox.
To change the address, edit the `action` on the `<form>` in contact.html.
