const ChromeLauncher = require('chrome-launcher');
const lighthouse = require('lighthouse');

const Printer = require('lighthouse/lighthouse-cli/printer');
const UrlsRepository = require('../Repository/UrlsRepository');
const OptionsRepository = require('../Repository/OptionsRepository');
const Url = require('../Model/Url');
const path = require("path");
const fs = require("fs");

class LighthouseService {

    constructor(args) {
        this.events = new Map();
        this.args = args;
        this.optionsRepository = new OptionsRepository(this.args);
        this.option = this.optionsRepository.getOption();
        this.urlsRepository = new UrlsRepository(this.option, this.args);
        this.createOutputFolder();
    }

    async start() {
        ChromeLauncher.launch({
            chromeFlags: ["--headless"]
        }).then(chrome => this.runReports(chrome));
    }

    async runReports(chrome) {
        let flags = {};
        flags.port = chrome.port;
        let urls = this.urlsRepository.findForRange().filter(url => {
            return !fs.existsSync(path.join(this.folder, url.name + '.json'));
        });
        this.emitStart(urls);
        for (let url of urls) {
            let results = await lighthouse(url.url, flags);
            await this.printReport(results, url);
            this.emitProgress('checking: ' + url.name + '.json');
        }
        this.emitComplete();
        chrome.kill();
    }

    /**
     * Print html and json reports.
     * @param results {*}
     * @param url {Url}
     * @returns {Promise<void>}
     */
    async printReport(results, url) {
        delete results.artifacts;
        await Printer.write(results, 'json', path.join(this.folder, url.name + '.json'));
    }

    /**
     * Create the output folder if it doesn't exist.
     */
    createOutputFolder() {
        this.folder = path.join(this.args.output.filename, this.args.getSiteName(), 'lighthouse');
        if (!fs.existsSync(this.folder)) {
            fs.mkdirSync(this.folder)
        }
    }

    /**
     * Receive event information.
     * @param event {string} name of the event. (start, progress, and complete)
     * @param callback {Function} called when the event is emitted.
     * @returns {LighthouseService} for chaining.
     */
    on(event, callback) {
        this.events.set(event, callback);
        return this;
    }

    /**
     * Emits that start event.
     * @param urls {[Url]} found at start.
     */
    emitStart(urls) {
        this.events.forEach((callback, event) => {
            if (event === 'start') {
                callback(urls);
            }
        });
    }

    /**
     * Emits that progress event.
     * @param url {string} that is currently having its content extracted from.
     */
    emitProgress(url) {
        this.events.forEach((callback, event) => {
            if (event === 'progress') {
                callback(url);
            }
        });
    }

    /**
     * Emits that complete event when service has finished.
     */
    emitComplete() {
        this.events.forEach((callback, event) => {
            if (event === 'complete') {
                callback();
            }
        });
    }
}

module.exports = LighthouseService;