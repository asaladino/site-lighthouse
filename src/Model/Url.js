/**
 * Url found on the site.
 */
class Url {
    constructor(entry) {
        /**
         * Kind of like a id for file names and look up.
         * @type {string}
         */
        this.name = '';
        /**
         * Full url found on the site.
         * @type {string}
         */
        this.url = '';
        Object.assign(this, entry);
    }
}

module.exports = Url;