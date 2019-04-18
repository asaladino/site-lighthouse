// @flow
import FileDetails from "./FileDetails";
import path from "path";
import fs from "fs";

/**
 * Commandline arguments being passed to the app.
 */
export default class Args {
    /**
     * Project directory to output the app results.
     */
    output: FileDetails;
    /**
     * Domain being indexed.
     */
    domain: string;
    /**
     * Should progress information be output to the console?
     */
    verbose: boolean;

    constructor(params: any) {
        this.verbose = true;
        Object.assign(this, params);
    }

    /**
     * If the mandatory options are not passed then show the menu.
     * @returns {boolean} true if the mandatory options are not passed.
     */
    shouldShowHelp(): boolean {
        return this.hasOwnProperty('help') || !this.domain || !this.output;
    }

    /**
     * Get the site name from the domain.
     * @returns {string} the site name.
     */
    getSiteName(): string {
        return this.domain.replace(/[.]/g, '_');
    }

    /**
     * Get the project folder which the output + the site name. Also, it will be created if it doesn't exist.
     * @returns {string} the project path.
     */
    getProjectPath() {
        let siteName = this.getSiteName();
        let projectPath = path.join(this.output.filename, siteName);
        if (!fs.existsSync(projectPath)) {
            fs.mkdirSync(projectPath);
        }
        return projectPath;
    }
}

