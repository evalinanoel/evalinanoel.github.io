# evalinanoel.com

Static portfolio site — plain HTML, CSS and a few lines of JavaScript. No build step, no backend.

## Files

```
index.html              the whole site
assets/css/style.css    all styling (colors and spacing are variables at the top)
assets/js/main.js       image placeholders + footer year
images/projects/        put project images here
favicon.svg             "EN" tab icon
CNAME                   tells GitHub Pages to serve at evalinanoel.com
.nojekyll               tells GitHub Pages to serve files as-is
```

## Adding project images

Save each image into `images/projects/` with these exact names (4:5 portrait, about 1600×2000px, JPG):

| Project | File name |
|---|---|
| The Alchemist | `the-alchemist.jpg` |
| Ollie's Pizza | `ollies-pizza.jpg` |
| Aperture Film Festival | `aperture-film-festival.jpg` |
| Heritage Hats | `heritage-hats.jpg` |
| Valley Metro | `valley-metro.jpg` |
| Triple B | `triple-b.jpg` |

The grey placeholder disappears on its own once the file is there. Compress images first (e.g. squoosh.app, aim for under 500 KB each).

## Things to edit before going live

1. **Email** — in `index.html`, search for `hello@evalinanoel.com` and replace both instances (the `mailto:` link and the visible text).
2. **Triple B discipline** — search for `Discipline to come` and replace it; then remove `project__type--todo` from that line so it stops displaying in italics.
3. **About text** — the paragraph under `<!-- 3. About -->` is a starting draft.

## Deploying to GitHub Pages (existing repo)

Your site is already on GitHub Pages with the custom domain. Replacing the site means:

- **Will be replaced:** `index.html` and any existing file at the same path as a file here.
- **Will be added:** `assets/`, `images/projects/`, `favicon.svg`, `.nojekyll`, `README.md`.
- **CNAME:** this package includes one containing `evalinanoel.com`. If your repo already has a `CNAME` with that same value, it's identical — keep either. **Do not delete CNAME**, or the custom domain will disconnect.
- **Old files** (previous CSS, images, other pages) are not touched — they stay in the repo until you delete them. They won't show on the new homepage, but old URLs to them will still work.

### Step 1 — Back up the current site
On GitHub, open your repo → branch dropdown (usually says `main`) → type `backup-old-site` → **Create branch**. Your current site is now saved and can be restored any time.

### Step 2 — Upload the new files

**In the browser (easiest):**
1. On the `main` branch, click **Add file → Upload files**.
2. Unzip the package and drag in **the contents** of the folder (index.html, assets, images, CNAME, favicon.svg, README.md) — not the folder itself.
3. `.nojekyll` is a hidden file; if your system hides it, create it on GitHub instead: **Add file → Create new file**, name it `.nojekyll`, leave it empty, commit.
4. Commit message: `New portfolio site` → **Commit changes**.

**With git:**
```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
# copy everything from this package into the repo folder (overwrite index.html)
git add -A
git commit -m "New portfolio site"
git push
```

### Step 3 — Check Pages settings
Repo → **Settings → Pages**:
- Source: **Deploy from a branch**, branch `main`, folder `/ (root)`.
- Custom domain: `evalinanoel.com` (should already be filled in).
- **Enforce HTTPS**: checked.

Wait 1–2 minutes, then open https://evalinanoel.com (hard-refresh with Cmd/Ctrl + Shift + R).

### DNS (only if the domain isn't already working)
Your Namecheap DNS should already be set. For reference, GitHub Pages needs:
- `A` records for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- `CNAME` record for `www` → `<your-username>.github.io`

### Restoring the old site
Switch Pages to the `backup-old-site` branch in Settings → Pages, or copy its files back to `main`.

## Previewing locally
Open `index.html` directly in a browser, or for an exact preview run `python3 -m http.server` in this folder and visit http://localhost:8000.
