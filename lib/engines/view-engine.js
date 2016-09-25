"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ViewEngine {
    get(path, data = {}) {
        return (0, _asyncToGenerator3.default)(function* () {
            throw new Error("You must override this method.");
        })();
    }
}

exports.default = ViewEngine;
//# sourceMappingURL=view-engine.js.map