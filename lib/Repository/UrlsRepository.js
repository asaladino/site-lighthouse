"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _Url = _interopRequireDefault(require("../Model/Url"));

var _Args = _interopRequireDefault(require("../Model/Args"));

var _Option = _interopRequireDefault(require("../Model/Option"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UrlsRepository {
  constructor(option, args) {
    this.option = option;
    this.args = args;
  }

  findAll() {
    let urlsFile = _path.default.join(this.args.output.filename, this.args.getSiteName(), 'urls', 'urls.json');

    return JSON.parse(_fs.default.readFileSync(urlsFile).toString()).map(entry => new _Url.default(entry));
  }

}

exports.default = UrlsRepository;
//# sourceMappingURL=UrlsRepository.js.map