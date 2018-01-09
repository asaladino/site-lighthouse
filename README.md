# Site Lighthouse

This cli app will run a lighthouse report for a list of urls generated with site-index.

## Usage

If you haven't crawled the site be sure to do that first with site-index.

```
./site-index --verbose --html --domain "codingsimply.com" --type crawl --output "/path/to/reports/directory"
./site-lighthouse  --verbose --domain "codingsimply.com"  --output "/path/to/reports/directory"
```

Domain and output folder are required parameters. To see a list of parameters, run
```
Site Lighthouse

  Generates lighthouse reports for a domain. 

Options

  --domain www.domain.com   (Required) Domain to run the reports on.    
  --output file             (Required) Folder to output the reports to. 
  --verbose                 Output information on the reporting.        
  --help                    Print this usage guide.  
```