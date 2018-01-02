const Url = require('./Url');

/**
 * Class for reporting the progress.
 */
class Progress {

    /**
     * Build a progress object.
     * @param url {Url} current url
     * @param urls {Number} found.
     */
    constructor(url, urls) {
        this.url = url;
        this.urls = urls;
    }
}

module.exports = Progress;