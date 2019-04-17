// @flow
import * as ChromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";

import lighthouseDefaultConfig from "../Config/LighthouseDefault";
import Printer from "lighthouse/lighthouse-cli/printer";
import UrlsRepository from "../Repository/UrlsRepository";
import OptionsRepository from "../Repository/OptionsRepository";
import Args from "../Model/Args";
import Option from "../Model/Option";
import Url from "../Model/Url";
import Progress from "../Model/Progress";
import path from "path";
import fs from "fs";

export default class LighthouseService {

    events: Map<string, function>;
    args: Args;
    optionsRepository: OptionsRepository;
    urlsRepository: UrlsRepository;
    option: Option;
    folder: string;

    constructor(args: Args) {
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

    async runReports(chrome: any) {
        let flags = {};
        flags.port = chrome.port;
        let urls = this.urlsRepository.findAll().filter(url => {
            return !fs.existsSync(path.join(this.folder, url.name + '.json'));
        });
        let progress = new Progress(null, urls.length);

        this.emitStart(progress);
        for (let url of urls) {
            let results = await lighthouse(url.url, flags);
            await Printer.write(JSON.stringify(results), 'json', path.join(this.folder, url.name + '.json'));
            progress.update(url);
            this.emitProgress(progress);
        }

        this.emitComplete(new Progress(null, urls.length));
        await chrome.kill();
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
    on(event: string, callback: function) {
        this.events.set(event, callback);
        return this;
    }

    /**
     * Emits that start event.
     * @param progress {Progress} found at start.
     */
    emitStart(progress: Progress) {
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
    emitProgress(progress: Progress) {
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
    emitComplete(progress: Progress) {
        this.events.forEach((callback, event) => {
            if (event === 'complete') {
                callback(progress);
            }
        });
    }
}
