
const LighthouseService = require('../Service/LighthouseService');
const ProgressUtility = require('../Utility/ProgressUtility');

class LighthouseController {

    constructor(args) {
        this.args = args;
    }

    start() {
        return new Promise((resolve, reject) => {
            this.args.output.doesFolderExist();
            const lighthouseService = new LighthouseService(this.args);
            let bar;
            lighthouseService.on('start', urls => {
                if (this.args.verbose) {
                    bar = ProgressUtility.build(urls.length);
                }
            }).on('progress', message => {
                if (this.args.verbose) {
                    bar.tick(1, {message: message});
                }
            }).on('complete', () => {
                console.log('\nDone');
                resolve();
            });
            lighthouseService.start().then();
        });
    }
}

module.exports = LighthouseController;