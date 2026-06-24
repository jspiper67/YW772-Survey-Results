# YW-772 Survey Dashboard

A free, GitHub Pages-ready React dashboard for YW-772 COMSEC Seminar survey results.

## What is included

- React + Vite project structure
- Recharts visualizations
- GitHub Pages workflow
- CSV export button
- Course filtering, tabs, sortable tables, comments, CCN score tracking

## Before publishing publicly

Review `src/App.jsx` for any information you do not want public, especially:

- Instructor names
- Course identifiers
- Survey comments
- Any internal acronyms or organizational references

## Run it on your computer

Install Node.js first: https://nodejs.org/

Then run:

```bash
npm install
npm run dev
```

Open the local URL that Vite prints in the terminal.

## Publish for free with GitHub Pages

1. Create a new GitHub repository.
2. Upload all files from this folder to the repository.
3. Go to **Settings** → **Pages**.
4. Under **Build and deployment**, choose **GitHub Actions**.
5. Push to the `main` branch.
6. GitHub will build and publish the site automatically.

Your public site will usually appear at:

```text
https://YOUR-GITHUB-USERNAME.github.io/YOUR-REPO-NAME/
```

## Updating future survey data

For now, edit the `RAW_SURVEYS` array in `src/App.jsx`, then commit and push the change.
GitHub Pages will rebuild automatically.
