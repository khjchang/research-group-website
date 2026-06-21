# UC Davis Research Group Website

Static website for the Digital System Design-Test-Verification and Fault Tolerance Research Group at UC Davis.

## Local Development

Install dependencies:

```sh
npm install
```

Start the local server:

```sh
npm start
```

The site is served by `serve`. If the default port is unavailable, run:

```sh
npm start -- -l tcp://127.0.0.1:5000
```

## Pages

- `index.html` - homepage
- `people.html` - lab members
- `projects.html` - current and past projects
- `publication.html` - publications
- `404.html` - not found page

## Managing People

The People page is data-driven. Edit `data/people.csv` to add, remove, reorder, or move
people between sections.

Important columns:

- `section` - page section, such as `PhD Students` or `Graduate Alumni`
- `name` - display name
- `role` - title shown on the card
- `image` - image path or URL
- `email_user`, `email_domain`, `email_tld` - email parts, kept split to reduce simple scraping
- `linkedin`, `github`, `scholar`, `cv` - optional profile links
- `active` - use `TRUE` to show, `FALSE` to hide
- `sort` - display order within the section

To test a future Google Sheet workflow, publish the sheet as CSV and replace
`data/people.csv` in `people.html` with the published CSV URL:

```html
<div id="people-root" data-people-source="data/people.csv">
```

## Deployment Notes

This repository is ready for static hosting, including GitHub Pages. The included
GitHub Actions workflow publishes the static files from `main`.

Current SEO defaults assume the GitHub Pages URL:

```txt
https://khjchang.github.io/research-group-website/
```

If the site moves to a custom domain, update the URLs in:

- `robots.txt`
- `sitemap.xml`
- canonical and Open Graph meta tags in each HTML page
