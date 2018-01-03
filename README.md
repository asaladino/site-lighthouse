# Site Lighthouse

This cli app will run a lighthouse report for a list of urls generated with site-index.

## Usage

If you haven't crawled the site be sure to do that first with site-index.

```
./site-index --domain "codingsimply.com" --type crawl --output "/path/to/reports/directory"
```

Then followed by running:

```
./site-lighthouse --domain "codingsimply.com"  --output "/path/to/reports/directory"
```
