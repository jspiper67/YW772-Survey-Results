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

## Updating survey data after publishing

The dashboard now includes an **Import CSV/JSON** button in the top control bar.

Supported import formats:

- **CSV** exported from the dashboard using **Export CSV**
- **JSON** exported from the dashboard using **Export JSON**

Imported rows are merged into the dashboard and saved in the browser's local storage. This means the imported data will stay available on that computer/browser after refresh.

Important: because GitHub Pages is free static hosting, the import button does **not** write new data back to GitHub automatically. To make new survey results permanently public for everyone, import the rows, click **Export JSON**, and then use that JSON as the updated source data in the repo.

## Raw Data tab

The Raw Data screen now has a horizontal scrollbar under the table so all 18 question columns and comments can be viewed.
