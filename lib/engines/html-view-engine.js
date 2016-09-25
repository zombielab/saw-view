"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _viewEngine = require("./view-engine");

var _viewEngine2 = _interopRequireDefault(_viewEngine);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class HtmlViewEngine extends _viewEngine2.default {
    get(path, data = {}) {
        return (0, _asyncToGenerator3.default)(function* () {
            return yield new _promise2.default(function (resolve, reject) {
                _fs2.default.readFile(path, "utf-8", function (error, content) {
                    if (error) {
                        reject(error);
                    }

                    resolve(content);
                });
            });
        })();
    }
}

exports.default = HtmlViewEngine;
//# sourceMappingURL=html-view-engine.js.map