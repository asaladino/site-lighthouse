const LighthouseService = require('../Service/LighthouseService');

class LighthouseController {

    constructor(args) {
        this.args = args;
        this.logger = new (require('../Utility/Logger'))(args);
    }

    start() {
        return new Promise((resolve, reject) => {
            this.args.output.doesFolderExist();
            const lighthouseService = new LighthouseService(this.args);
            lighthouseService.on('start', progress => {
                this.logger.report(progress.toLog());
                if (this.args.verbose) {
                    console.log(progress.toString());
                }
            }).on('progress', progress => {
                this.logger.report(progress.toLog());
                if (this.args.verbose) {
                    console.log(progress.toString());
                }
            }).on('complete', progress => {
                this.logger.report(progress.toLog());
                console.log(progress.toString());
                resolve();
            });
            lighthouseService.start().then();
        });
    }
}

module.exports = LighthouseController;