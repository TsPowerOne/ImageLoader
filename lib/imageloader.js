"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fileloader_1 = require("@tspower/fileloader");
var core_1 = require("@tspower/core");
var rxjs_1 = require("rxjs");
var stili = require("./imageloader.styl");
var spinner_1 = require("@tspower/spinner");
stili.default;
var ImageLoader = /** @class */ (function () {
    function ImageLoader(Root, Id, InputName, Src, Autosave, Url, Style, ButtonStyle, ImageStyle, DisplayUploadButton) {
        if (DisplayUploadButton === void 0) { DisplayUploadButton = false; }
        var _this = this;
        this.Root = Root;
        this.Id = Id;
        this.InputName = InputName;
        this.Src = Src;
        this.Autosave = Autosave;
        this.Url = Url;
        this.Style = Style;
        this.ButtonStyle = ButtonStyle;
        this.ImageStyle = ImageStyle;
        this.DisplayUploadButton = DisplayUploadButton;
        this.uploaded = new rxjs_1.Subject();
        this.uploaded$ = this.uploaded.asObservable();
        this.FileName = null;
        this.Init = function () {
            _this.spinner.style.display = "none";
            _this.fileLoader.changed$.subscribe(function (val) {
                var that = _this;
                var selectedFile = val[0];
                var reader = new FileReader();
                _this.image.title = selectedFile.name;
                _this.FileName = selectedFile.name;
                reader.onload = function (event) {
                    that.image.src = event.target.result;
                };
                reader.readAsDataURL(selectedFile);
                _this.enableButton(_this.btn_erase);
                _this.enableButton(_this.btn_load);
                if (_this.Autosave) {
                    var status_1 = {
                        id: _this.Id,
                        name: _this.InputName,
                        fileName: _this.FileName,
                        file: selectedFile
                    };
                    core_1.setCookie("imageloader_" + _this.Id + "_" + _this.InputName, status_1);
                }
            });
            _this.btn_load.addEventListener("click", function (event) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (this.DisplayUploadButton == true && this.Url != null && this.InputName != null) {
                        this.spinner.style.display = 'block';
                        this.uploaded.next(this.fileLoader.send(this.Url, this.InputName));
                    }
                    return [2 /*return*/];
                });
            }); });
            _this.uploaded$.subscribe(function (promise) {
                promise.then(function () {
                    _this.spinner.style.display = 'none';
                    _this.disableButton(_this.btn_erase);
                    _this.disableButton(_this.btn_load);
                }).catch(function () {
                    _this.spinner.style.display = 'none';
                    _this.disableButton(_this.btn_load);
                });
            });
            _this.btn_erase.addEventListener("click", function (event) {
                _this.image.src = (_this.Src) ? _this.Src : "";
                _this.image.title = (_this.Src) ? "placeholder" : "";
            });
            if (!_this.DisplayUploadButton) {
                _this.btn_load.style.display = "none";
            }
            if (_this.Autosave) {
                var that_1 = _this;
                var status_2 = core_1.getCookie("imageloader_" + _this.Id + "_" + _this.InputName);
                if (status_2) {
                    var reader = new FileReader();
                    _this.image.title = status_2.fileName;
                    _this.FileName = status_2.name;
                    reader.onload = function (event) {
                        that_1.image.src = event.target.result;
                    };
                    reader.readAsDataURL(status_2.file);
                }
            }
        };
        this.create = function () {
            var stile = (_this.Style) ? "style=\"" + _this.Style + "\"" : null;
            var imgStile = (_this.ImageStyle) ? "style=\"" + _this.ImageStyle + "\"" : null;
            var ButtonStyle = (_this.ButtonStyle) ? "style=\"" + _this.ButtonStyle : null;
            var Id = (_this.Id) ? "id=" + _this.Id : null;
            var src = (_this.Src) ? "src=" + _this.Src : null;
            var template = "<div " + ((Id) ? Id : "") + "  " + ((stile) ? stile : "") + " class=\"ts-imageloader\" >\n                            <div spinner >" + _this.spinnerTemplate + "</div>\n                            <img " + ((src) ? src : "") + "  " + ((imgStile) ? imgStile : "") + " />\n                            <button upload " + ((ButtonStyle) ? ButtonStyle : "") + " disabled > Upload </button>\n                            <button erase disabled >Erase</button>\n                        </div>";
            var t = core_1.htmlParse(template);
            return t;
        };
        this.enableButton = function (button) {
            button.removeAttribute("disabled");
        };
        this.disableButton = function (button) {
            button.setAttribute("disabled", '');
        };
        this.setUploadUrl = function (value) {
            _this.Url = value;
        };
        this.setInputName = function (value) {
            _this.InputName = value;
        };
        this.upload = function () {
            if (_this.Url != null && _this.InputName != null)
                _this.uploaded.next(_this.fileLoader.send(_this.Url, _this.InputName));
        };
        this.erase = function () {
            _this.image.src = (_this.Src) ? _this.Src : "";
            _this.image.title = (_this.Src) ? "placeholder" : "";
            _this.disableButton(_this.btn_erase);
        };
        this.setAutosave = function (autosave) { return _this.Autosave = autosave; };
        this.spinnerTemplate = new spinner_1.spinner("sfere").template;
        this.tag = this.create();
        this.spinner = this.tag.querySelector("div[spinner]");
        this.image = this.tag.querySelector("img");
        this.btn_load = this.tag.querySelector("button[upload]");
        this.btn_erase = this.tag.querySelector("button[erase]");
        this.fileLoader = new fileloader_1.FileLoader(this.tag, false);
        this.Root.appendChild(this.tag);
        this.Init();
    }
    return ImageLoader;
}());
exports.ImageLoader = ImageLoader;
