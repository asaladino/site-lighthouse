// @flow

/**
 * Url found on the site.
 */
export default class Url {

    /**
     * Kind of like a id for file names and look up.
     */
    name: string;
    /**
     * Full url found on the site.
     */
    url: string;

    constructor(entry: any) {
        this.name = '';
        this.url = '';
        Object.assign(this, entry);
    }
}
