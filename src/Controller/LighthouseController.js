// @flow
import LighthouseService from "../Service/LighthouseService";
import Args from "../Model/Args";
import Logger from "../Utility/Logger";

export default class LighthouseController {

    args: Args;
    logger: Logger;

    constructor(args: Args) {
        this.args = args;
        this.logger = new Logger(args);
    }

    start(callback: function = (event, progress) => {}): Promise<void> {
        return new Promise((resolve, reject) => {
            this.args.output.doesFolderExist();
            const lighthouseService = new LighthouseService(this.args);
            lighthouseService.on('start', progress => {
                callback('start', progress);
                this.logger.report(progress.toLog());
                if (this.args.verbose) {
                    console.log(progress.toString());
                }
            }).on('progress', progress => {
                callback('progress', progress);
                this.logger.report(progress.toLog());
                if (this.args.verbose) {
                    console.log(progress.toString());
                }
            }).on('complete', progress => {
                callback('complete', progress);
                this.logger.report(progress.toLog());
                if (this.args.verbose) {
                    console.log(progress.toString());
                }
                resolve();
            });
            lighthouseService.start().then();
        });
    }
}
