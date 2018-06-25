const ChromeLauncher = require('chrome-launcher');
const lighthouse = require('lighthouse');
const lighthouseDefaultConfig = require('../Config/LighthouseDefault');

const Printer = require('lighthouse/lighthouse-cli/printer');
const UrlsRepository = require('../Repository/UrlsRepository');
const OptionsRepository = require('../Repository/OptionsRepository');
const Url = require('../Model/Url');
const Progress = require('../Model/Progress');
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
            chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox']
        }).then(chrome => this.runReports(chrome))
            .catch(reason => console.log(reason));
    }

    async runReports(chrome) {
        let flags = {};
        flags.port = chrome.port;
        let urls = this.urlsRepository.findAll().filter(url => {
            return !fs.existsSync(path.join(this.folder, url.name + '.json'));
        });
        let progress = new Progress(null, urls.length);

        this.emitStart(progress);
        for (let url of urls) {
            let results = await lighthouse(url.url, flags, lighthouseDefaultConfig);
            await this.printReport(results, url);
            progress.update(url);
            this.emitProgress(progress);
        }

        this.emitComplete(new Progress(null, urls.length));
        await chrome.kill();
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
     * @param progress {Progress} found at start.
     */
    emitStart(progress) {
        this.events.forEach((callback, event) => {
            if (event === 'start') {
                callback(progress);
            }
        });
    }

    /**
     * Emits that progress event.
     * @param progress {Progress} that is currently having its content extracted from.
     */
    emitProgress(progress) {
        this.events.forEach((callback, event) => {
            if (event === 'progress') {
                callback(progress);
            }
        });
    }

    /**
     * Emits that complete event when service has finished.
     * @param progress {Progress} that we be done.
     */
    emitComplete(progress) {
        this.events.forEach((callback, event) => {
            if (event === 'complete') {
                callback(progress);
            }
        });
    }
}

module.exports = LighthouseService;