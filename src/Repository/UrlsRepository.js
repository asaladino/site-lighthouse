// @flow
import fs from "fs";
import Url from "../Model/Url";
import Args from "../Model/Args";
import Option from "../Model/Option";
import path from "path";

export default class UrlsRepository {
    option: Option;
    args: Args;

    constructor(option: Option, args: Args) {
        this.option = option;
        this.args = args;
    }

    findAll() {
        let urlsFile = path.join(this.args.output.filename, this.args.getSiteName(), 'urls', 'urls.json');
        return JSON.parse(fs.readFileSync(urlsFile).toString()).map(entry => new Url(entry));
    }
}
