<<<<<<< HEAD
# Ireland Trip 2026 — Our Adventure

A React site (the flip-book storybook + boarding-pass countdown) ready to deploy on GitHub Pages.

## 1. Push it to GitHub

```bash
cd ireland-trip-site
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

(Create the empty repo on GitHub first — github.com → New repository — then use its URL above.)

## 2. Turn on GitHub Pages

In your repo on GitHub: **Settings → Pages → Build and deployment → Source → GitHub Actions**.

That's it — the included workflow (`.github/workflows/deploy.yml`) builds the site and deploys it automatically every time you push to `main`. Check the **Actions** tab for progress; after it finishes, your site is live at:

```
https://YOUR-USERNAME.github.io/YOUR-REPO/
```

## 3. Editing later

- The whole page is `src/OurStory.jsx`.
- Run it locally with:
  ```bash
  npm install
  npm run dev
  ```
  then open the local URL it prints.
- Push any changes to `main` and the site redeploys itself.

## Notes

- Photos you upload in "Edit story" mode live only in the browser's memory for that visit — they aren't saved anywhere, so they reset on refresh. If you want the trip details and photos to appear pre-filled for everyone who visits, edit the default values directly in `src/OurStory.jsx` (e.g. `useState("Ireland Trip 2026")`) before pushing.
=======
# ProjectHomecoming
>>>>>>> ab8d010cb61fdfa785ef79f8a103772d894e7339
