const ChromeLauncher = require('chrome-launcher');
const lighthouse = require('lighthouse');

const Printer = require('lighthouse/lighthouse-cli/printer');
const UrlsRepository = require('../Repository/UrlsRepository');
const Progress = require('../Model/Progress');
const Url = require('../Model/Url');
const path = require("path");
const fs = require("fs");

class LighthouseService {

    constructor(option, args) {
        this.option = option;
        this.args = args;
        this.createOutputFolder();
    }

    async start(start = count => {}, update = progress => {}) {
        ChromeLauncher.launch({
            chromeFlags: ["--headless"]
        }).then(chrome => this.runReports(start, update, chrome));
    }

    async runReports(start = count => {}, update = progress => {}, chrome) {
        let flags = {};
        flags.port = chrome.port;
        // Load the urls to test.
        let urlsRepository = new UrlsRepository(this.option, this.args);
        let urls = urlsRepository.findForRange();
        start(urls.length);
        for (let url of urls) {
            let results = await lighthouse(url.url, flags);
            await this.printReport(results, url);
            update(new Progress(url, urls.length));
        }
        chrome.kill();
    }

    /**
     *
     * @param results {*}
     * @param url Url
     * @returns {Promise<void>}
     */
    async printReport(results, url) {
        delete results.artifacts;
        await Printer.write(results, 'html', path.join(this.folder, url.name + '.html'));
        await Printer.write(results, 'json', path.join(this.folder, url.name + '.json'));
    }

    createOutputFolder() {
        this.folder = path.join(this.args.output.filename, this.args.getSiteName(), 'lighthouse');
        if (!fs.existsSync(this.folder)) {
            fs.mkdirSync(this.folder)
        }
    }
}

module.exports = LighthouseService;