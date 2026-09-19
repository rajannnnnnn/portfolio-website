# Portfolio Website

Personal portfolio for Rajan N — Applied AI Engineer. Plain HTML/CSS/JS, no build step, deployed via GitHub Actions to GitHub Pages.

## Local preview

Open `index.html` directly in a browser, or serve it locally:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deployment

Pushes to `main` or `claude/epic-mayer-gd63dg` trigger `.github/workflows/deploy.yml`, which publishes the site to GitHub Pages.
