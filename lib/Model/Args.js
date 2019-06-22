"use strict";Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _FileDetails=_interopRequireDefault(require("./FileDetails"));var _path=_interopRequireDefault(require("path"));var _fs=_interopRequireDefault(require("fs"));function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}/**
 * Commandline arguments being passed to the app.
 */class Args{/**
     * Project directory to output the app results.
     */ /**
     * Domain being indexed.
     */ /**
     * Should progress information be output to the console?
     */constructor(params){this.verbose=true;Object.assign(this,params)}/**
     * If the mandatory options are not passed then show the menu.
     * @returns {boolean} true if the mandatory options are not passed.
     */shouldShowHelp(){return this.hasOwnProperty("help")||!this.domain||!this.output}/**
     * Get the site name from the domain.
     * @returns {string} the site name.
     */getSiteName(){return this.domain.replace(/[.]/g,"_")}/**
     * Get the project folder which the output + the site name. Also, it will be created if it doesn't exist.
     * @returns {string} the project path.
     */getProjectPath(){let siteName=this.getSiteName();let projectPath=_path.default.join(this.output.filename,siteName);if(!_fs.default.existsSync(projectPath)){_fs.default.mkdirSync(projectPath)}return projectPath}}exports.default=Args;
//# sourceMappingURL=Args.js.map