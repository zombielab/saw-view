"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ViewCompiler {
    isExpired(path) {
        return (0, _asyncToGenerator3.default)(function* () {
            throw new Error("You must override this method.");
        })();
    }

    compiled(path) {
        throw new Error("You must override this method.");
    }

    compile(path) {
        return (0, _asyncToGenerator3.default)(function* () {
            throw new Error("You must override this method.");
        })();
    }
}

exports.default = ViewCompiler;
//# sourceMappingURL=view-compiler.js.map