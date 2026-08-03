# Yellow-duke — Portfolio Site

A static site (no build step, no dependencies) — just `index.html`, `style.css`, `script.js`.

## 1. Add your photo
Drop a portrait image into `assets/portrait.png` (or update the `src` in `index.html` under
`.hero__portrait`). Until you do, the hero shows a clean placeholder instead of a broken image.

## 2. Link your real repos
Each Python project card currently links to your GitHub profile
(`https://github.com/56-Yellowduke`). Swap in the direct repo URL for each project
(e.g. `https://github.com/56-Yellowduke/student-management-system`) once you confirm the exact
repo names — this makes each "View on GitHub" link take a recruiter straight to that project's code.

## 3. Host it for free — pick one

**GitHub Pages (recommended, free, your own GitHub in the URL):**
1. Create a new repo on GitHub (e.g. `portfolio`).
2. Upload these three files (`index.html`, `style.css`, `script.js`) and the `assets` folder.
3. Repo → Settings → Pages → Source: `main` branch, `/ (root)` → Save.
4. Your site is live at `https://56-yellowduke.github.io/portfolio/` within a minute or two.

**Netlify (drag-and-drop, no GitHub account needed):**
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag this whole folder onto the page.
3. You get a live URL instantly (e.g. `random-name.netlify.app`) — rename it in site settings.

Either way, that link is what you send to employers — not the Figma file.

## What's already done
- Full site built from your Figma design: hero, About Me, Projects (Design + Python), Contact.
- All 5 Python projects included, plus Plan Ahead and Opay Redesign.
- Staggered fade/slide-in animation on scroll (matches the entrance animation from Figma), and it's
  disabled automatically for anyone with reduced-motion turned on.
- Mobile-responsive nav and layout.
- Your real contact info (email, phone, GitHub) wired up as clickable links.
